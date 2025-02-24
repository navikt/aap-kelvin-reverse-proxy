import { describe, expect, it } from "vitest";
import {proxyConfigWithTrailingSlash} from "./index";


describe('index', () => {
  it('proxyConfigWithTrailingSlash', () => {
    const redirectUrlSaksbeh = proxyConfigWithTrailingSlash('/saksbehandling');
    expect(redirectUrlSaksbeh).toBe('http://saksbehandling/saksbehandling/');
    const redirectUrlOppg = proxyConfigWithTrailingSlash('/oppgave');
    expect(redirectUrlOppg).toBe('http://produksjonsstyring/oppgave/');
    const redirectUrlPost = proxyConfigWithTrailingSlash('/postmottak');
    expect(redirectUrlPost).toBe('http://postmottak/postmottak/');
  })
})
