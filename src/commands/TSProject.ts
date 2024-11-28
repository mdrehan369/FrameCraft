import { execSync } from 'child_process'
import { program as Program } from '@commander-js/extra-typings'
import path from 'path'
import { TsConfig } from '../constants'
import { FileManager } from '../utils/FileManager'
import { ErrorHandler } from '../utils/errorHandler'
import { Logger } from '../utils/logger'

function createTSProject(program: typeof Program) {
    const logger = new Logger()

    program
        .command('create-ts-project')
        .description('Initializes a normal Typescript project')
        .argument('<string>', 'Name of the project')
        .option('-y, --yes', 'Yes to default npm init configurations')
        .option('--no-git', 'Do not initialize a git repository')
        .action((projectName, opts) => {
            let fileManager: FileManager
            let rootDir = process.cwd()
            console.log(opts)
            // Checking and assigning root directory. Also checks and if the directory already exists or not, if yes,
            // it will prompt the user for further actions and also initializing package.json
            logger.waiting('Initiating a typescript project...')
            if (!projectName || projectName == '.')
                fileManager = new FileManager(process.cwd())
            else {
                rootDir = path.join(process.cwd(), projectName)
                fileManager = new FileManager(rootDir)
            }

            // Installing typescript and creating folder structure
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
                        execSync('git init', {
                            cwd: rootDir,
                            stdio: 'inherit',
                        }),
                    logger
                )
                logger.clear()
                logger.success('Initiated git repository successfully!')
            }

            logger.success("Typescript project initiated successfully!")
        })
}

export { createTSProject }

// const a = execSync("ls", { stdio: "pipe" })