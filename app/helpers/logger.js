const winston = require("winston");
const options = {
  file: {
    level: "info",
    filename: `../logs/error.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: true,
  },
  console: {
    level: "info",
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};
const logger = winston.createLogger({
  transports: [new winston.transports.File(options.file)],
  exitOnError: false,
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}
module.exports = logger;
