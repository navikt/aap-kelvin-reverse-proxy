import { NextFunction, Request, Response } from "express-serve-static-core";
import { getToken, validateAzureToken } from "@navikt/oasis";
import {isLocal} from "../utils/environment";
import {logWarning} from "../logger/logger";

export async function validateTokenOrRedirectToLogin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const requestHeaders =  req.headers;

  if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'localhost') {
    console.log('Running locally, skipping authentication');
    return;
  }
  // @ts-ignore
  const redirectPath = requestHeaders?.get('x-path');

  const token = getAccessToken(req);
  if (!token) {
    res.redirect(`/oauth2/login?redirect=${redirectPath}`);
  }

  const validationResult = await validateAzureToken(token);
  if (validationResult.ok) {
    return next();
  } else {
    logWarning('validateAzureToken', validationResult.error);
    res.redirect(`/oauth2/login?redirect=${redirectPath}`);
  }
}

export function getAccessToken(req: Request): string {
  if (isLocal()) return 'fake-token';
  return getToken(req) || '';
}
