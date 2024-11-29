import { FileManager } from '../utils/FileManager'
import { Logger } from '../utils/logger'
import { confirm } from '../utils/confirm'
import { createJSProject } from '../utils/createJSProject'
import { execSync } from 'child_process'
import { program as Program } from "@commander-js/extra-typings"
import { ErrorHandler } from '../utils/errorHandler'
import { prettierrcFile } from '../constants'

export function initiatePrettier() {
    const rootDir = process.cwd()
    const logger = new Logger()

    const filemanager = new FileManager(rootDir)

    logger.waiting('Initiaiting Prettier...')
    if (!filemanager.chkdir('package.json')) {
        logger.warn('package.json file not found! First initialize the project')
        confirm(
            'Do you want to initialize a JS project first? [Y/n] ',
            () => createJSProject(logger, '.', {}),
            () => process.exit(1)
        )
    }

    if (filemanager.chkdir('.prettierrc')) {
        logger.clear()
        logger.info('Prettier is already configured!')
        process.exit(1)
    }

    ErrorHandler(
        () => execSync('npm install --save-dev --save-exact prettier && clear', {
            stdio: 'inherit',
            cwd: rootDir,
        }),
        logger,
        "",
        "Error while configuring Prettier"
    )

    filemanager.writeFile(".prettierrc", prettierrcFile)

    logger.clear()
    logger.success('Prettier configured successfully!')
}


function configurePrettier(program: typeof Program) {
    program
    .command("configure-prettier")
    .action(initiatePrettier)
}

export {
    configurePrettier
}