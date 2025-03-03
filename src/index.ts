import 'dotenv/config';
import express from 'express';
import internalRoutes from "./internal/internalRoutes";
import {validateTokenOrRedirectToLogin} from "./auth/tokenValidation";
import {setupProxies} from "./reverseproxy/reverseProxy";
import {config, ProxyConfig} from "./config";
import {logInfo} from "./logger/logger";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/internal', internalRoutes);

app.use(validateTokenOrRedirectToLogin);

setupProxies(app);

// Kelvinsøk fra felles appheader
app.post('/api/kelvinsok', (_req, res, _next) => {
  return res.redirect(307, '/saksbehandling/api/kelvinsok');
});

app.use('*', (req, res, next) => {
  // redirect til oppgavelisten fra rot
  if(req.originalUrl === '/') {
    return res.redirect('/oppgave/');
  }
  // fang opp urler til fagsystemer uten trailing /
  const redirectUrl = proxyConfigWithTrailingSlash(req.originalUrl);
  if(redirectUrl){
    logInfo(`redirecting from ${req.originalUrl} to ${redirectUrl}`);
    return res.redirect(redirectUrl)
  } else {
    next();
  }
});

app.listen(port, () => {
  console.log(`Server now listening on port: ${port}`);
});

export function proxyConfigWithTrailingSlash(url: string): string {
  const app = config.find((app: ProxyConfig) => url === app.path);
  return app ? `${url}/` : '';
}
