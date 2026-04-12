import fs from "fs"
import path from "path"
import pino from "pino"

const logsDir = path.resolve("logs")
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true })
}

export const logger = pino({
  level: "info",
  base: undefined,
  timestamp: pino.stdTimeFunctions.isoTime,
  transport:  process.env.NODE_ENV === "production"
 ? {
      targets: [
        {
          target: "pino/file",
          options: { destination: path.join(logsDir, "error.log") },
          level: "error"
        },
        {
          target: "pino/file",
          options: { destination: path.join(logsDir, "info.log") },
          level: "info"
        }
      ]
    }
    : {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
          ignore: "pid,hostname"
        }
      } 
})
