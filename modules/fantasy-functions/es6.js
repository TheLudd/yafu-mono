import * as production from './dist/es6/fantasy-functions-production.js'
import * as debug from './dist/es6/fantasy-functions-development.js'

export default process.env.NODE_ENV === 'production' ? production : debug
