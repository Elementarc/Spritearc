import * as winston from "winston";

const logger = winston.createLogger({format: winston.format.combine(
    winston.format.colorize({all: true}),
    winston.format.simple()
), transports: [new winston.transports.Console()]})

export default logger