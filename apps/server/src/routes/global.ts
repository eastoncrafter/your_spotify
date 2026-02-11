import { Router } from "express";
import { z } from "zod";
import { getGlobalPreferences, updateGlobalPreferences } from "../database";
import { admin, logged, validate } from "../tools/middleware";
import { getWithDefault } from "../tools/env";

export const router = Router();

// Middleware to check if offline mode is enabled
const blockIfOffline = (req: any, res: any, next: any) => {
  const offlineMode = getWithDefault("OFFLINE_MODE", false);
  if (offlineMode) {
    res.status(403).send({ code: "OFFLINE_MODE", message: "Write operations are disabled in offline mode" });
    return;
  }
  next();
};

router.get("/preferences", async (req, res) => {
  const preferences = await getGlobalPreferences();
  res.status(200).send(preferences);
});

const updateGlobalPreferencesSchema = z.object({
  allowRegistrations: z.boolean().optional(),
  allowAffinity: z.boolean().optional(),
});

router.post("/preferences", blockIfOffline, logged, admin, async (req, res) => {
  const modifications = validate(req.body, updateGlobalPreferencesSchema);

  const newPrefs = await updateGlobalPreferences(modifications);
  res.status(200).send(newPrefs);
});
