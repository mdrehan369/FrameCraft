import { FileManager } from '../utils/FileManager'
import { Logger } from '../utils/logger'
import { confirm } from '../utils/confirm'
import { createJSProject } from '../utils/createJSProject'
import { execSync } from 'child_process'
import { program as Program } from "@commander-js/extra-typings"
import { ErrorHandler } from '../utils/errorHandler'

// TODO: Add scripts also

export function initiateEsLint() {
    const rootDir = process.cwd()
    const logger = new Logger()

    const filemanager = new FileManager(rootDir)

    logger.waiting('Initiaiting EsLint...')
    if (!filemanager.chkdir('package.json')) {
        logger.warn('package.json file not found! First initialize the project', false)
        confirm(
            'Do you want to initialize a JS project first? [Y/n] ',
            () => createJSProject(logger, '.', {}),
            () => process.exit(1)
        )
    }

    if (filemanager.chkdir('eslint.config.mjs')) {
        logger.clear()
        logger.info('EsLint is already configured!')
        process.exit(1)
    }

    ErrorHandler(
        () => execSync('npm init @eslint/config@latest && clear', {
            stdio: 'inherit',
            cwd: rootDir,
        }),
        logger,
        "",
        "Error while configuring EsLint"
    )

    logger.clear()
    logger.success('EsLint configured successfully!')
}


function configureEsLint(program: typeof Program) {
    program
    .command("configure-eslint")
    .action(initiateEsLint)
}

export {
    configureEsLint
}