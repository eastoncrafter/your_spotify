import { Request, Response, NextFunction } from "express";
import { getWithDefault } from "./env";

/**
 * Middleware to block write operations when in offline mode
 * Returns 403 with OFFLINE_MODE error code
 */
export const blockIfOffline = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const offlineMode = getWithDefault("OFFLINE_MODE", false);
  if (offlineMode) {
    res.status(403).send({
      code: "OFFLINE_MODE",
      message: "Write operations are disabled in offline mode",
    });
    return;
  }
  next();
};
