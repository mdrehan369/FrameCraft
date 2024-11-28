import { program as Program } from '@commander-js/extra-typings'
import { Logger } from '../utils/logger'
import { FileManager } from '../utils/FileManager'
import path from 'path'
import { execSync } from 'child_process'
import { ErrorHandler } from '../utils/errorHandler'
import {
    expressApiError,
    expressApiResponse,
    expressAppBoilerplate,
    expressAsyncHandler,
    expressConnectDBBoilerplate,
    expressIndexBoilerplate,
} from '../constants'

function initiateProject(projectName: string, opts: any) {
    const logger = new Logger()

    let fileManager: FileManager
    let rootDir = process.cwd()

    // Checking and assigning root directory. Also checks and if the directory already exists or not, if yes,
    // it will prompt the user for further actions and also initializing package.json
    logger.waiting('Initiating a express project...')
    if (!projectName || projectName == '.')
        fileManager = new FileManager(process.cwd())
    else {
        rootDir = path.join(process.cwd(), projectName)
        fileManager = new FileManager(rootDir)
    }

    if (opts.yes)
        ErrorHandler(
            () =>
                execSync('npm init -y && clear', {
                    cwd: rootDir,
                    stdio: 'inherit',
                }),
            logger,
            'Initiated project successfully!',
            'Error occured while initiating project!'
        )
    else
        ErrorHandler(
            () =>
                execSync('npm init && clear', {
                    cwd: rootDir,
                    stdio: 'inherit',
                }),
            logger,
            'Initiated project successfully!',
            'Error occured while initiating project!'
        )

    logger.clear()

    logger.waiting('Installing all the required dependencies...')
    ErrorHandler(
        () =>
            execSync(
                'npm i express cors cookie-parser bcryptjs jsonwebtoken dotenv && npm i nodemon --save-dev && clear',
                // 'npm i express && npm i nodemon --save-dev && clear',
                {
                    stdio: 'inherit',
                    cwd: rootDir
                }
            ),
        logger,
        'Installed all the required dependencies!',
        'Error while installing the dependencies'
    )

    logger.waiting('Creating folder structure and files...')

    fileManager.mkdir('src')
    fileManager.mkdir('src/controllers')
    fileManager.mkdir('src/lib')
    fileManager.mkdir('src/middlewares')
    fileManager.mkdir('src/utils')
    fileManager.mkdir('src/routes')

    fileManager.writeFile(
        '.env',
        'NODE_ENV=development\nCLIENT_URL=http://localhost:5173\nPORT=3000'
    )
    fileManager.writeFile('src/app.js', expressAppBoilerplate)
    fileManager.writeFile('src/index.js', expressIndexBoilerplate)
    fileManager.writeFile('src/lib/connectDB.js', expressConnectDBBoilerplate)

    // TODO: Add util files like asynchandler and apierror etc.
    fileManager.writeFile('src/utils/asyncHandler.js', expressAsyncHandler)
    fileManager.writeFile('src/utils/ApiResponse.js', expressApiResponse)
    fileManager.writeFile('src/utils/ApiError.js', expressApiError)

    logger.clear()
    logger.success('Folder structure and files created successfully!')

    logger.waiting('Adding scripts...')

    // Adding scripts
    const data = JSON.parse(fileManager.readFile('package.json'))
    data['scripts'] = { start: 'nodemon src/index.js' }
    data['type'] = 'module'
    fileManager.writeFile('package.json', JSON.stringify(data, null, 4))

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
            logger,
                'Initiated git repository successfully!',
                'Error while creating git repository!'
        )
    }
    
    logger.clear()
    logger.success("Express project initiated successfully!")
}

function createExpressProject(program: typeof Program) {
    program
        .command('create-express-project')
        .description('Initializes a express project')
        .argument('<project name>', 'Name of the project')
        .option('-y, --yes', 'Yes to default npm init configurations')
        .option('--no-git', 'Do not initialize a git repository')
        .action(initiateProject)
}

export { createExpressProject }
