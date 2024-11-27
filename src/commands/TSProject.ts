import { execSync } from 'child_process'
import { program as Program } from '@commander-js/extra-typings'
import path from 'path'
import { TsConfig } from '../constants'
import { FileManager } from '../utils/FileManager'
import { ErrorHandler } from '../utils/errorHandler'

 
function createTSProject(program: typeof Program) {
    program
        .command('create-ts-project')
        .description('Initializes a normal Typescript project')
        .argument('<string>', 'Name of the project')
        .option('-y, --yes', "Yes to default npm init configurations", true)
        .option('--no-git', "Do not initialize a git repository")
        .action(async (projectName, opts) => {
            let fileManager: FileManager
            let rootDir = process.cwd()

            // Checking and assigning root directory. Also checks and if the directory already exists or not, if yes,
            // it will prompt the user for further actions and also initializing package.json
            if (!projectName || projectName == '.') fileManager = new FileManager(process.cwd())
            else {
                rootDir = path.join(process.cwd(), projectName)
                fileManager = new FileManager(rootDir)
            }

            // Installing typescript and creating folder structure
            if(opts.yes) ErrorHandler(() => execSync('npm init -y', { cwd: rootDir, stdio: 'inherit' }))
            else ErrorHandler(() => execSync('npm init', { cwd: rootDir, stdio: 'inherit' }))

            ErrorHandler(() => execSync('npm install ts-node typescript && npx tsc --init', { cwd: rootDir, stdio: 'inherit' }))

            fileManager.writeFile('tsconfig.json', TsConfig)
            fileManager.mkdir('src')
            fileManager.mkdir('build')
            fileManager.writeFile('src/index.ts', '')

            // Adding scripts
            const data = JSON.parse(fileManager.readFile('package.json'))
            data["scripts"] = {"start": "npx ts-node src/index.ts"}
            fileManager.writeFile('package.json', JSON.stringify(data, null, 4))
            fileManager.writeFile('src/index.ts', "console.log('Hello World! by FrameCraft')")

            if(!opts.git)
                ErrorHandler(() => execSync('git init', {cwd: rootDir, stdio: 'inherit' }))

        })
}

export { createTSProject }
