const config = {
  reporter: 'dot',
  recursive: true,
  require: 'ts-node/register',
  extension: [ 'ts', 'js', 'mjs' ],
  require: 'ts-node/register',
  loader: 'ts-node/esm',
}

if (process.env.CI === 'true') {
  const { name } = require(`${process.cwd()}/package.json`)
  Object.assign(config, {
    reporter: 'xunit',
    reporterOption: `output=${__dirname}/test-results/${name.replace('/', '-')}/mocha.xml`
  })
}

module.exports = config
