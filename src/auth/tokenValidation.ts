import { NextFunction, Request, Response } from "express-serve-static-core";
import { getToken, validateAzureToken } from "@navikt/oasis";
import {logWarning} from "../logger/logger";

export async function validateTokenOrRedirectToLogin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  if (process.env.NODE_ENV === 'localhost') {
    console.log('Running locally, skipping authentication');
    next();
    return;
  }
  const redirectPath = req.headers?.['x-path'];


  const token = getToken(req) || '';
  if (!token) {
    res.redirect(`/oauth2/login?redirect=${redirectPath}`);
  }

  const validationResult = await validateAzureToken(token);
  if (validationResult.ok) {
    next();
    return;
  } else {
    logWarning('validateAzureToken', validationResult.error);
    res.redirect(`/oauth2/login?redirect=${redirectPath}`);
  }
}
