// Change versions here
var v = '/v2/'
var vGet = 'v2/'

// Add any directory variables here
var school = 'school/'

module.exports = router => {

    // start page
    router.post(v + school + 'start', (req, res) => {
        res.redirect(v + school + 'dfe-sign-in')
    })

    // dfe sign in page
    router.post(v + school + 'dfe-sign-in', (req, res) => {
        res.redirect(v + school + 'what-youll-need')
    })

    // **** prototype set up ****

    router.post(v + school + 'setup', (req, res) => {
        res.redirect(v + school + 'start')
    })

    // what you'll need
    router.post(v + school + 'what-youll-need', (req, res) => {
        res.redirect(v + school + 'find-ect')
    })

    // add defaults for your programme type

    // router.post(v + school + 'select-default-programme-type', (req, res) => {
    //     res.redirect(v + school + 'default-programme-type')
    // })
    //
    // router.post(v + school + 'default-programme-type', (req, res) => {
    //     if (req.session.data['defaultProgrammeType'] === 'School-led') {
    //         res.redirect(v + school + 'default-appropriate-body')
    //     }
    //     else {
    //         res.redirect(v + school + 'default-lead-provider')
    //     }
    // })
    //
    // router.post(v + school + 'default-lead-provider', (req, res) => {
    //     res.redirect(v + school + 'default-delivery-partner')
    // })
    //
    // router.post(v + school + 'default-delivery-partner', (req, res) => {
    //     res.redirect(v + school + 'default-appropriate-body')
    // })
    //
    //
    // router.post(v + school + 'default-appropriate-body', (req, res) => {
    //     res.redirect(v + school + 'default-check-answers')
    // })
    //
    // router.post(v + school + 'default-check-answers', (req, res) => {
    //     res.redirect(v + school + 'you-can-now-add-an-ect')
    // })
    //
    // router.post(v + school + 'you-can-now-add-an-ect', (req, res) => {
    //     res.redirect(v + school + 'find-ect')
    // })

    // add ECT from here

    router.post(v + school + 'find-ect', (req, res) => {
        if (req.session.data['askForNino'] === 'yes') {
            res.redirect(v + school + 'nino')
        }
        else {
            res.redirect(v + school + 'review-ect-details')
        }
    })

    router.post(v + school + 'nino', (req, res) => {
        res.redirect(v + school + 'review-ect-details')
    })

    router.post(v + school + 'review-ect-details', (req, res) => {
        res.redirect(v + school + 'email-address')
    })

    router.post(v + school + 'nino', (req, res) => {
        res.redirect(v + school + 'email-address')
    })

    router.post(v + school + 'email-address', (req, res) => {
        if (req.session.data['defaultsAlreadyAdded'] === 'no') {
            res.redirect(v + school + 'programme-type')
        }
        else {
            res.redirect(v + school + 'will-you-use-defaults')
        }
    })

    router.post(v + school + 'will-you-use-defaults', (req, res) => {
        if (req.session.data['useDefaults'] === 'no') {
            res.redirect(v + school + 'programme-type')
        }
        else {
            if (req.session.data['mentorsAddedPreviously'] === 'no') {
                res.redirect(v + school + 'no-previous-mentors')
            }
            else {
                res.redirect(v + school + 'mentor')
            }
        }
    })

    // adding programme information that is not default

    router.post(v + school + 'programme-type', (req, res) => {
        res.redirect(v + school + 'appropriate-body')
    })

    // router.post(v + school + 'lead-provider', (req, res) => {
    //     res.redirect(v + school + 'delivery-partner')
    // })
    //
    // router.post(v + school + 'delivery-partner', (req, res) => {
    //     res.redirect(v + school + 'appropriate-body')
    // })

    router.post(v + school + 'appropriate-body', (req, res) => {
        if (req.session.data['programmeType'] === 'School-led') {
            res.redirect(v + school + 'save-programme-details')
        }
        else {
            res.redirect(v + school + 'autocomplete-delivery-partner')
        }
    })

    router.post(v + school + 'autocomplete-delivery-partner', (req, res) => {
        res.redirect(v + school + 'save-programme-details')
    })

    router.post(v + school + 'save-programme-details', (req, res) => {
        if (req.session.data['mentorsAddedPreviously'] === 'no') {
            res.redirect(v + school + 'check-answers')
        }
        else {
            res.redirect(v + school + 'mentor')
        }
    })

    // end of adding non-default programme information

    // router.post(v + school + 'no-previous-mentors', (req, res) => {
    //     res.redirect(v + school + 'check-answers')
    // })

    router.post(v + school + 'mentor', (req, res) => {
        res.redirect(v + school + 'check-answers')
    })

    router.post(v + school + 'check-answers', (req, res) => {
        if (req.session.data['mentor'] === 'Add a new mentor later' || req.session.data['mentorsAddedPreviously'] === 'no') {
            res.redirect(v + school + 'confirmation-mentor-to-be-added')
            req.session.data = []
        }
        else {
            res.redirect(v + school + 'confirmation')
            req.session.data = []
        }
    })
}