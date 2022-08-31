import { pino } from 'pino'
import * as IO from 'fp-ts/lib/IO'

const logger = pino({
    transport: {
        target: 'pino-pretty'
    },
})

export const logInfo = (message: string): IO.IO<void> => () => logger.info(message)

