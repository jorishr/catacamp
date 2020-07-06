const winston=require("winston"),options={file:{level:"info",filename:"../logs/error.log",handleExceptions:!0,json:!0,maxsize:5242880,maxFiles:5,colorize:!0},console:{level:"debug",handleExceptions:!0,json:!1,colorize:!0}},logger=winston.createLogger({transports:[new winston.transports.File(options.file)],exitOnError:!1});"production"!==process.env.NODE_ENV&&logger.add(new winston.transports.Console({format:winston.format.simple()})),module.exports=logger;