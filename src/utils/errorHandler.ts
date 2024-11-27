export const ErrorHandler = (fn: () => void, onSuccessMsg?: string, onErrorMsg?: string) => {
    try {
        fn()
        onSuccessMsg && console.log(onSuccessMsg)
    } catch (error) {
        onErrorMsg || console.log(error)
    }
}