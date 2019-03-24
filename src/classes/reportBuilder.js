// import GithubApi from './githubApi.js'
// import PrAgentConfig from './prAgentConfig.js'
// import PullRequestData from './pullRequestData.js'
const GithubApi = require('./githubApi').default
const PrAgentConfig = require('./prAgentConfig').default
const PullRequestData = require('./pullRequestData').default

export default class ReportBuilder {
    constructor() {
    }

    buildReports (targets) {
        targets = targets || new PrAgentConfig().targets

        return new Promise((resolve, reject) => {
            let children = []
            targets.forEach((t) => {
                children.push(this.buildReport(t))
            })

            Promise.all(children).then((data) => {
                resolve(data)
            }).catch((err) => {
                reject()
            })
        })
    }

    buildReport (repoConfig) {
        return new Promise((resolve, reject) => {
            let report = {
                repo: repoConfig.githubRepo,
                doNotMerge: [],
                other: []
            }

            let api = new GithubApi(repoConfig.githubUser, repoConfig.githubPass);
            api.getPullRequests(repoConfig.githubRepo).then( data => {
                let pullRequests = data

                if (pullRequests.length === 0) {
                    resolve(report)
                }

                let now = new Date()
                pullRequests.forEach(pr => {
                    let simplifiedPr = new PullRequestData(
                        pr.number,
                        pr.title,
                        now - new Date(pr.created_at),
                        pr.user.login
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
                        report.other.push(simplifiedPr)
                    }

                    if (report.other.length == 0 && report.doNotMerge.length == pullRequests.length) {
                        resolve(report)
                    } else {
                        api.getPullRequestReviews(repoConfig.githubRepo, pr.number).then(data => {
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