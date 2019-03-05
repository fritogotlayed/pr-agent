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

    buildBaseHeaders () {
        return {
            Authorization: this.authHeader
        }
    }

    _makeRequest () {
        return new Promise((resolve, reject) => {

        })
    }

    getPullRequests (repo) {
        let config = {
            headers: this.buildBaseHeaders()
        }

        return new Promise((resolve, reject) => {
            axios.get('https://api.github.com/repos/' + repo +'/pulls', config).then( resp => {
                resolve(resp.data)
            }).catch(err => {
                reject(err)
            })
        })
    }

    getPullRequestReviews (repo, prNumber) {
        // https://developer.github.com/v3/pulls/reviews/
        let config = {
            headers: this.buildBaseHeaders()
        }

        return new Promise((resolve, reject) => {
            axios.get('https://api.github.com/repos/' + repo +'/pulls/' + prNumber + '/reviews', config).then( resp => {
                resolve(resp.data)
            }).catch(err => {
                reject(err)
            })
        })
    }
}