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

    // NOTE: un-comment this if you ever need to use a request against the beta github API endpoint.
    // _makeRequest (url, acceptPreview=false) {
    _makeRequest (url) {
        let config = {
            headers: this._buildBaseHeaders()
        }

        // if (acceptPreview) {
        //     config.headers['Accept'] = 'application/vnd.github.antiope-preview+json'
        // }

        return new Promise((resolve, reject) => {
            axios.get(url, config).then(resp => {
                if (resp.status < 300) {
                    resolve(resp.data)
                } else {
                    reject(resp)
                }
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