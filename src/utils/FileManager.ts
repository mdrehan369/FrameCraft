import fs from 'fs'
import path from 'path'
import { confirm } from './confirm'
import chalk from 'chalk';

// If root directory not given, it will take the current directory as the root directory

export class FileManager {
    private rootDir: string

    constructor(rootDir: string) {
        this.rootDir = rootDir
        if(process.cwd() != rootDir) {
            ;(async () => {
                if (fs.existsSync(rootDir)) {
                    confirm(
                        chalk.yellowBright('The directory already exists.\nDo you want to delete that and proceed?'),
                        () => fs.rmSync(rootDir, { recursive: true }),
                        () => process.exit(1)
                    )
                }
            })()
            fs.mkdirSync(this.rootDir, { recursive: true })
        }
    }

    private handler = (fn: () => any) => {
        try {
            return fn()
        } catch (error) {
            console.log(error)
        }
    }

    mkdir = (dir: string) =>
        this.handler(() =>
            fs.mkdirSync(path.join(this.rootDir, dir), { recursive: true })
        )
    rmdir = (dir: string) =>
        this.handler(() =>
            fs.rmSync(path.join(this.rootDir, dir), { recursive: true })
        )
    chkdir = (dir: string) =>
        this.handler(() => fs.existsSync(path.join(this.rootDir, dir)))

    writeFile = (fileName: string, data: string) =>
        this.handler(() =>
            fs.writeFileSync(path.join(this.rootDir, fileName), data)
        )
    readFile = (fileName: string) =>
        this.handler(() =>
            fs.readFileSync(path.join(this.rootDir, fileName), 'utf-8')
        )
    getRootDir = () => this.rootDir
}
