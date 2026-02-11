import http from "http";
import { dbLoop } from "../spotify/looper";
import { app } from "../app";
import { logger } from "../tools/logger";
import { checkBlacklistConsistency, connect } from "../database";
import { get, getWithDefault } from "../tools/env";
import { fixRunningImportsAtStart } from "../database/queries/importer";

export function startServer() {
  const port = getWithDefault("PORT", 8080);
  const offlineMode = getWithDefault("OFFLINE_MODE", false);
  app.set("port", port);

  const server = http.createServer(app);

  function onError(error: any) {
    if (error.syscall !== "listen") {
      throw error;
    }

    const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case "EACCES":
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  function onListening() {
    const addr = server.address();
    const bind =
      typeof addr === "string" ? `pipe ${addr}` : `port ${addr?.port}`;
    logger.debug(`Listening on ${bind}`);
    if (offlineMode) {
      logger.info("Running in OFFLINE MODE - no Spotify API calls or data imports");
    }
  }

  connect()
    .then(async () => {
      server.listen(port);
      server.on("error", onError);
      server.on("listening", onListening);
      if (!offlineMode) {
        fixRunningImportsAtStart().catch(logger.error);
        checkBlacklistConsistency().catch(logger.error);
        const domain = get("CLIENT_ENDPOINT");
        if (domain.toLowerCase().includes("spotify")) {
          logger.warn(
            "Spotify was detected in CLIENT_ENDPOINT, Google might mark your entire domain as deceptive. https://github.com/Yooooomi/your_spotify/pull/254",
          );
        }
        dbLoop().catch(logger.error);
      } else {
        logger.info("Skipping background tasks (offline mode)");
      }
    })
    .catch(console.error);
}
