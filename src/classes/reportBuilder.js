import GithubApi from './githubApi.js'
import PrAgentConfig from './prAgentConfig.js'
import PullRequestData from './pullRequestData.js'

export default class ReportBuilder {
    constructor() {
    }

    buildReport () {
        return new Promise((resolve, reject) => {
            let report = {
                doNotMerge: [],
                other: []
            }
            let config = new PrAgentConfig()
            let orgRepo = config.githubRepo

            let api = new GithubApi(config.githubUser, config.githubPass);
            api.getPullRequests(orgRepo).then( data => {
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
                        api.getPullRequestReviews(orgRepo, pr.number).then(data => {
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