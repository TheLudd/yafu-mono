const config = {
  reporter: 'dot',
  recursive: true,
}

if (process.env.CI === 'true') {
  const { name } = require(`${process.cwd()}/package.json`)
  Object.assign(config, {
    reporter: 'xunit',
    reporterOption: `output=${__dirname}/test-results/${name.replace('/', '-')}/mocha.xml`
  })
}

module.exports = config
