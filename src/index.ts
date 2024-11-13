import "dotenv/config"
import { program } from "./utils/program"
import { createTSProject } from "./commands/TSProject"

createTSProject(program)
program.parse(process.argv)