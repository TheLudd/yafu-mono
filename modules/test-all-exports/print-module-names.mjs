#!/usr/bin/env node
import nonPrivateModuleNames from './get-non-private-module-names.mjs'

process.stdout.write(`${nonPrivateModuleNames.join(' ')}\n`)
