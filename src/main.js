import GithubApi from './classes/githubApi.js'
const rawConfig = require('./config.json')

let getConfig = function () {
    let env = 'development'
    if (process.env.NODE_ENV) {
        env = process.env.NODE_ENV
    }

    return rawConfig[env]
}

let main = function () {
    let config = getConfig()
    let ghUser = config.githubUser
    let ghToken = config.githubPass
    let orgRepo = config.githubRepo

    let api = new GithubApi(ghUser, ghToken);
    api.getPullRequests(orgRepo).then( data => {
        let pullRequests = data
        let dnmCount = 0

        pullRequests.forEach(pr => {
            let msg = "[" + pr.number + "] " + pr.title;
            let isDoNotMerge = false;
            pr.labels.forEach(label => {
                if (label.name == "Do Not Merge") {
                    isDoNotMerge = true;
                }
            })

            if (isDoNotMerge) {
                dnmCount += 1
            } else {
                api.getPullRequestReviews(orgRepo, pr.number).then(data => {
                    if (data.length == 0) { 
                        msg += " -- Needs 1st Review"
                    } else if (data.length == 1) {
                        msg += " -- Needs 2nd Review"
                    } else {
                        msg += " -- Ready to Merge"
                    }
                    console.log(msg)
                })
            }
        });

        console.log(dnmCount + " PRs marked 'Do Not Merge'")
    }).catch(err => {
        console.log(err)
    })

}

main()