import { execSync } from 'child_process'
import { program as Program } from '@commander-js/extra-typings'
import { TsConfig } from '../constants'
import { ErrorHandler } from '../utils/errorHandler'
import { Logger } from '../utils/logger'
import { createJSProject } from '../utils/createJSProject'

function initiateProject(projectName: string, opts: any) {
    const logger = new Logger()
    
    const fileManager = createJSProject(logger, projectName, opts)
    const rootDir = fileManager.getRootDir()

    logger.waiting(
        'Installing typescript and creating folder structure...'
    )

    ErrorHandler(
        () =>
            execSync(
                'npm install ts-node typescript && npx tsc --init && clear',
                {
                    cwd: rootDir,
                    stdio: 'inherit',
                }
            ),
        logger,
        'Typescript installed successfully!',
        'Error occured while installing typescript!'
    )

    fileManager.writeFile('tsconfig.json', TsConfig)
    fileManager.mkdir('src')
    fileManager.mkdir('build')
    fileManager.writeFile('src/index.ts', '')

    logger.success("Folder structure created successfully!")

    logger.clear()
    logger.waiting('Adding scripts...')

    // Adding scripts
    const data = JSON.parse(fileManager.readFile('package.json'))
    data['scripts'] = { start: 'npx ts-node src/index.ts' }
    data['type'] = 'module'
    fileManager.writeFile('package.json', JSON.stringify(data, null, 4))
    fileManager.writeFile(
        'src/index.ts',
        "console.log('Hello World! by FrameCraft')"
    )

    logger.clear()
    logger.success('Scripts added successfully!')

    if (opts.git) {
        logger.waiting('Initiating git repository...')
        ErrorHandler(
            () =>
                execSync('git init && clear', {
                    cwd: rootDir,
                    stdio: 'inherit',
                }),
            logger
        )
        logger.clear()
        logger.success('Initiated git repository successfully!')
    }

    logger.success("Typescript project initiated successfully!")
}

function createTSProject(program: typeof Program) {

    program
        .command('create-ts-project')
        .description('Initializes a normal Typescript project')
        .argument('<project name>', 'Name of the project')
        .option('-y, --yes', 'Yes to default npm init configurations')
        .option('--no-git', 'Do not initialize a git repository')
        .action(initiateProject)
}

export { createTSProject }