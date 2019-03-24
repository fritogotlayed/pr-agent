export default class PullRequestData {
    constructor(number, title, age, author) {
        if (!arguments.length){
            // new()
            this.number = null
            this.title = null
            this.ageMs = null
            this.reviews = {}
            this.author = null
        } else {
            // new(number, title, age, author)
            this.number = number
            this.title = title
            this.ageMs = age
            this.reviews = {}
            this.author = author
        }
    }

    addReview(reviewer, status) {
        // We don't care about non definitive reviews
        if (status == null || status == "COMMENTED") {
            return
        } else if (status == "DISMISSED") {
            if (this.reviews.hasOwnProperty(reviewer)) {
                delete this.reviews[reviewer]
            }
        } else if (status == "CHANGES_REQUESTED") {
            this.reviews[reviewer] = false
        } else if (status == "APPROVED") {
            this.reviews[reviewer] = true
        } else {
            // unknown status
            throw "Unknown review status: " + status
        }

    }

    hasFailedReview() {
        let failed = false
        Object.entries(this.reviews).forEach(([key, value]) => {
            if (!value) {
                failed = true
            }
        })

        return failed
    }
}