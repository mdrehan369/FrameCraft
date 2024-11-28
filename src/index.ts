import "dotenv/config"
import { program } from "./utils/program"
import { createTSProject } from "./commands/TSProject"
import { createExpressProject } from "./commands/ExpressProject"

createTSProject(program)
createExpressProject(program)

program.parse(process.argv)