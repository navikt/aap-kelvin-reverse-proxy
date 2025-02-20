import url from "node:url";
import { Router } from "express";
import { getToken, requestAzureOboToken } from "@navikt/oasis";
import proxy, { ProxyOptions } from "express-http-proxy";
import { logInfo, logWarning } from "../logger/logger";

const xTimestamp = "x-Timestamp";
const stripTrailingSlash = (str: string) =>
  str.endsWith("/") ? str.slice(0, -1) : str;
export interface ProxyConfig {
  path: string;
  scope: string;
  url: string;
}
const apper: ProxyConfig[] = [
  {
    path: "/oppgavestyring-frontend",
    scope: process.env.OPPGAVESTYRING_FRONTEND_SCOPE || "",
    url: "http://oppgavestyring-frontend",
  },
  {
    path: "/oppgave",
    scope: process.env.PRODUKSJONSSTYRING_SCOPE || "",
    url: "http://produksjonsstyring",
  },
  {
    path: "/saksbehandling",
    scope: process.env.SAKSBEHANDLING_SCOPE || "",
    url: "http://saksbehandling",
  },
  {
    path: "/postmottak",
    scope: process.env.POSTMOTTAK_SCOPE || "",
    url: "http://postmottak",
  },
];
export const proxyOptions = (application: ProxyConfig) =>
  ({
    parseReqBody: false,
    timeout: 60_000,
    proxyReqOptDecorator: (options, req) => {
      const requestTime = Date.now();

      // I tilfelle headers er undefined.
      options.headers = options.headers ?? {};

      options.headers[xTimestamp] = requestTime;
      delete options.headers.cookie;

      return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV === "localhost") {
          console.log("Running locally, skipping authentication");
          resolve(options);
          return;
        }
        // Vi har allerede validert token før vi kommer hit. Så dette burde aldri inntreffe
        const token = getToken(req);
        if (!token) {
          logWarning(
            "Fant ikke Wonderwall token ved OBO-utveksling. Dette burde ikke inntreffe"
          );
          reject(new Error("Intet Wonderwall token"));
        }
        if (token) {
          requestAzureOboToken(token, application.scope).then((obo) => {
            if (obo.ok) {
              logInfo(`Token veksling tok: (${Date.now() - requestTime}ms)`);
              // I tilfelle headers er undefined.
              options.headers = options.headers ?? {};
              options.headers.Authorization = `Bearer ${obo.token}`;
              resolve(options);
            } else {
              logWarning(`OBO-utveklsing for ${application.scope} feilet.`);
              reject(obo.error); // NOSONAR: Sonarcloud forstår ikke at obo.error er et Error objekt. Dermed gir den en false positive.
            }
          });
        }
      });
    },
    proxyReqPathResolver: (req) => {
      const urlFromApi = url.parse(application.url);
      const pathFromApi =
        urlFromApi.pathname === "/" ? "" : urlFromApi.pathname;

      const urlFromRequest = url.parse(req.originalUrl);
      const pathFromRequest = urlFromRequest.pathname;

      const queryString = urlFromRequest.query;
      const newPath =
        (pathFromApi || "") +
        (pathFromRequest || "") +
        (queryString ? `?${queryString}` : "");

      logInfo(
        `Proxying request from '${req.originalUrl}' to '${stripTrailingSlash(urlFromApi.href)}${newPath}'`
      );
      return newPath;
    },
    userResHeaderDecorator: (
      headers,
      userReq,
      _userRes,
      proxyReq,
      proxyRes
    ) => {
      // FPSAK og TILBAKE sender er redirect med full hostname - dette må man modifisere slik at det går tilbake via proxy.
      const location = proxyRes.headers.location;
      if (location?.includes(application.url)) {
        headers.location = location.split(application.url)[1];
        logInfo(`Location header etter endring: ${headers.location}`);
      }
      const { statusCode } = proxyRes;
      const requestTime = Date.now() - Number(proxyReq.getHeader(xTimestamp));
      const melding = `${statusCode} ${proxyRes.statusMessage}: ${userReq.method} - ${userReq.originalUrl} (${requestTime}ms)`;
      const callIdValue = proxyReq.getHeader("Nav-Callid");
      if (Number(statusCode) >= 500) {
        logWarning(melding, { "Nav-Callid": callIdValue });
      } else {
        logInfo(melding, { "Nav-Callid": callIdValue });
      }
      return headers;
    },
    proxyErrorHandler: function (err, res, next) {
      switch (err?.code) {
        case "ENOTFOUND": {
          logWarning(`${err}, with code: ${err.code}`);
          return res.status(404).send();
        }
        case "ECONNRESET": {
          return res.status(504).send();
        }
        case "ECONNREFUSED": {
          return res.status(500).send();
        }
        default: {
          logWarning(`${err}, with code: ${err.code}`);
          next(err);
        }
      }
    },
  }) satisfies ProxyOptions;

export const setupProxies = (router: Router) => {
  for (const application of apper) {
    router.use(
      `${application.path}/*`,
      (request, _response, next) => {
        // @ts-ignore hva skjer her
        if (request.timedout) {
          logWarning(`Request for ${request.originalUrl} timed out!`);
        } else {
          next();
        }
      },
      proxy(application.url, proxyOptions(application))
    );
  }
};
