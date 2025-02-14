import type {Request as ExpressRequest} from 'express';
import { describe, expect, it } from "vitest";
import type {ProxyConfig} from "./reverseProxy";
import {proxyOptions} from "./reverseProxy";

const config: ProxyConfig = {
    path: "/oppgavestyring-frontend",
    scope: "api://dev-gcp.aap.oppgavestyring-frontend/.default",
    url: "http://oppgavestyring-frontend",
  };
const proxyOpts = proxyOptions(config);

describe('reverse proxy', () => {
  it('proxyReqPathResolver', () => {
    const myReq = new Request('https://kelvin.ansatt.nav.no/oppgavestyring-frontend?hei=hei&hallo=hei');
    // @ts-ignore
    myReq.originalUrl = 'https://kelvin.ansatt.nav.no/oppgavestyring-frontend?hei=hei&hallo=hei';
    const path = proxyOpts.proxyReqPathResolver(myReq as unknown as ExpressRequest)
    expect(path).toBe('/oppgavestyring-frontend?hei=hei&hallo=hei');
  })
})
