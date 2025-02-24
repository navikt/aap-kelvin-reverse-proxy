import { describe, expect, it } from "vitest";
import {proxyConfigWithTrailingSlash} from "./index";


describe('index', () => {
  it('proxyConfigWithTrailingSlash', () => {
    const redirectUrlSaksbeh = proxyConfigWithTrailingSlash('/saksbehandling');
    expect(redirectUrlSaksbeh).toBe('/saksbehandling/');
    const redirectUrlOppg = proxyConfigWithTrailingSlash('/oppgave');
    expect(redirectUrlOppg).toBe('/oppgave/');
    const redirectUrlPost = proxyConfigWithTrailingSlash('/postmottak');
    expect(redirectUrlPost).toBe('/postmottak/');
  })
})
