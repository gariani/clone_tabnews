import session from "models/session";
import * as cookie from "cookie";

import {
  InternalServerError,
  MethodNotAllowedError,
  ValidationError,
  NotFoundError,
  AlreadyExistsError,
  UnauthorizedError,
  AuthenticationError,
  InvalidSessionError,
} from "infra/errors";

function onNoMatchHandler(request, response) {
  const publicErrorObject = new MethodNotAllowedError();
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

function onErrorHandler(error, request, response) {
  if (error instanceof ValidationError) {
    return response.status(error.statusCode).json(error);
  } else if (error instanceof NotFoundError) {
    return response.status(error.statusCode).json(error);
  } else if (error instanceof AlreadyExistsError) {
    return response.status(error.statusCode).json(error);
  } else if (error instanceof UnauthorizedError) {
    return response.status(error.statusCode).json(error);
  } else if (error instanceof AuthenticationError) {
    return response.status(error.statusCode).json(error);
  } else if (error instanceof InvalidSessionError) {
    return response.status(error.statusCode).json(error);
  }
  const publicErrorObject = new InternalServerError({
    cause: error,
    statusCode: error.statusCode,
  });
  response.status(500).json(publicErrorObject);
}

function setSessionCookie(sessionToken, expiresAt, response) {
  const setCookie = cookie.serialize("session_id", sessionToken, {
    path: "/",
    maxAge: session.getExpiration() / 1000,
    expires: new Date(expiresAt),
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  });

  response.setHeader("Set-Cookie", setCookie);
}

function clearSessionCookie(response) {
  const setCookie = cookie.serialize("session_id", "invalid", {
    path: "/",
    maxAge: -1,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });

  response.setHeader("Set-Cookie", setCookie);
}

const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
  setSessionCookie,
  clearSessionCookie,
};

export default controller;
