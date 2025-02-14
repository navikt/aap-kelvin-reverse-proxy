import 'dotenv/config';
import express from 'express';
import internalRoutes from "./internal/internalRoutes";
import {validateTokenOrRedirectToLogin} from "./auth/tokenValidation";
import {setupProxies} from "./reverseproxy/reverseProxy";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/internal', internalRoutes);

app.use(validateTokenOrRedirectToLogin);

setupProxies(app);

app.listen(port, () => {
  console.log(`Server now listening on port: ${port}`);
});
