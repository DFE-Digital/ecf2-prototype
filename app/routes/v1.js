// Change versions here
var v = '/v1/'
var vGet = 'v1/'

// Add any directory variables here
var school = 'school/'

module.exports = router => {
    router.post(v + school + 'start', (req, res) => {
        res.redirect(v + school + 'sign-in')
    })
}