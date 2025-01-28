// Change versions here
var v = '/v7/'
var vGet = 'v7/'

// Add any directory variables here
var school = 'school/'
var mentor = 'mentor/'

module.exports = router => {

    router.use((req, res, next) => {
        // Override session data if the environment variable is set
        if (process.env.ENVIRONMENT === 'research' && !req.session.data['variablesInitialized']) {
            req.session.data['ab'] = process.env.AB;
            req.session.data['deliveryPartner'] = process.env.DP;
            req.session.data['leadProvider'] = process.env.LP;
            req.session.data['programmeType'] = process.env.PROG;
            req.session.data['schoolName'] = process.env.SCHOOLNAME;

            // Mark session variables as initialized
            req.session.data['variablesInitialized'] = true;
        }
        next();
    });

    // start page
    router.post(v + school + 'start', (req, res) => {
        if (req.query.rollover === 'yes') {
            req.session.data['transferJourney'] = ''
            req.session.data['defaultsAlreadyAdded'] = 'yes'
        }
        if (req.query.transfer === 'yes') {
            req.session.data['defaultsAlreadyAdded'] = ''
            req.session.data['transferJourney'] = 'yes'
        }
        if (req.query.mentorTransfer === 'yes') {
            req.session.data['defaultsAlreadyAdded'] = ''
            req.session.data['mentorTransfer'] = 'yes'
        }
        res.redirect(v + school + 'dfe-sign-in')
    })

    // dfe sign in page
    router.post(v + school + 'dfe-sign-in', (req, res) => {
        res.redirect(v + school + 'home/ects')
    })

    // **** prototype set up ****

    router.post(v + school + 'setup', (req, res) => {
        res.redirect(v + school + 'start')
    })

    // **** set up custom scenarios ****

    router.get(v + school + 'setup-scenario-1', (req, res) => {
        req.session.data['transferJourney'] = ''
        req.session.data['defaultsAlreadyAdded'] = 'no'
        res.redirect(v + school + 'start')
    })

    router.get(v + school + 'setup-scenario-2', (req, res) => {
        req.session.data['transferJourney'] = ''
        req.session.data['defaultsAlreadyAdded'] = 'yes'
        res.redirect(v + school + 'start?rollover=yes')
    })

    router.get(v + school + 'setup-scenario-3', (req, res) => {
        req.session.data['defaultsAlreadyAdded'] = ''
        req.session.data['transferJourney'] = 'yes'
        res.redirect(v + school + 'start?transfer=yes')
    })

    router.get(v + school + 'setup-scenario-4', (req, res) => {
        req.session.data['defaultsAlreadyAdded'] = ''
        req.session.data['mentorTransfer'] = 'yes'
        res.redirect(v + school + 'start?mentorTransfer=yes')
    })

    // what you'll need
    router.post(v + school + 'what-youll-need', (req, res) => {
        res.redirect(v + school + 'find-ect')
    })

    // add ECT from here

    router.post(v + school + 'find-ect', (req, res) => {
        if (req.session.data['askForNino'] === 'yes') {
            res.redirect(v + school + 'nino')
        }
        if (req.session.data['trn'] === '9999999') {
            res.redirect(v + school + 'nino')
        }
        else {
            res.redirect(v + school + 'review-ect-details')
        }
    })

    router.post(v + school + 'nino', (req, res) => {
        if (req.session.data['nino'].startsWith('Z')) {
            res.redirect(v + 'other-pages/add-ect/not-found')
        }
        else {
            req.session.data['askForNino'] = 'yes'
            res.redirect(v + school + 'review-ect-details')
        }
    })

    router.post(v + school + 'review-ect-details', (req, res) => {
        if (req.query.change === 'yes') {
            res.redirect(v + school + 'check-answers')
        }
        if (req.session.data.transferJourney === 'yes') {
            res.redirect(v + school + 'previously-training')
        }
        else {
            res.redirect(v + school + 'email-address')
        }
    })

    router.post(v + school + 'previously-training', (req, res) => {
        res.redirect(v + school + 'email-address')
    })

    router.post(v + school + 'email-address', (req, res) => {
        if (req.query.change === 'yes') {
            res.redirect(v + school + 'check-answers')
        }
        else {
            res.redirect(v + school + 'start-month')
        }
    })

    router.post(v + school + 'start-month', (req, res) => {
        if (req.query.change === 'yes') {
            res.redirect(v + school + 'check-answers')
        }
        else {
            res.redirect(v + school + 'part-time')
        }
    })

    router.post(v + school + 'part-time', (req, res) => {
        if (req.query.change === 'yes') {
            res.redirect(v + school + 'check-answers')
        }
        else if (req.session.data['transferJourney'] === 'yes') {
            res.redirect(v + school + 'will-you-use-defaults')
        }
        else if (req.session.data['defaultsAlreadyAdded'] === 'yes') {
            res.redirect(v + school + 'will-you-use-defaults')
        }
        else {
            res.redirect(v + school + 'appropriate-body')
        }
    })

    router.post(v + school + 'transfer-existing', (req, res) => {
        if (req.session.data['useDefaults'] === 'no') {
            res.redirect(v + school + 'appropriate-body')
        }
        else {
            if (req.session.data['mentorsAddedPreviously'] === 'no') {
                res.redirect(v + school + 'check-answers')
            }
            else {
                res.redirect(v + school + 'check-answers')
            }
        }
    })


    router.post(v + school + 'will-you-use-defaults', (req, res) => {
        if (req.session.data['useDefaults'] === 'yes' && req.session.data['programmeType'] === 'Provider-led') {
            req.session.data['showDp'] = true
        }
        if (req.session.data['useDefaults'] === 'no') {
            res.redirect(v + school + 'appropriate-body')
        }
        else {
            if (req.session.data['mentorsAddedPreviously'] === 'no') {
                res.redirect(v + school + 'check-answers')
            }
            else {
                res.redirect(v + school + 'check-answers')
            }
        }
    })

    // adding programme information that is not default

    router.post(v + school + 'appropriate-body', (req, res) => {
        if (req.session.data['ab'] === undefined) {
            req.session.data['ab'] = 'Alpha Teaching School Hub'
        }
        if (req.query.change === 'yes') {
            req.session.data.changeProg = 'yes'
        }
            res.redirect(v + school + 'programme-type')
    })

    router.post(v + school + 'programme-type', (req, res) => {
        if (req.query.change === 'yes') {
            req.session.data.changeProg = 'yes'
        }
        if (req.session.data['programmeType'] === 'School-led') {
            // res.redirect(v + school + 'save-programme-details')
            res.redirect(v + school + 'check-answers')
        }
        else {
            req.session.data['programmeType'] = 'Provider-led'
            res.redirect(v + school + 'lead-provider')
        }
    })

    router.post(v + school + 'lead-provider', (req, res) => {
        if (req.session.data['leadProvider'] === undefined) {
            req.session.data['leadProvider'] = 'Ambition Institute'
        }
        if (req.query.change === 'yes') {
            req.session.data.changeProg = 'yes'
        }
        req.session.data['showDp'] = false
        res.redirect(v + school + 'check-answers')
    })

    router.post(v + school + 'also-delivering', (req, res) => {
        if (req.session.data['alsoDelivering'] === 'Yes' || req.session.data['alsoDelivering'] === undefined) {
            req.session.data['deliveryPartner'] = req.session.data['ab']
        }
        if (req.query.change === 'yes') {
            req.session.data.changeProg = 'yes'
        }
        // res.redirect(v + school + 'save-programme-details')
        res.redirect(v + school + 'check-answers')
    })


    router.post(v + school + 'autocomplete-delivery-partner', (req, res) => {
        const dp = req.session.data['deliveryPartner'] ? req.session.data['deliveryPartner'].trim() : '';
        console.log('Delivery Partner:', dp);
        console.log('DP/LP pairings:', dpLp);
        const correspondingValue = dpLp[dp] || dpLp[dp.toLowerCase()] || dpLp[dp.toUpperCase()];
        if (correspondingValue) {
            req.session.data.leadProvider = correspondingValue;
        } else {
            req.session.data.leadProvider = 'Ambition Institute'
        }
        console.log('Lead Provider:', req.session.data.leadProvider);
        if (req.query.change === 'yes') {
            req.session.data.changeProg = 'yes'
        }
        // res.redirect(v + school + 'save-programme-details')
        res.redirect(v + school + 'check-answers')
    })

    router.post(v + school + 'save-programme-details', (req, res) => {
        if (req.session.data['mentorsAddedPreviously'] === 'no') {
            if (req.query.change === 'yes') {
                req.session.data.changeProg = ''
            }
            res.redirect(v + school + 'check-answers')
        }
        else {
            req.session.data['defaultsAlreadyAdded'] = 'yes'
            if (req.session.data.changeProg === 'yes') {
                req.session.data.changeProg = ''
                res.redirect(v + school + 'check-answers')
            }
            else {
                res.redirect(v + school + 'check-answers')
            }
        }
    })

    // end of adding non-default programme information

    router.post(v + school + 'mentor', (req, res) => {
        res.redirect(v + school + 'check-answers')
    })

    router.post(v + school + 'check-answers', (req, res) => {
        req.session.data['askForNino'] = ''
        req.session.data['ectAdded'] = 'yes'
        req.session.data['fullName'] = undefined
        if (req.session.data['mentor'] === 'Someone else' || req.session.data['mentorsAddedPreviously'] === 'no') {
            req.session.data['ectAddedWithoutMentor'] = 'yes'
            res.redirect(v + school + 'confirmation-mentor-to-be-added')
        }
        else {
            req.session.data['ectAddedWithoutMentor'] = 'yes'
            res.redirect(v + school + 'confirmation')
        }
    })

    // mentor journeys

    router.get(v + school + mentor + 'mentor-transfer', (req, res) => {
        req.session.data['mentorTransfer'] = 'yes'
        res.redirect(v + school + mentor + 'who-will-be-mentoring')
    })

    router.post(v + school + mentor + 'who-will-be-mentoring', (req, res) => {
        if (req.session.data ['mentor'] === 'Register a new mentor'){
            req.session.data['askForNino'] = null
            res.redirect(v + school + mentor + 'what-youll-need')
        }
        else {
            req.session.data['ectAddedWithoutMentor'] = ''
            res.redirect(v + school + mentor + 'assigned')
        }
    })

    router.post(v + school + mentor + 'what-youll-need', (req, res) => {
        res.redirect(v + school + mentor + 'find-mentor')
    })

    router.post(v + school + mentor + 'mentor-will-be-assigned-to', (req, res) => {
        res.redirect(v + school + mentor + 'find-mentor')
    })

    router.post(v + school + mentor + 'find-mentor', (req, res) => {
        if (req.session.data['trn'] === '9999999') {
            res.redirect(v + school + mentor + 'nino')
        }
        if (req.query.alreadyexists === 'yes') {
            res.redirect(v + 'other-pages/add-mentor/mentor-already-registered')
        }
        else {
            res.redirect(v + school + mentor + 'review-mentor-details')
        }
    })

    router.post(v + school + mentor + 'nino', (req, res) => {
        if (req.session.data['nino'].startsWith('Z')) {
            res.redirect(v + 'other-pages/add-mentor/not-found')
        }
        else {
            req.session.data['askForNino'] = 'yes'
            res.redirect(v + school + mentor + 'review-mentor-details')
        }
    })

    router.post(v + school + mentor + 'review-mentor-details', (req, res) => {
        if (req.query.change === 'yes') {
            res.redirect(v + school + mentor + 'check-answers')
        }
        else {
            res.redirect(v + school + mentor + 'email-address')
        }
    })

    router.post(v + school + mentor + 'email-address', (req, res) => {
        if (req.query.change === 'yes') {
            res.redirect(v + school + mentor + 'check-answers')
        }
        if (req.session.data.mentorTransfer === 'yes') {
            res.redirect(v + school + mentor + 'mentor-at-other-school')
        }
        else if (req.session.data['programmeType'] === 'School-led') {
            res.redirect(v + school + mentor + 'check-answers')
        }
        else {
            res.redirect(v + school + mentor + 'will-receive-mentor-training')
        }
    })

    router.post(v + school + mentor + 'mentor-at-other-school', (req, res) => {
        if (req.session.data['mentorOnly'] === 'no') {
            res.redirect(v + school + mentor + 'check-answers')
        }
        else if (req.session.data['programmeType'] === 'School-led') {
            res.redirect(v + school + mentor + 'check-answers')
        }
        else {
            res.redirect(v + school + mentor + 'previously-training')
        }
    })

    router.post(v + school + mentor + 'previously-training', (req, res) => {
        res.redirect(v + school + mentor + 'will-you-use-defaults')
    })

    router.post(v + school + mentor + 'will-receive-mentor-training', (req, res) => {
        res.redirect(v + school + mentor + 'check-answers')
    })

    router.post(v + school + mentor + 'will-you-use-defaults', (req, res) => {
        if (req.session.data['useDefaults'] === 'yes') {
            req.session.data['showDp'] = true
        }
        if (req.session.data['useDefaults'] === 'no') {
            res.redirect(v + school + mentor + 'lead-provider')
        }
        else {
            res.redirect(v + school + mentor + 'check-answers')
        }
    })

    router.post(v + school + mentor + 'lead-provider', (req, res) => {
        if (req.session.data['leadProvider'] === undefined) {
            req.session.data['leadProvider'] = 'Ambition Institute'
        }
        req.session.data['showDp'] = false
        res.redirect(v + school + mentor + 'check-answers')
    })

    router.post(v + school + mentor + 'check-answers', (req, res) => {
        req.session.data['fullName'] = undefined
        req.session.data['ectAddedWithoutMentor'] = ''
        res.redirect(v + school + mentor + 'confirmation')
    })

    // other pages

    router.post(v + 'other-pages/add-mentor/mentor-already-registered', (req, res) => {
        req.session.data['mentor'] = 'Tom Jones'
        res.redirect(v + school + mentor + 'assigned')
    })
}