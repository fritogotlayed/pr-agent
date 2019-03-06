import ReportBuilder from './classes/reportBuilder.js'

let convertMsToHumanReadable = function (value) {
    let age = (((value / 1000) / 60) / 60) / 24
    age = Math.floor(age * 100) / 100
    age += ' days old'
    return age
}

let convertMsToHumanReadable2 = function (value) {
    let x = value
    let seconds, minutes, hours, days = 0
    x = Math.floor(x / 1000)
    seconds = x % 60
    x = Math.floor(x / 60)
    minutes = x % 60
    x = Math.floor(x / 60)
    hours = x % 24
    x = Math.floor(x / 24)
    days = x

    let msg = ''
    if (days > 0) { msg += days + 'd ' }
    if (hours > 0) { msg += hours + 'h ' }
    if (minutes > 0) { msg += minutes + 'm ' }
    if (seconds > 0) { msg += seconds + 's' }

    return msg
}

let convertMsToHumanReadable3 = function (value) {
    let x = value
    let seconds, minutes, hours, days = 0
    x = Math.floor(x / 1000)
    seconds = x % 60
    x = Math.floor(x / 60)
    minutes = x % 60
    x = Math.floor(x / 60)
    hours = x % 24
    x = Math.floor(x / 24)
    days = x

    let msg = ''
    if (days > 0) { return days + ' days old' }
    if (hours > 0) { return hours + ' hours old' }
    if (minutes > 0) { return minutes + ' minutes old' }
    if (seconds > 0) { return seconds + ' seconds old' }

    return msg
}

let convertMsToHumanReadable4 = function (value) {
    const interval_threshold = 0
    let seconds = Math.floor(value / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval > interval_threshold) {
        return interval + " years";
    }

    interval = Math.floor(seconds / 2592000);
    if (interval > interval_threshold) {
        return interval + " months";
    }

    interval = Math.floor(seconds / 86400);
    if (interval > interval_threshold) {
        return interval + " days";
    }

    interval = Math.floor(seconds / 3600);
    if (interval > interval_threshold) {
        return interval + " hours";
    }

    interval = Math.floor(seconds / 60);
    if (interval > interval_threshold) {
        return interval + " minutes";
    }

    return seconds + " seconds";
}

let outputGroup = function(header, data) {
    if (data.length > 0) {
        console.log('')
        console.log(header)
        console.log('='.repeat(header.length))
        data.forEach( pr => {
            let age = convertMsToHumanReadable2(pr.ageMs)
            console.log('[' + pr.number + '] ('+ age + ') ' + pr.title)
        });
    }
}

let main = function () {
    let reportBuilder = new ReportBuilder()
    reportBuilder.buildReport().then(data => {
        let count = data.doNotMerge.length + data.requestsFeedback.length + data.zeroReviews.length + data.oneReview.length + data.twoOrMoreReviews.length
        console.log('Discovered ' + count + ' pull requests in total.')

        outputGroup('Do Not Merge', data.doNotMerge)
        outputGroup('Requests Feedback', data.requestsFeedback)
        outputGroup('Needs Review', data.zeroReviews)
        outputGroup('Needs Second Review', data.oneReview)
        outputGroup('Ready To Merge', data.twoOrMoreReviews)
    }).catch(err => {
        console.log(err)
    })
}

main()