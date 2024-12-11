import { program as Program  } from '@commander-js/extra-typings'
import { Logger } from '../utils/logger'
import { FileManager } from '../utils/FileManager'
import path from 'path'
import { ErrorHandler } from '../utils/errorHandler'
import { execSync } from 'child_process'
import { loader, NotFound, reactApp, reactContainer, reactContainerTs, reactHome, reactHomeTs, reactMain } from '../constants'

function initiateProject(projectName: string, opts: any) {
    const logger = new Logger()
    let fileManager: FileManager
    let rootDir = process.cwd()

    logger.waiting('Initiating project...')
    if (!projectName || projectName == '.')
        fileManager = new FileManager(process.cwd())
    else {
        rootDir = path.join(process.cwd(), projectName)
        fileManager = new FileManager(rootDir)
    }

    const { vite, cra, ts } = opts
    let initiationCommand = ``

    if(vite && !ts) initiationCommand = `npm create vite@latest . -- --template react && clear`
    else if(cra && !ts) initiationCommand = `npx create-react-app@latest . && clear`
    else if(cra && ts) initiationCommand = `npx create-react-app@latest . -- --template typescript && clear`
    else if(vite && ts) initiationCommand = `npm create vite@latest . -- --template react-ts --jsx && clear`
    else initiationCommand = `npm create vite@latest . -- --template react && clear`

    ErrorHandler(
        () => execSync(initiationCommand, { stdio: 'inherit', cwd: rootDir }),
        logger,
        'React configured successfully!',
        'Error while creating a React app'
    )

    logger.clear()
    logger.waiting("Installing all the required dependencies...")
    ErrorHandler(
        () => execSync(`${rootDir != process.cwd() ? `cd ${rootDir} && ` : ''}npm install && npm i react-router-dom dotenv axios && clear`, { stdio: 'pipe', cwd: rootDir }),
        logger,
        'Dependencies installed successfully!',
        'Error while installing dependencies!'
    )

    logger.clear()
    logger.waiting("Creating Folder Structure...")

    let ext = ''
    if(vite && !ts) ext = '.jsx'
    else if(cra && !ts) ext = '.js'
    else if(cra && ts) ext = '.ts'
    else if(vite && ts) ext = '.tsx'
    else ext = '.jsx'

    fileManager.mkdir("src/assets")
    fileManager.mkdir("src/components")
    fileManager.mkdir("src/pages")
    fileManager.mkdir("src/utils")

    // fileManager.writeFile('components/index.js', '')
    // fileManager.writeFile('pages/index.js', '')

    if(ts) fileManager.writeFile(`src/components/Container${ext}`, reactContainerTs)
    else fileManager.writeFile(`src/components/Container${ext}`, reactContainer)
    fileManager.writeFile(`src/components/Loader${ext}`, loader)
    if(ts) fileManager.writeFile(`src/pages/Home${ext}`, reactHomeTs)
    else fileManager.writeFile(`src/pages/Home${ext}`, reactHome)
    fileManager.writeFile(`src/pages/NotFound${ext}`, NotFound)
    fileManager.writeFile(`src/App${ext}`, reactApp)
    if(cra) fileManager.writeFile(`src/index${ext}`, reactMain(ts))
    else fileManager.writeFile(`src/main${ext}`, reactMain(ts))
    fileManager.writeFile(`.env`, '')

    logger.success("Created folder structure successfully!")

    logger.clear()
    logger.success("Initialized React project successfully!")
}

function createReactProject(program: typeof Program) {
    program
        .command('create-react-project')
        .argument('<project name>', 'Name of the project')
        .option('--vite', 'Uses Vite as build tool and bundler')
        .option('--cra', 'Uses Create React App as build tool and bundler')
        .option('--ts', 'Uses Type Script')
        .action(initiateProject)
}

export { createReactProject }
