const fs = require('fs')

export default class PrAgentConfig {
    constructor() {
        // We make a proxy here to support things like:
        // config['foo']
        // config.foo

        return new Proxy(this, {
            get(target, prop) {
                let config = target._getConfig()
                return config[prop]
            }
        })
    }

    _getConfig () {
        if (this._config == null) {
            let cfgPath = process.env.CONFIG_PATH || './src/config.json'
            this._config = JSON.parse(fs.readFileSync(cfgPath, 'utf8'))
        }

        return this._config
    }
}