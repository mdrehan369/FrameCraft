import { execSync } from 'child_process'
import { program as Program } from '@commander-js/extra-typings'
import path from 'path'
import fs from 'fs'
import readLine from 'readline'
import { TsConfig } from '../constants'

function confirm(
    prompt: string,
    onAccepted: () => void,
    onRejected: () => void
) {
    const rl = readLine.createInterface({
        input: process.stdin,
        output: process.stdout,
    })

    return new Promise(function (resolve, reject) {
        rl.question(prompt + ' [Y/n] ', function (answer) {
            if (/^n(o)?$/i.test(answer)) onRejected()
            else onAccepted()
            rl.close()
            resolve(false)
        })
    })
}

const ErrorHandler = (fn: () => void, onSuccessMsg?: string, onErrorMsg?: string) => {
    try {
        fn()
        onSuccessMsg && console.log(onSuccessMsg)
    } catch (error) {
        onErrorMsg || console.log(error)
    }
}
 
function createTSProject(program: typeof Program) {
    program
        .command('create-ts-project')
        .description('Initializes a normal Typescript project')
        .argument('<string>', 'Name of the project')
        .action(async (projectName, opts) => {
            let rootDir = ''
            // Checking and assigning root directory. Also checks and if the directory already exists or not, if yes,
            // it will prompt the user for further actions and also initializing package.json
            if (projectName == '.') rootDir = __dirname
            else {
                rootDir = path.join(rootDir, projectName)
                if (fs.existsSync(rootDir)) {
                    await confirm(
                        'Error: The directory already exists.\nDo you want to delete that and proceed?',
                        () => fs.rmSync(rootDir, { recursive: true }),
                        () => process.exit(1)
                    )
                }
                fs.mkdirSync(rootDir)
            }

            // Installing typescript and creating folder structure
            ErrorHandler(() => execSync('npm init', { cwd: rootDir, stdio: 'inherit' }))
            ErrorHandler(() => execSync('npm install ts-node typescript && npx tsc --init', { cwd: rootDir, stdio: 'inherit' }))

            fs.writeFileSync(path.join(rootDir, 'tsconfig.json'), TsConfig)
            fs.mkdirSync(path.join(rootDir, 'src'), { recursive: true })
            fs.mkdirSync(path.join(rootDir, 'build'), { recursive: true })
            fs.open(path.join(rootDir, 'src', 'index.ts'), 'w', (err, _) => err && console.log(err))

            // Adding scripts
            const data = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'))
            data["scripts"] = {"start": "npx ts-node src/index.ts"}
            fs.writeFileSync(path.join(rootDir, 'package.json'), JSON.stringify(data, null, 4))
            fs.writeFileSync(path.join(rootDir, 'src', 'index.ts'), "console.log('Hello World! by FrameCraft')")
        })
}

export { createTSProject }
