const fs = require('fs')
const expect = require('chai').expect

const PrAgentConfigModule = require('./prAgentConfig')
const PrAgentConfig = PrAgentConfigModule.default

describe('The prAgentConfig module', function () {
  it('uses specified config when env var set', function () {
    let oldConfigPath = process.env.CONFIG_PATH
    try {
      // Arrange
      fs.writeFileSync("./test-config.json", '{ "key1": "value1", "key2": "value2" }')
      process.env.CONFIG_PATH = './test-config.json'
      let conf = new PrAgentConfig()

      // Act & Assert
      expect(conf['key1']).to.equal("value1")
      expect(conf.key1).to.equal("value1")
      expect(conf['key2']).to.equal("value2")
      expect(conf.key2).to.equal("value2")
    } finally {
      fs.unlinkSync('./test-config.json')
      if (oldConfigPath == undefined) {
        delete process.env.CONFIG_PATH
      } else {
        process.env.CONFIG_PATH = oldConfigPath
      }
    }
  })

  it('uses default config when env var not set', function () {
    // TODO: Figure out a way to properly test this.
    let oldConfigPath = process.env.CONFIG_PATH
    try {
      // Arrange
      delete process.env.CONFIG_PATH
      let conf = new PrAgentConfig()

      // Act & Assert
      expect(conf['targets']).to.not.be.null // terrible assertion. Fix when fixing todo above.
    } finally {
      // fs.unlinkSync('./test-config.json')
      if (oldConfigPath == undefined) {
        delete process.env.CONFIG_PATH
      } else {
        process.env.CONFIG_PATH = oldConfigPath
      }
    }
  })
})