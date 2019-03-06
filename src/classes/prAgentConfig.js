const rawConfig = require('../config.json')

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
        let env = 'development'
        if (process.env.NODE_ENV) {
            env = process.env.NODE_ENV
        }

        return rawConfig[env]
    }
}