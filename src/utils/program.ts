import { Command } from "@commander-js/extra-typings"

const program = new Command()

program
    .name("FrameCraft")
    .description("FrameCraft is a powerful command-line tool designed to simplify the process of setting up and managing basic configurations for a variety of projects. Whether you're working on a web app, a Node.js API, or any other type of project, this tool streamlines configuration tasks, allowing you to quickly set up and customize project settings based on your preferred template.")
    .version(process.env.VERSION || "1.0.0")

export {
    program
}