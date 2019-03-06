import GithubApi from './githubApi.js'
import PrAgentConfig from './prAgentConfig.js'

export default class ReportBuilder {
    constructor() {
    }

    buildReport () {
        return new Promise((resolve, reject) => {
            let report = {
                doNotMerge: [],
                requestsFeedback: [],
                zeroReviews: [],
                oneReview: [],
                twoOrMoreReviews: []
            }
            let config = new PrAgentConfig()
            let orgRepo = config.githubRepo

            let api = new GithubApi(config.githubUser, config.githubPass);
            api.getPullRequests(orgRepo).then( data => {
                let pullRequests = data

                let now = new Date()
                pullRequests.forEach(pr => {
                    let simplifiedPr = {
                        number: pr.number,
                        title: pr.title,
                        ageMs: now - new Date(pr.created_at)
                    }
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
                            if (data.length == 0) {
                                report.zeroReviews.push(simplifiedPr)
                            } else {
                                let requestsFeedback = false
                                data.forEach(review => {
                                    // TODO: Probably need to get the latest review status per reviewer
                                    if (review.state != "APPROVED") {
                                        requestsFeedback = true
                                    }
                                })

                                if (requestsFeedback) {
                                    report.requestsFeedback.push(simplifiedPr)
                                } else {
                                    if (data.length == 1) {
                                        report.oneReview.push(simplifiedPr)
                                    } else {
                                        report.twoOrMoreReviews.push(simplifiedPr)
                                    }
                                }
                            }

                            if (report.doNotMerge.length
                                + report.requestsFeedback.length
                                + report.zeroReviews.length
                                + report.oneReview.length
                                + report.twoOrMoreReviews.length == pullRequests.length) {
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