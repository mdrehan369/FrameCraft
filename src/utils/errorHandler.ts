import { Logger } from "./logger"

export const ErrorHandler = (fn: () => void, logger: Logger, onSuccessMsg?: string, onErrorMsg?: string) => {
    try {
        fn()
        onSuccessMsg && logger.success(onSuccessMsg)
    } catch (error) {
        onErrorMsg && logger.error(onErrorMsg)
    }
}