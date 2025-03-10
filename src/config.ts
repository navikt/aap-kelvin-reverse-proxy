export interface ProxyConfig {
  path: string;
  scope: string;
  url: string;
}
export const config: ProxyConfig[] = [
  {
    path: "/oppgave",
    scope: process.env.SAKSBEHANDLING_SCOPE || '',
    url: "http://saksbehandling",
  },
  {
    path: "/saksbehandling",
    scope: process.env.SAKSBEHANDLING_SCOPE || '',
    url: "http://saksbehandling",
  },
  {
    path: "/postmottak",
    scope: process.env.SAKSBEHANDLING_SCOPE || '',
    url: "http://saksbehandling",
  },
]
