// import GithubApi from './githubApi.js'
// import PrAgentConfig from './prAgentConfig.js'
// import PullRequestData from './pullRequestData.js'
const GithubApi = require('./githubApi').default
const PrAgentConfig = require('./prAgentConfig').default
const PullRequestData = require('./pullRequestData').default

export default class ReportBuilder {
    constructor() {
    }

    buildReport (repoConfig) {
        return new Promise((resolve, reject) => {
            let report = {
                repo: '',
                doNotMerge: [],
                other: []
            }
            // TODO: Handle more than one target repository
            repoConfig = repoConfig || new PrAgentConfig().targets[0]

            let api = new GithubApi(repoConfig.githubUser, repoConfig.githubPass);
            api.getPullRequests(repoConfig.repo).then( data => {
                let pullRequests = data

                let now = new Date()
                pullRequests.forEach(pr => {
                    let simplifiedPr = new PullRequestData(
                        pr.number,
                        pr.title,
                        now - new Date(pr.created_at)
                    );
                    let isDoNotMerge = false;
                    pr.labels.forEach(label => {
                        if (label.name == "Do Not Merge") {
                            isDoNotMerge = true;
                        }
                    })

                    if (isDoNotMerge) {
                        report.doNotMerge.push(simplifiedPr)
                    } else {
                        api.getPullRequestReviews(repoConfig.repo, pr.number).then(data => {
                            report.other.push(simplifiedPr)
                            if (data.length > 0) {
                                let sortFunc = function(o1, o2) { return new Date(o1.submitted_at) - new Date(o2.submitted_at)}
                                data.sort(sortFunc).forEach(review => {
                                    // NOTE: The add review call keeps only the latest review state due to our sorting.
                                    simplifiedPr.addReview(review.user.login, review.state)
                                })
                            }

                            if (report.doNotMerge.length + report.other.length == pullRequests.length) {
                                resolve(report)
                            }
                        })
                    }
                });

            }).catch(err => {
                reject(err)
            })
        })
    }

}