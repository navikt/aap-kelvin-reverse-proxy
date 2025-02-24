import type {Request as ExpressRequest} from 'express';
import { describe, expect, it } from "vitest";
import type {ProxyConfig} from "../config";
import {proxyOptions} from "./reverseProxy";

const config: ProxyConfig = {
    path: "/oppgavestyring-frontend",
    scope: "api://dev-gcp.aap.oppgavestyring-frontend/.default",
    url: "http://oppgavestyring-frontend",
  };
const proxyOpts = proxyOptions(config);

describe('reverse proxy', () => {
  it('proxyReqPathResolver', () => {
    const myReq = new Request('https://kelvin.ansatt.nav.no/oppgaves?hei=hei&hallo=hei');
    // @ts-ignore
    myReq.originalUrl = 'https://kelvin.ansatt.nav.no/oppgave?hei=hei&hallo=hei';
    const path = proxyOpts.proxyReqPathResolver(myReq as unknown as ExpressRequest)
    expect(path).toBe('/oppgave?hei=hei&hallo=hei');
  })
})
