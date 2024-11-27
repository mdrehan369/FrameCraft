import readlineSync from "readline-sync"

export function confirm(
    prompt: string,
    onAccepted: () => void,
    onRejected: () => void
) {
    const answer = readlineSync.question(prompt + ' [Y/n]')
    if (/^n(o)?$/i.test(answer)) onRejected()
    else onAccepted()
}
