import chalk from 'chalk'

// TODO: Optimize the logger using stdout standard functions

enum Levels {
    INFO = "INFO",
    SUCCESS = "SUCCESS",
    ERROR = "ERROR",
    DEBUG = "DEBUG",
    WAITING = "WAITING",
    WARN = "WARN",
}

export class Logger {
    private levelsToSymbols: any = {
        INFO: 'ℹ️',
        ERROR: '❌',
        SUCCESS: '✅',
        WARN: '🔔',
        DEBUG: '🔍',
        WAITING: '⌛',
    }

    private levelsToFunctions: any = {
        INFO: chalk.blueBright,
        ERROR: chalk.redBright,
        SUCCESS: chalk.greenBright,
        WARN: chalk.yellowBright,
        DEBUG: chalk.magentaBright,
        WAITING: chalk.gray,
    }

    private stages: Array<{ level: Levels; message: string }> = []

    private log = (level: Levels, message: string, stage: boolean) => {
        // if(!onlyPrint) this.clear()
        if (stage) this.stages.push({ level, message })
        console.log(
            `${this.levelsToSymbols[level]} ${this.levelsToFunctions[level](
                message
            )}`
        )
    }

    info = (message: string, stage: boolean = true) =>
        this.log(Levels.INFO, message, stage)
    error = (message: string, stage: boolean = true) =>
        this.log(Levels.ERROR, message, stage)
    success = (message: string, stage: boolean = true) =>
        this.log(Levels.SUCCESS, message, stage)
    warn = (message: string, stage: boolean = true) =>
        this.log(Levels.WARN, message, stage)
    debug = (message: string, stage: boolean = false) =>
        this.log(Levels.DEBUG, message, stage)
    waiting = (message: string, stage: boolean = false) =>
        this.log(Levels.WAITING, message, stage)

    clearAll = () => console.clear()

    clearStages = () => this.stages.splice(0, this.stages.length)

    clear = () => {
        this.clearAll()
        for (let { level, message } of this.stages)
            this.log(level, message, false)
    }
}