import { ErrorHandler } from './errorHandler'
import { FileManager } from './FileManager'
import { Logger } from './logger'
import { execSync } from 'child_process'
import path from 'path'

const createJSProject = (logger: Logger, projectName: string, opts: any) => {
    let fileManager: FileManager
    let rootDir = process.cwd()

    // Checking and assigning root directory. Also checks and if the directory already exists or not, if yes,
    // it will prompt the user for further actions and also initializing package.json
    logger.waiting('Initiating project...')
    if (!projectName || projectName == '.')
        fileManager = new FileManager(process.cwd())
    else {
        rootDir = path.join(process.cwd(), projectName)
        fileManager = new FileManager(rootDir)
    }

    ErrorHandler(
        () =>
            execSync(`npm init ${opts.yes ? ' -y' : ''} && clear`, {
                cwd: rootDir,
                stdio: 'inherit',
            }),
        logger,
        'Initiated project successfully!',
        'Error occured while initiating project!'
    )

    logger.clear()

    return fileManager
}

export { createJSProject }
