export interface ProxyConfig {
  path: string;
  scope: string;
  url: string;
}
export const config: ProxyConfig[] = [
  {
    path: "/oppgave",
    scope: process.env.PRODUKKSJONSSTYRING_SCOPE || '',
    url: "http://produksjonsstyring",
  },
  {
    path: "/saksbehandling",
    scope: process.env.SAKSBEHANDLING_SCOPE || '',
    url: "http://saksbehandling",
  },
  {
    path: "/postmottak",
    scope: process.env.POSTMOTTAK_SCOPE || '',
    url: "http://postmottak",
  },
]
