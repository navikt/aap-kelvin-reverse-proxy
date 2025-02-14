import {logError} from "../logger/logger";

export function isLocal() {
  if(!process.env.NEXT_PUBLIC_ENVIRONMENT) {
    logError('Mangler NEXT_PUBLIC_ENVIRONMENT');
    throw new Error('Mangler NEXT_PUBLIC_ENVIRONMENT');
  }
  return process.env.NEXT_PUBLIC_ENVIRONMENT === 'localhost';
}