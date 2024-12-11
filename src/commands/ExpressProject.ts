import { program as Program } from '@commander-js/extra-typings'
import { Logger } from '../utils/logger'
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
import { createJSProject } from '../utils/createJSProject'

// TODO: Integrate TS into the project

function initiateProject(projectName: string, opts: any) {
    const logger = new Logger()

    const fileManager = createJSProject(logger, projectName, opts)
    const rootDir = fileManager.getRootDir()

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
