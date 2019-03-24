const ReportBuilder = require('./classes/reportBuilder').default
// import ReportBuilder from './classes/reportBuilder.js'

let convertMsToHumanReadable = function (value) {
    let x = value
    let seconds, minutes, hours, days
    x = Math.floor(x / 1000)
    seconds = x % 60
    x = Math.floor(x / 60)
    minutes = x % 60
    x = Math.floor(x / 60)
    hours = x % 24
    x = Math.floor(x / 24)
    days = x

    let parts = []
    if (days > 0) { parts.push(days + 'd') }
    if (hours > 0) { parts.push(hours + 'h') }
    if (minutes > 0) { parts.push(minutes + 'm') }
    if (seconds > 0) { parts.push(seconds + 's') }

    return parts.join(' ')
}

let outputGroup = function(header, data) {
    if (data.length > 0) {
        console.log('')
        console.log(header)
        console.log('='.repeat(header.length))
        let sortFunc = function(o1, o2) { return o2.number - o1.number }
        data.sort(sortFunc).forEach( pr => {
            let age = convertMsToHumanReadable(pr.ageMs)
            console.log('[' + pr.number + '] ('+ age + ') ' + pr.title + ' by ' + pr.author)
            let reviewers = Object.keys(pr.reviews)
            if (reviewers.length > 0) {
                console.log('    - Reviewed by: ' + reviewers.join(', '))
            }
        });
    }
}

let outputRepo = function (data) {
    let count = data.doNotMerge.length + data.other.length
    console.log('Discovered ' + count + ' pull requests in repo ' + data.repo + ' in total.')

    let requestsFeedback = []
    let noReviews = []
    let oneReview = []
    let twoOrMoreReviews = []

    data.other.forEach(pr => {
        if (pr.hasFailedReview()) {
            requestsFeedback.push(pr)
        } else {
            let cnt = Object.keys(pr.reviews).length
            if (cnt === 0){
                noReviews.push(pr)
            } else if (cnt === 1) {
                oneReview.push(pr)
            } else {
                twoOrMoreReviews.push(pr)
            }
        }
    })

    outputGroup('Do Not Merge', data.doNotMerge)
    outputGroup('Requests Feedback', requestsFeedback)
    outputGroup('Needs Review', noReviews)
    outputGroup('Needs Second Review', oneReview)
    outputGroup('Ready To Merge', twoOrMoreReviews)
}

let main = function () {
    let separator = '#'.repeat(30)
    let reportBuilder = new ReportBuilder()
    reportBuilder.buildReports().then(listData => {
        console.log(separator)
        console.log('')
        let outputCount = 0
        listData.forEach((data) => {
            if (outputCount !== 0) {
                console.log('')
                console.log(separator)
                console.log('')
            }
            outputRepo(data)
            outputCount += 1
        })
        console.log('')
        console.log(separator)
    }).catch(err => {
        console.log(err)
    })
}

main()