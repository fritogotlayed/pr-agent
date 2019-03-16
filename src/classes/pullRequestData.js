export default class PullRequestData {
    constructor(number, title, age) {
        if (!arguments.length){
            // new()
            this.number = null
            this.title = null
            this.ageMs = null
            this.reviews = {}
        } else {
            // new(number, title, age)
            this.number = number
            this.title = title
            this.ageMs = age
            this.reviews = {}
        }
    }

    addReview(reviewer, status) {
        // We don't care about non definitive reviews
        if (status == null || status == "COMMENTED" || status == "DISMISSED"){
            return
        } else if (status == "CHANGES_REQUESTED"){
            this.reviews[reviewer] = false
        } else if (status == "APPROVED"){
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