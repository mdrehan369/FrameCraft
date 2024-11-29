#!/usr/bin/env node

import "dotenv/config"
import { program } from "./utils/program"
import { createTSProject } from "./commands/TSProject"
import { createExpressProject } from "./commands/ExpressProject"
import { configureEsLint } from "./commands/EsLint"

createTSProject(program)
createExpressProject(program)

configureEsLint(program)

program.parse(process.argv)