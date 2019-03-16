const axios = require('axios')

export default class GithubApi {
    /**
     * Initializes a new GithubApi object
     * @param {string} user The user with which to operate
     * @param {string} password The password or personal access token to authenticate with
     */
    constructor(user, password) {
        this.authHeader = 'Basic ' + Buffer.from(user + ':' + password).toString('base64')
    }

    _buildBaseHeaders () {
        return {
            Authorization: this.authHeader
        }
    }

    _makeRequest (url ) {
        let config = {
            headers: this._buildBaseHeaders()
        }

        return new Promise((resolve, reject) => {
            axios.get(url, config).then(resp => {
                resolve(resp.data)
            }).catch(err => {
                reject(err)
            })
        })
    }

    getPullRequests (repo) {
        return this._makeRequest('https://api.github.com/repos/' + repo +'/pulls')
    }

    getPullRequestReviews (repo, prNumber) {
        // https://developer.github.com/v3/pulls/reviews/
        return this._makeRequest('https://api.github.com/repos/' + repo +'/pulls/' + prNumber + '/reviews')
    }
}