import { Logger } from "./logger"

export const ErrorHandler = (fn: () => void, logger: Logger, onSuccessMsg?: string, onErrorMsg?: string) => {
    try {
        fn()
        onSuccessMsg && logger.success(onSuccessMsg)
    } catch (error: any) {
        onErrorMsg && logger.error(onErrorMsg)
        logger.error(error)
        // process.exit(1)
    }
}