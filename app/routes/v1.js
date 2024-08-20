// Change versions here
var v = '/v1/'
var vGet = 'v1/'

// Add any directory variables here
var school = 'school/'

module.exports = router => {
    router.post(v + school + 'start', (req, res) => {
        res.redirect(v + school + 'dfe-sign-in')
    })

    router.post(v + school + 'dfe-sign-in', (req, res) => {
        res.redirect(v + school + 'need-to-know')
    })

    router.post(v + school + 'need-to-know', (req, res) => {
        res.redirect(v + school + 'find-ect')
    })

    router.post(v + school + 'find-ect', (req, res) => {
        res.redirect(v + school + 'review-ect-details')
    })
}