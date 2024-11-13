import { spawnSync } from "child_process"
// import { program } from "../utils/program"
// import { type program as Program } from "commander"
// import {  } from "commander"
import { program as Program } from "@commander-js/extra-typings"

function createTSProject(program: typeof Program) {
    program
        .command("create-ts-project")
        .description("Initializes a normal Typescript project")
        .argument("<string>", "Name of the project")
        .action(async (projectName, opts) => {
            console.log(projectName)
        })
    // console.log(projectname)
}


export {
    createTSProject
}