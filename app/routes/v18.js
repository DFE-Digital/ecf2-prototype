// Change versions here
var v = '/v18/'
var vGet = 'v18/'
var vSingle = 'v18/'

// Add any directory variables here
var school = 'school/'
var mentor = 'mentor/'
var admin = 'admin/'

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

module.exports = router => {

    router.use((req, res, next) => {
        // Override session data if the environment variable is set
        if (process.env.ENVIRONMENT === 'research' && req.session.data['variablesInitialized' + vSingle] !== true) {
            console.log('== Research Mode: Applying environment variable overrides ==');
            req.session.data.researchMode = true;

            // Set session-level defaults for new participants and page titles
            req.session.data['ab'] = process.env.AB;
            req.session.data['deliveryPartner'] = process.env.DP;
            req.session.data['leadProvider'] = process.env.LP;
            req.session.data['programmeType'] = process.env.PROG;
            req.session.data['schoolName'] = process.env.SCHOOLNAME;
            console.log('Session data:', req.session.data);

            console.log('Research mode environment variables:');
            console.log('Lead Provider:', process.env.LP);
            console.log('Delivery Partner:', process.env.DP);
            console.log('Programme Type:', process.env.PROG);
            console.log('Appropriate Body:', process.env.AB);
            console.log('ECTs array length:', req.session.data.ects ? req.session.data.ects.length : 'undefined');
            console.log('Mentors array length:', req.session.data.mentors ? req.session.data.mentors.length : 'undefined');

            // Override the data for all existing participants in the session
            if (req.session.data.ects && req.session.data.ects.length > 0) {
                console.log('Overriding ECT data...');
                req.session.data.ects.forEach((ect, index) => {
                    console.log(`Before override - ECT ${index} (${ect.name}): LP=${ect.leadProvider}, DP=${ect.deliveryPartner}, TP=${ect.trainingProgramme}, AB=${ect.appropriateBody}`);
                    ect.leadProvider = process.env.LP;
                    ect.trainingProgramme = process.env.PROG;
                    ect.deliveryPartner = process.env.DP;
                    ect.appropriateBody = process.env.AB;
                    console.log(`After override - ECT ${index} (${ect.name}): LP=${ect.leadProvider}, DP=${ect.deliveryPartner}, TP=${ect.trainingProgramme}, AB=${ect.appropriateBody}`);
                });
            } else {
                console.log('No ECTs found to override or ECTs array is undefined');
            }

            if (req.session.data.mentors && req.session.data.mentors.length > 0) {
                console.log('Overriding mentor data...');
                req.session.data.mentors.forEach((mentor, index) => {
                    console.log(`Before override - Mentor ${index} (${mentor.name}): LP=${mentor.leadProvider}, DP=${mentor.deliveryPartner}`);
                    mentor.leadProvider = process.env.LP;
                    mentor.deliveryPartner = process.env.DP;
                    console.log(`After override - Mentor ${index} (${mentor.name}): LP=${mentor.leadProvider}, DP=${mentor.deliveryPartner}`);
                });
            } else {
                console.log('No mentors found to override or mentors array is undefined');
            }
            // Mark session variables as initialized to prevent this from running again
            req.session.data['variablesInitialized' + vSingle] = true;
            console.log('Research mode initialization complete');

            // Store the original research mode values so they can't be accidentally overwritten
            req.session.data['_researchDefaults'] = {
                leadProvider: process.env.LP,
                deliveryPartner: process.env.DP,
                programmeType: process.env.PROG,
                appropriateBody: process.env.AB
            };
        }
        next();
    });

    // change induction tutor journey
    
    router.post(v + school + 'home/induction-tutor', (req, res) => {
        res.redirect(v + school + 'home/change/sit/change-school-induction-tutor')
    })

    router.post(v + school + 'home/change/sit/change-school-induction-tutor', (req, res) => {
        res.redirect(v + school + 'home/change/sit/confirm-change')
    })

    router.post(v + school + 'home/change/sit/confirm-change', (req, res) => {
        res.redirect(v + school + 'home/change/sit/change-confirmation')
    })

    router.post(v + school + 'home/change/sit/change-confirmation', (req, res) => {
        req.session.data['noSit'] = null
        req.session.data['checkSit'] = null
        res.redirect(v + school + 'home/ects')
    })

    router.post(v + school + 'home/change/sit/tell-us-sit', (req, res) => {
        req.session.data['checkSit'] = 'no'
        req.session.data['noSit'] = 'yes'        
        res.redirect(v + school + 'home/change/sit/confirm-change')
    })    

    // Send support form confirmation

    router.post(v + school + 'get-help', (req, res) => {
        res.redirect(v + school + 'get-help-confirm-send')
    })

    // SIT pages when logging in

    router.post(v + school + 'sit/check-school-induction-tutor-1', (req, res) => {
        res.redirect(v + school + 'sit/details-confirmed-1')
    })

    router.post(v + school + 'sit/details-confirmed-1', (req, res) => {
        res.redirect(v + school + 'home/ects')
    })

    router.post(v + school + 'home/change/sit/check-sit', (req, res) => {
        req.session.data['noSit'] = 'no'            
        req.session.data['checkSit'] = 'yes'
        
        if (req.session.data['confirm-school-induction-tutor'] === 'no') {   
            res.redirect(v + school + 'home/change/sit/confirm-change')
        }
        else {
            res.redirect(v + school + 'home/change/sit/sit-no-change')
        }
    })

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
        if (req.query.checkSit === 'yes') {
            req.session.data['noSit'] = 'no'            
            req.session.data['checkSit'] = 'yes'
        }
        if (req.query.noSit === 'yes') {
            req.session.data['checkSit'] = 'no'
            req.session.data['noSit'] = 'yes'
        }
        res.redirect(v + school + 'dfe-sign-in')
    })

    // dfe sign in page
    router.post(v + school + 'dfe-sign-in', (req, res) => {
        if (req.session.data['checkSit'] === 'yes') {
            res.redirect(v + school + 'home/change/sit/check-sit')
        }
        if (req.session.data['noSit'] === 'yes') {
            res.redirect(v + school + 'home/change/sit/tell-us-sit')
        }        
        else {
            res.redirect(v + school + 'home/ects')
        }
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
        res.redirect(v + school + 'home/ects')
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

    router.get(v + school + 'setup-scenario-5', (req, res) => {
        req.session.data['transferJourney'] = ''
        req.session.data['defaultsAlreadyAdded'] = 'yes'
        req.session.data['checkSit'] = 'yes'
        res.redirect(v + school + 'start?checkSit=yes')
    })

    router.get(v + school + 'setup-scenario-6', (req, res) => {
        req.session.data['transferJourney'] = ''
        req.session.data['defaultsAlreadyAdded'] = 'yes'
        req.session.data['noSit'] = 'yes'
        res.redirect(v + school + 'start?noSit=yes')
    })    

    // what you'll need
    router.post(v + school + 'what-youll-need', (req, res) => {
        res.redirect(v + school + 'find-ect')
    })

    // what you'll need in place
    router.post(v + school + 'what-youll-need-in-place', (req, res) => {
        res.redirect(v + school + 'dfe-sign-in')
    })

     // start what you'll need
    router.post(v + school + 'start-what-youll-need', (req, res) => {
        res.redirect(v + school + 'dfe-sign-in')
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
        if (req.session.data['useDefaults'] === 'yes' && req.session.data['programmeType'] !== 'School-led') {
            req.session.data['showDp'] = true
        }
        if (req.session.data['useDefaults'] === 'no') {
            req.session.data['showDp'] = ''
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

    // view ect and withdrawal
    
    router.post(v + school + 'home/ect-leaving', (req, res) => {        
        // Store form data for check-answers page
        req.session.data.ectId = req.body.ectId;
        req.session.data.ectName = req.body.ectName;
        res.redirect(v + school + 'home/ect-leaving-check-answers?ect=' + req.body.ectId);
    
    })

    router.post(v + school + 'home/ect-leaving-check-answers', (req, res) => {
        res.redirect(v + school + 'home/ect-leaving-confirmation?ect=' + req.query.ect);
    })

    router.post(v + school + 'home/ect-leaving-confirmation', (req, res) => {
        // Update ECT status to 'Leaving school'
        const ectId = req.body.ectId;
        const ect = req.session.data.ects.find(e => e.id === ectId);
        if (ect) {
            ect.status = 'Leaving school';
            ect.statusClass = 'govuk-tag--yellow';
            if (req.session.data.day && req.session.data.month && req.session.data.year) {
                ect.leavingDate = req.session.data.day + ' ' + months[req.session.data.month - 1] + ' ' + req.session.data.year;
            }
        }
        res.redirect(v + school + 'home/ect-leaving-confirmation?ect=' + ectId);
    })

    // mentor leaving routes
    
    router.post(v + school + 'home/mentor-leaving', (req, res) => {        
         // Store form data for check-answers page
        req.session.data.mentorId = req.body.mentorId;
        req.session.data.mentorName = req.body.mentorName;
        res.redirect(v + school + 'home/mentor-leaving-check-answers?id=' + req.body.mentorId);
    })

    router.post(v + school + 'home/mentor-leaving-check-answers', (req, res) => {
        res.redirect(v + school + 'home/mentor-leaving-confirmation?id=' + req.query.id);
    })

    router.post(v + school + 'home/mentor-leaving-confirmation', (req, res) => {
        // Update mentor status to 'Leaving school'
        const mentorId = req.body.mentorId;
        const mentor = req.session.data.mentors.find(m => m.id === mentorId);
        if (mentor) {
            mentor.status = 'Leaving school';
            if (req.session.data.day && req.session.data.month && req.session.data.year) {
                mentor.leavingDate = req.session.data.day + ' ' + months[req.session.data.month - 1] + ' ' + req.session.data.year;
            }  
        }
        res.redirect(v + school + 'home/mentor-leaving-confirmation?id=' + mentorId);
    })

    // end of adding non-default programme information

    router.post(v + school + 'mentor', (req, res) => {
        res.redirect(v + school + 'check-answers')
    })

    router.post(v + school + 'check-answers', (req, res) => {
        req.session.data['askForNino'] = ''
        req.session.data['ectAdded'] = 'yes'
        req.session.data['fullName'] = undefined
        req.session.data['defaultsAlreadyAdded'] = 'yes'
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

    router.get(v + school + mentor + 'add-mentor', (req, res) => {
        req.session.data['mentorTransfer'] = ''
        res.redirect(v + school + mentor + 'who-will-be-mentoring')
    })

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
        else if (req.session.data.mentorTransfer === 'yes') {
            res.redirect(v + school + mentor + 'start-month')
        }
        else {
            res.redirect(v + school + mentor + 'email-address')
        }
    })

    router.post(v + school + mentor + 'start-month', (req, res) => {
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
        req.session.data['showLp'] = 'yes'
        res.redirect(v + school + mentor + 'check-answers')
    })

    router.get(v + school + mentor + 'select-lead-provider', (req, res) => {
        req.session.data['showLp'] = 'yes'
        res.redirect(v + school + mentor + 'lead-provider')
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
        req.session.data['showLp'] = ''
        res.redirect(v + school + mentor + 'confirmation')
    })

    // other pages

    router.post(v + 'other-pages/add-mentor/mentor-already-registered', (req, res) => {
        req.session.data['mentor'] = 'Tom Jones'
        res.redirect(v + school + mentor + 'assigned')
    })

    // change journeys

        // change lead provider 
        router.get(v + school + 'home/change/ects/change-lead-provider', (req, res) => {
            if (req.query.ectId) {
                req.session.data['ectId'] = req.query.ectId
            }

            const isWithdrawnJourney = req.query.withdrawn === 'true'
            req.session.data.withdrawnLeadProviderJourney = isWithdrawnJourney ? true : undefined

            const ectId = req.session.data['ectId']
            let ect = null

            if (ectId) {
                ect = req.session.data.ects.find(e => e.id === ectId)
            }

            if (req.query.fullName) {
                req.session.data['fullName'] = req.query.fullName
            } else if (ect) {
                req.session.data['fullName'] = ect.name
            }

            res.render(vGet + '/school/home/change/ects/change-lead-provider')
        })

        // change appropriate body 
        router.get(v + school + 'home/change/ects/change-appropriate-body', (req, res) => {
            // Set the ectId from query parameter
            if (req.query.ectId) {
                req.session.data['ectId'] = req.query.ectId
            }
            res.render(vGet + '/school/home/change/ects/change-appropriate-body')
        })

        // change working pattern 
        router.get(v + school + 'home/change/ects/change-working-pattern', (req, res) => {
            // Set the ectId from query parameter
            if (req.query.ectId) {
                req.session.data['ectId'] = req.query.ectId
            }
            res.render(vGet + '/school/home/change/ects/change-working-pattern')
        })

        // change training programme 
        router.get(v + school + 'home/change/ects/change-training-programme', (req, res) => {
            // Set the ectId from query parameter
            if (req.query.ectId) {
                req.session.data['ectId'] = req.query.ectId
            }

            const isWithdrawnTraining = req.query.withdrawnTraining === 'true'
            req.session.data.withdrawnTrainingProgrammeJourney = isWithdrawnTraining ? true : undefined
            res.render(vGet + '/school/home/change/ects/change-training-programme')
        })

        // change mentor 
        router.get(v + school + 'home/change/ects/change-mentor', (req, res) => {
            // Set the ectId from query parameter
            if (req.query.ectId) {
                req.session.data['ectId'] = req.query.ectId
            }
            res.render(vGet + '/school/home/change/ects/change-mentor')
        })
       
    
         router.post(v + school + 'home/change/ects/change-lead-provider', (req, res) => {
            const { leadProvider, id } = req.body;
            const ectId = id || req.session.data['ectId'];
            const ect = req.session.data.ects.find(e => e.id === ectId);
            
            if (ect) {
                // Store current and new lead provider for confirmation
                req.session.data.previousLeadProvider = ect.leadProvider;
                req.session.data.newLeadProvider = leadProvider;
                req.session.data.fullName = ect.name;
                req.session.data.selectedEctId = ect.id;
                req.session.data.changeType = 'leadProvider';
            }
        
            res.redirect(v + school + 'home/change/ects/confirm-change');
        })

        router.post(v + school + 'home/change/ects/change-appropriate-body', (req, res) => {
            const { appropriateBody, id } = req.body;
            const ect = req.session.data.ects.find(e => e.id === id);
            
            if (ect) {
                // Store current and new appropriate body for confirmation
                req.session.data.previousAppropriateBody = ect.appropriateBody;
                req.session.data.newAppropriateBody = appropriateBody;
                req.session.data.fullName = ect.name;
                req.session.data.selectedEctId = ect.id;
                req.session.data.changeType = 'appropriateBody';
            }
        
            res.redirect(v + school + 'home/change/ects/confirm-change');
        })

        router.post(v + school + 'home/change/ects/change-working-pattern', (req, res) => {
            const { workingPattern, id } = req.body;
            const ect = req.session.data.ects.find(e => e.id === id);
            
            if (ect) {
                // Store current and new working pattern for confirmation
                req.session.data.previousWorkingPattern = ect.workingPattern;
                req.session.data.newWorkingPattern = workingPattern;
                req.session.data.fullName = ect.name;
                req.session.data.selectedEctId = ect.id;
                req.session.data.changeType = 'workingPattern';
            }
        
            res.redirect(v + school + 'home/change/ects/confirm-change');
        })

        router.post(v + school + 'home/change/ects/change-training-programme', (req, res) => {
            const { newTrainingProgramme, id } = req.body;
            const ect = req.session.data.ects.find(e => e.id === id);
            
            if (ect) {
                // Store current and new training programme for confirmation
                req.session.data.previousTrainingProgramme = ect.trainingProgramme;
                req.session.data.newTrainingProgramme = newTrainingProgramme;
                req.session.data.fullName = ect.name;
                req.session.data.selectedEctId = ect.id;
                req.session.data.changeType = 'trainingProgramme';
            }

            // If changing to Provider-led, need to select a lead provider
            if (newTrainingProgramme === 'Provider-led') {
                res.redirect(v + school + 'home/change/ects/change-training-programme-lead-provider');
            } else {
                // If changing to School-led, go straight to confirmation
                res.redirect(v + school + 'home/change/ects/confirm-change');
            }
        })

        router.post(v + school + 'home/change/ects/change-training-programme-lead-provider', (req, res) => {
            const { leadProvider, id, newTrainingProgramme } = req.body;
            const ect = req.session.data.ects.find(e => e.id === id);
            
            if (ect) {
                // Store the lead provider selection
                req.session.data.newLeadProvider = leadProvider;
                // Ensure we maintain the training programme change data
                req.session.data.newTrainingProgramme = newTrainingProgramme;
                req.session.data.fullName = ect.name;
                req.session.data.selectedEctId = ect.id;
                req.session.data.changeType = 'trainingProgramme';
            }
        
            res.redirect(v + school + 'home/change/ects/confirm-change');
        })

        router.post(v + school + 'home/change/ects/change-mentor', (req, res) => {
            const { newMentorId, ectId } = req.body;
            const ect = req.session.data.ects.find(e => e.id === ectId);
            
            if (ect) {
                // Find current mentor name
                let currentMentorName = 'Not assigned';
                if (ect.mentorId) {
                    const currentMentor = req.session.data.mentors.find(m => m.id === ect.mentorId);
                    if (currentMentor) {
                        currentMentorName = currentMentor.name;
                    }
                }
                
                // Find new mentor name
                const newMentor = req.session.data.mentors.find(m => m.id === newMentorId);
                const newMentorName = newMentor ? newMentor.name : 'Unknown';
                
                // Store current and new mentor for confirmation
                req.session.data.previousMentorId = ect.mentorId;
                req.session.data.previousMentorName = currentMentorName;
                req.session.data.newMentorId = newMentorId;
                req.session.data.newMentorName = newMentorName;
                req.session.data.fullName = ect.name;
                req.session.data.selectedEctId = ect.id;
                req.session.data.changeType = 'mentor';
            }
        
            res.redirect(v + school + 'home/change/ects/confirm-change');
        })
    
        // New route for confirm-change page
        router.post(v + school + 'home/change/ects/confirm-change', (req, res) => {
            const { id } = req.body;
            const ectId = id || req.session.data.selectedEctId;
            const ect = req.session.data.ects.find(e => e.id === ectId);
            
            if (ect) {
                if (req.session.data.changeType === 'name' && req.session.data.newName) {
                    // Update the ECT's name
                    ect.name = req.session.data.newName;
                    req.session.data.changedEctId = ect.id;
                    req.session.data.changedName = req.session.data.newName;
                    
                    // Clean up temporary data
                    req.session.data.previousName = undefined;
                    req.session.data.newName = undefined;
                    req.session.data.changeType = undefined;
                    
                    // Clear any previous change data
                    req.session.data.changedEmail = undefined;
                    req.session.data.changedAppropriateBody = undefined;
                    req.session.data.changedWorkingPattern = undefined;
                    req.session.data.changedTrainingProgramme = undefined;
                    req.session.data.changedLeadProvider = undefined;
                    req.session.data.changedMentorName = undefined;
                    
                    res.redirect(v + school + 'home/change/ects/change-confirmation');
                } else if (req.session.data.changeType === 'email' && req.session.data.newEmail) {
                    // Update the ECT's email
                    ect.email = req.session.data.newEmail;
                    req.session.data.changedEctId = ect.id;
                    req.session.data.changedEmail = req.session.data.newEmail;
                    
                    // Clean up temporary data
                    req.session.data.previousEmail = undefined;
                    req.session.data.newEmail = undefined;
                    req.session.data.changeType = undefined;
                    
                    // Clear any previous change data
                    req.session.data.changedName = undefined;
                    req.session.data.changedAppropriateBody = undefined;
                    req.session.data.changedWorkingPattern = undefined;
                    req.session.data.changedTrainingProgramme = undefined;
                    req.session.data.changedLeadProvider = undefined;
                    req.session.data.changedMentorName = undefined;
                    
                    res.redirect(v + school + 'home/change/ects/change-confirmation');
                } else if (req.session.data.changeType === 'trainingProgramme' && req.session.data.newTrainingProgramme) {
                    // Update the ECT's training programme
                    ect.trainingProgramme = req.session.data.newTrainingProgramme;

                    // If changing to Provider-led, also update lead provider and delivery partner
                    if (req.session.data.newTrainingProgramme === 'Provider-led' && req.session.data.newLeadProvider) {
                        ect.leadProvider = req.session.data.newLeadProvider;
                        
                        // In research mode, changing the lead provider has special rules.
                        if (req.session.data.researchMode) {
                            // If the new provider matches the session's default, align the delivery partner.
                            // Otherwise, the delivery partner is unknown until the new provider confirms.
                            if (req.session.data.newLeadProvider === req.session.data._researchDefaults.leadProvider) {
                                ect.deliveryPartner = req.session.data._researchDefaults.deliveryPartner;
                            } else {
                                ect.deliveryPartner = null;
                            }
                        } else {
                            // Static, default logic for non-research mode.
                            if (req.session.data.newLeadProvider === 'Ambition Institute') {
                                ect.deliveryPartner = 'Alpha Teaching School Hub';
                            } else {
                                ect.deliveryPartner = null;
                            }
                        }
                        
                        // Store lead provider for confirmation page
                        req.session.data.changedLeadProvider = req.session.data.newLeadProvider;
                    } else if (req.session.data.newTrainingProgramme === 'School-led') {
                        // Clear lead provider and delivery partner for school-led
                        ect.leadProvider = null;
                        ect.deliveryPartner = null;
                    }

                    req.session.data.changedEctId = ect.id;
                    req.session.data.changedTrainingProgramme = req.session.data.newTrainingProgramme;
                    
                    // Clean up temporary data for this specific change
                    req.session.data.previousTrainingProgramme = undefined;
                    req.session.data.newTrainingProgramme = undefined;
                    req.session.data.newLeadProvider = undefined;
                    req.session.data.changeType = undefined;
                    req.session.data.withdrawnTrainingProgrammeJourney = undefined;
                    
                    // Clear any previous change data
                    req.session.data.changedName = undefined;
                    req.session.data.changedEmail = undefined;
                    req.session.data.changedAppropriateBody = undefined;
                    req.session.data.changedWorkingPattern = undefined;
                    req.session.data.changedMentorName = undefined;
                    // Note: Don't clear changedLeadProvider here as it may be part of training programme change
                    
                    res.redirect(v + school + 'home/change/ects/change-confirmation');
                } else if (req.session.data.changeType === 'mentor' && req.session.data.newMentorId) {
                    // Update the ECT's mentor
                    ect.mentorId = req.session.data.newMentorId;

                    req.session.data.changedEctId = ect.id;
                    req.session.data.changedMentorName = req.session.data.newMentorName;
                    
                    // Clean up temporary data for this specific change
                    req.session.data.previousMentorId = undefined;
                    req.session.data.previousMentorName = undefined;
                    req.session.data.newMentorId = undefined;
                    req.session.data.newMentorName = undefined;
                    req.session.data.changeType = undefined;
                    
                    // Clear any previous change data
                    req.session.data.changedName = undefined;
                    req.session.data.changedEmail = undefined;
                    req.session.data.changedAppropriateBody = undefined;
                    req.session.data.changedWorkingPattern = undefined;
                    req.session.data.changedTrainingProgramme = undefined;
                    req.session.data.changedLeadProvider = undefined;
                    
                    res.redirect(v + school + 'home/change/ects/change-confirmation');
                } else if (req.session.data.changeType === 'leadProvider' && req.session.data.newLeadProvider) {
                    // Update the ECT's lead provider (standalone lead provider change)
                    ect.leadProvider = req.session.data.newLeadProvider;
                    
                    // In research mode, changing the lead provider has special rules.
                    if (req.session.data.researchMode) {
                        // If the new provider matches the session's default, align the delivery partner.
                        // Otherwise, the delivery partner is unknown until the new provider confirms.
                        if (req.session.data.newLeadProvider === req.session.data._researchDefaults.leadProvider) {
                            ect.deliveryPartner = req.session.data._researchDefaults.deliveryPartner;
                        } else {
                            ect.deliveryPartner = null;
                        }
                    } else {
                        // Static, default logic for non-research mode.
                        if (req.session.data.newLeadProvider === 'Ambition Institute') {
                            ect.deliveryPartner = 'Alpha Teaching School Hub';
                        } else {
                            ect.deliveryPartner = null;
                        }
                    }

                    if (req.session.data.withdrawnLeadProviderJourney) {
                        ect.status = 'Registered';
                        ect.statusClass = 'govuk-tag--green';
                    }

                    req.session.data.changedEctId = ect.id;
                    req.session.data.changedLeadProvider = req.session.data.newLeadProvider;
                    
                    // Clean up temporary data for this specific change
                    req.session.data.previousLeadProvider = undefined;
                    req.session.data.newLeadProvider = undefined;
                    req.session.data.changeType = undefined;
                    req.session.data.withdrawnLeadProviderJourney = undefined;
                    
                    // Clear any previous change data
                    req.session.data.changedName = undefined;
                    req.session.data.changedEmail = undefined;
                    req.session.data.changedAppropriateBody = undefined;
                    req.session.data.changedWorkingPattern = undefined;
                    req.session.data.changedTrainingProgramme = undefined;
                    req.session.data.changedMentorName = undefined;
                    
                    res.redirect(v + school + 'home/change/ects/change-confirmation');
                } else if (req.session.data.newAppropriateBody) {
                    // Update the ECT's appropriate body
                    ect.appropriateBody = req.session.data.newAppropriateBody;

                    req.session.data.changedEctId = ect.id;
                    req.session.data.changedAppropriateBody = req.session.data.newAppropriateBody;
                    
                    // Clean up temporary data for this specific change
                    req.session.data.previousAppropriateBody = undefined;
                    req.session.data.newAppropriateBody = undefined;
                    req.session.data.changeType = undefined;
                    
                    // Clear any previous change data
                    req.session.data.changedName = undefined;
                    req.session.data.changedEmail = undefined;
                    req.session.data.changedWorkingPattern = undefined;
                    req.session.data.changedTrainingProgramme = undefined;
                    req.session.data.changedLeadProvider = undefined;
                    req.session.data.changedMentorName = undefined;
                    
                    res.redirect(v + school + 'home/change/ects/change-confirmation');
                } else if (req.session.data.newWorkingPattern) {
                    // Update the ECT's working pattern
                    ect.workingPattern = req.session.data.newWorkingPattern;

                    req.session.data.changedEctId = ect.id;
                    req.session.data.changedWorkingPattern = req.session.data.newWorkingPattern;
                    
                    // Clean up temporary data for this specific change
                    req.session.data.previousWorkingPattern = undefined;
                    req.session.data.newWorkingPattern = undefined;
                    req.session.data.changeType = undefined;
                    
                    // Clear any previous change data
                    req.session.data.changedName = undefined;
                    req.session.data.changedEmail = undefined;
                    req.session.data.changedAppropriateBody = undefined;
                    req.session.data.changedTrainingProgramme = undefined;
                    req.session.data.changedLeadProvider = undefined;
                    req.session.data.changedMentorName = undefined;
                    
                    res.redirect(v + school + 'home/change/ects/change-confirmation');
                }
            }
            
            // Clean up common data
            req.session.data.selectedEctId = undefined;
        })
    
                   router.post(v + school + 'home/change/mentors/change-lead-provider', (req, res) => {
             const { leadProvider, id } = req.body;
             const mentor = req.session.data.mentors.find(m => m.id === id);
     
             if (mentor) {
                 // Store current and new lead provider for confirmation
                 req.session.data.previousLeadProvider = mentor.leadProvider;
                 req.session.data.newLeadProvider = leadProvider;
                 req.session.data.fullName = mentor.name;
                 req.session.data.selectedMentorId = mentor.id;
                 req.session.data.changeType = 'leadProvider';
             }
     
             res.redirect(v + school + 'home/change/mentors/confirm-change');
         })
    
        // New route for confirm-change-mentor page
        router.post(v + school + 'home/change/mentors/confirm-change', (req, res) => {
            const { id } = req.body;
            const mentorId = id || req.session.data.selectedMentorId;
            const mentor = req.session.data.mentors.find(m => m.id === mentorId);
            
            if (mentor) {
                if (req.session.data.changeType === 'name' && req.session.data.newName) {
                    // Update the mentor's name
                    mentor.name = req.session.data.newName;
                    req.session.data.changedMentorId = mentor.id;
                    req.session.data.changedName = req.session.data.newName;
                    
                    // Clean up temporary data
                    req.session.data.previousName = undefined;
                    req.session.data.newName = undefined;
                    req.session.data.changeType = undefined;
                    
                    // Clear any previous change data
                    req.session.data.changedEmail = undefined;
                    req.session.data.changedAppropriateBody = undefined;
                    req.session.data.changedWorkingPattern = undefined;
                    req.session.data.changedTrainingProgramme = undefined;
                    req.session.data.changedLeadProvider = undefined;
                    req.session.data.changedMentorName = undefined;
                    
                    res.redirect(v + school + 'home/change/mentors/change-confirmation');
                } else if (req.session.data.changeType === 'email' && req.session.data.newEmail) {
                    // Update the mentor's email
                    mentor.email = req.session.data.newEmail;
                    req.session.data.changedMentorId = mentor.id;
                    req.session.data.changedEmail = req.session.data.newEmail;
                    
                    // Clean up temporary data
                    req.session.data.previousEmail = undefined;
                    req.session.data.newEmail = undefined;
                    req.session.data.changeType = undefined;
                    
                    // Clear any previous change data
                    req.session.data.changedName = undefined;
                    req.session.data.changedAppropriateBody = undefined;
                    req.session.data.changedWorkingPattern = undefined;
                    req.session.data.changedTrainingProgramme = undefined;
                    req.session.data.changedLeadProvider = undefined;
                    req.session.data.changedMentorName = undefined;
                    
                    res.redirect(v + school + 'home/change/mentors/change-confirmation');
                } else if (req.session.data.changeType === 'leadProvider' && req.session.data.newLeadProvider) {
                    // Update the mentor's lead provider
                    mentor.leadProvider = req.session.data.newLeadProvider;

                    // In research mode, changing the lead provider has special rules.
                    if (req.session.data.researchMode) {
                        // If the new provider matches the session's default, align the delivery partner.
                        // Otherwise, the delivery partner is unknown until the new provider confirms.
                        if (req.session.data.newLeadProvider === req.session.data._researchDefaults.leadProvider) {
                            mentor.deliveryPartner = req.session.data._researchDefaults.deliveryPartner;
                        } else {
                            mentor.deliveryPartner = null;
                        }
                    } else {
                        // Static, default logic for non-research mode.
                        if (req.session.data.newLeadProvider === 'Ambition Institute') {
                            mentor.deliveryPartner = 'Alpha Teaching School Hub';
                        } else {
                            mentor.deliveryPartner = null;
                        }
                    }
                    
                    req.session.data.changedMentorId = mentor.id;
                    req.session.data.changedLeadProvider = req.session.data.newLeadProvider;
                    
                    // Clean up temporary data for this specific change
                    req.session.data.previousLeadProvider = undefined;
                    req.session.data.newLeadProvider = undefined;
                    req.session.data.changeType = undefined;
                    
                    // Clear any previous change data
                    req.session.data.changedName = undefined;
                    req.session.data.changedEmail = undefined;
                    req.session.data.changedAppropriateBody = undefined;
                    req.session.data.changedWorkingPattern = undefined;
                    req.session.data.changedTrainingProgramme = undefined;
                    req.session.data.changedMentorName = undefined;
                    
                    res.redirect(v + school + 'home/change/mentors/change-confirmation');
                }
            }
            
            // Clean up common data
            req.session.data.selectedMentorId = undefined;
        })
    
        // Change name routes for ECTs
        router.post(v + school + 'home/change/ects/change-name', (req, res) => {
            const { newName, ectId } = req.body;
            const ect = req.session.data.ects.find(e => e.id === ectId);
            
            if (ect && newName) {
                // Store current and new name for confirmation
                req.session.data.previousName = ect.name;
                req.session.data.newName = newName;
                req.session.data.fullName = ect.name;
                req.session.data.selectedEctId = ect.id;
                req.session.data.changeType = 'name';
            }
            
            res.redirect(v + school + 'home/change/ects/confirm-change');
        })
    
        // Change name routes for mentors
        router.post(v + school + 'home/change/mentors/change-name', (req, res) => {
            const { newName, id } = req.body;
            const mentor = req.session.data.mentors.find(m => m.id === id);
            
            if (mentor && newName) {
                // Store current and new name for confirmation
                req.session.data.previousName = mentor.name;
                req.session.data.newName = newName;
                req.session.data.fullName = mentor.name;
                req.session.data.selectedMentorId = mentor.id;
                req.session.data.changeType = 'name';
            }
            
            res.redirect(v + school + 'home/change/mentors/confirm-change');
        })

        // Change email routes for ECTs
        router.post(v + school + 'home/change/ects/change-email', (req, res) => {
            const { newEmail, ectId } = req.body;
            const ect = req.session.data.ects.find(e => e.id === ectId);
            
            if (ect && newEmail) {
                // Store current and new email for confirmation
                req.session.data.previousEmail = ect.email;
                req.session.data.newEmail = newEmail;
                req.session.data.fullName = ect.name;
                req.session.data.selectedEctId = ect.id;
                req.session.data.changeType = 'email';
            }
            
            res.redirect(v + school + 'home/change/ects/confirm-change');
        })

        // Change email routes for mentors
        router.post(v + school + 'home/change/mentors/change-email', (req, res) => {
            const { newEmail, id } = req.body;
            const mentor = req.session.data.mentors.find(m => m.id === id);
            
            if (mentor && newEmail) {
                // Store current and new email for confirmation
                req.session.data.previousEmail = mentor.email;
                req.session.data.newEmail = newEmail;
                req.session.data.fullName = mentor.name;
                req.session.data.selectedMentorId = mentor.id;
                req.session.data.changeType = 'email';
            }
            
            res.redirect(v + school + 'home/change/mentors/confirm-change');
        })

    // **********************
    // **********************
    // **********************

        // admin add new partnership journey

        router.get(v + admin + 'organisations/school-details', (req, res) => {
            res.render(vGet + '/admin/organisations/school-details', {
                query: req.query
            });
        })

        router.get(v + admin + 'teachers-details', (req, res) => {
            res.render(vGet + '/admin/teachers-details', {
                query: req.query
            });
        })

        router.get(v + admin + 'organisations/delete-partnership', (req, res) => {
            res.render(vGet + '/admin/organisations/delete-partnership');
        })

        router.post(v + admin + 'organisations/delete-partnership', (req, res) => {
            req.session.data.partnershipAdded = false;
            res.redirect(v + admin + 'organisations/school-details?section=partnerships&partnershipDeleted=1');
        })

        router.post(v + admin + 'organisations/add-new-partnership/select-contract-period', (req, res) => {
            if (!req.session.data) {
                req.session.data = {};
            }
            req.session.data.newPartnershipContractPeriod = req.body.contractPeriod;
            res.redirect(v + admin + 'organisations/add-new-partnership/select-lead-provider');
        })

        router.post(v + admin + 'organisations/add-new-partnership/select-lead-provider', (req, res) => {
            if (!req.session.data) {
                req.session.data = {};
            }
            req.session.data.newPartnershipLeadProvider = req.body.leadProvider;
            res.redirect(v + admin + 'organisations/add-new-partnership/select-delivery-partner');
        })

        router.post(v + admin + 'organisations/add-new-partnership/select-delivery-partner', (req, res) => {
            if (!req.session.data) {
                req.session.data = {};
            }
            req.session.data.newPartnershipDeliveryPartner = req.body.deliveryPartner;
            res.redirect(v + admin + 'organisations/add-new-partnership/confirm-add-partnership');
        })
        

        router.post(v + admin + 'organisations/add-new-partnership/confirm-add-partnership', (req, res) => {
            req.session.data.partnershipAdded = true;
            res.redirect(v + admin + 'organisations/school-details?section=partnerships&partnershipAdded=1');
        })

        // finance home page - direct access
        router.get(v + admin + 'finance-home', (req, res) => {
            const financeData = req.session.data.financeData || [];
            
            // Get query parameters for filtering
            const provider = req.query.provider || 'All';
            const year = req.query.year || 'All';
            const date = req.query.date || 'All';
            const statementType = req.query.statementType || 'Output statements';
            
            // Apply filters to the data
            let filteredData = [...financeData];
            
            if (provider !== 'All') {
                filteredData = filteredData.filter(item => item.provider === provider);
            }
            
            if (year !== 'All') {
                filteredData = filteredData.filter(item => item.contractYear === parseInt(year));
            }
            
            if (date !== 'All') {
                filteredData = filteredData.filter(item => item.statement === date);
            }
            
            if (statementType !== 'All') {
                if (statementType === 'Output statements') {
                    // Filter for Open, Payable, and Authorised for payment
                    filteredData = filteredData.filter(item => 
                        item.status === 'Open' || 
                        item.status === 'Payable' || 
                        item.status === 'Authorised for payment'
                    );
                } else if (statementType === 'Service fee statements') {
                    // Filter for Service fee statement
                    filteredData = filteredData.filter(item => item.status === 'Not applicable');
                }
            }
            
            // Sort data by contract year and then by statement date
            filteredData.sort((a, b) => {
                // First sort by contract year (ascending)
                if (a.contractYear !== b.contractYear) {
                    return a.contractYear - b.contractYear;
                }
                
                // If same contract year, sort by statement date
                const aDateParts = a.statement.split(' ');
                const bDateParts = b.statement.split(' ');
                
                const aMonth = aDateParts[0];
                const aYear = parseInt(aDateParts[1]);
                
                const bMonth = bDateParts[0];
                const bYear = parseInt(bDateParts[1]);
                
                // Sort by year first
                if (aYear !== bYear) {
                    return aYear - bYear;
                }
                
                // If same year, sort by month
                const monthOrder = {
                    "January": 1, 
                    "February": 2, 
                    "March": 3, 
                    "April": 4, 
                    "May": 5, 
                    "June": 6, 
                    "July": 7, 
                    "August": 8, 
                    "September": 9, 
                    "October": 10, 
                    "November": 11, 
                    "December": 12
                };
                
                return monthOrder[aMonth] - monthOrder[bMonth];
            });
            
            // Pagination logic
            const page = parseInt(req.query.page) || 1;
            const itemsPerPage = 20;
            const totalItems = filteredData ? filteredData.length : 0;
            const totalPages = Math.ceil(totalItems / itemsPerPage);
            
            // Calculate the start and end indices for the current page
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
            
            // Get the subset of data for the current page
            const currentPageData = filteredData ? filteredData.slice(startIndex, endIndex) : [];
            
            // Generate pagination items
            const paginationItems = [];
            
            // Add ellipsis logic for many pages
            const showEllipsisStart = page > 3;
            const showEllipsisEnd = page < totalPages - 2;
            
            // Build the base query string for pagination links
            const baseQueryString = Object.entries(req.query)
                .filter(([key]) => key !== 'page')
                .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
                .join('&');
            
            const getPageUrl = (pageNum) => {
                const separator = baseQueryString ? '&' : '';
                return `${v}${admin}finance-home?${baseQueryString}${separator}page=${pageNum}`;
            };
            
            // Add page numbers
            for (let i = 1; i <= totalPages; i++) {
                // Show first and last pages, and pages around the current page
                if (
                    i === 1 || 
                    i === totalPages || 
                    (i >= page - 1 && i <= page + 1) ||
                    (i === 2 && page <= 3) ||
                    (i === totalPages - 1 && page >= totalPages - 2)
                ) {
                    paginationItems.push({
                        number: i,
                        current: i === page,
                        href: getPageUrl(i)
                    });
                } 
                // Add ellipsis (as a non-link item)
                else if (
                    (i === 2 && showEllipsisStart) || 
                    (i === totalPages - 1 && showEllipsisEnd)
                ) {
                    paginationItems.push({
                        ellipsis: true
                    });
                }
            }
            
            // Determine previous and next links
            const prevPage = page > 1 ? page - 1 : null;
            const nextPage = page < totalPages ? page + 1 : null;
            
            // Render with pagination data
            res.render(vGet + '/admin/finance-home', {
                financeStatements: currentPageData,
                pagination: {
                    items: paginationItems,
                    previous: prevPage ? {
                        href: getPageUrl(prevPage)
                    } : null,
                    next: nextPage ? {
                        href: getPageUrl(nextPage)
                    } : null
                },
                currentPage: page,
                totalPages: totalPages,
                totalItems: totalItems,
                query: req.query
            });
        })
    
        // finance statement page
        router.get(v + admin + 'finance/statement', (req, res) => {
            // Check if we should show banners (and then clear the flags)
            const showRemovedBanner = req.session.data.showAdjustmentRemovedBanner;
            const showAddedBanner = req.session.data.showAdjustmentAddedBanner;
            const showChangedBanner = req.session.data.showAdjustmentChangedBanner;
            
            if (showRemovedBanner) {
                req.session.data.showAdjustmentRemovedBanner = false;
            }
            if (showAddedBanner) {
                req.session.data.showAdjustmentAddedBanner = false;
            }
            if (showChangedBanner) {
                req.session.data.showAdjustmentChangedBanner = false;
            }

            // Pass the query parameters to the template
            res.render(vGet + '/admin/finance/statement', {
                query: req.query,
                showAdjustmentRemovedBanner: showRemovedBanner,
                showAdjustmentAddedBanner: showAddedBanner,
                showAdjustmentChangedBanner: showChangedBanner
            });
        })
    
        // add adjustment page
        router.get(v + admin + 'finance/add-adjustment', (req, res) => {
            // Pass the query parameters to the template
            res.render(vGet + '/admin/finance/add-adjustment', {
                query: req.query
            });
        })
    
        // handler for statement page form submission
        router.get(v + admin + 'finance/find-statement', (req, res) => {
            const provider = req.query.provider;
            const contractYear = req.query.contractYear;
            const statement = req.query.statement;
            
            // If any are "All", redirect to finance-home with filters
            if (provider === "All" || contractYear === "All" || statement === "All") {
                const queryString = Object.entries(req.query)
                    .filter(([key, value]) => value !== "All")
                    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
                    .join('&');
                
                return res.redirect(`${v}${admin}finance-home?${queryString}`);
            }
            
            // Check if the requested statement exists
            const financeData = req.session.data.financeData || [];
            
            const matchingStatement = financeData.find(item => 
                item.provider === provider && 
                item.contractYear.toString() === contractYear &&
                item.statement === statement
            );
            
            if (matchingStatement) {
                // Statement exists, redirect to it
                return res.redirect(`${v}${admin}finance/statement?provider=${encodeURIComponent(provider)}&contractYear=${contractYear}&statement=${encodeURIComponent(statement)}`);
            } else {
                // Statement doesn't exist, redirect to finance-home with filters
                return res.redirect(`${v}${admin}finance-home?provider=${encodeURIComponent(provider)}&year=${contractYear}&date=${encodeURIComponent(statement)}`);
            }
        })

    // **********************
    // **********************

    // Admin tooling and other stuff

    router.post(v + 'admin/finance/add-adjustment', (req, res) => {
        // Pull the values out of req.body (form submission data)
        const { adjustmentName, amount, provider, contractYear, statement, editIndex } = req.body;

        // Ensure req.session.data.adjustmentArray exists
        if (!Array.isArray(req.session.data.adjustmentArray)) {
            req.session.data.adjustmentArray = [];
        }

        // Check if this is an edit operation
        if (editIndex !== undefined && editIndex !== null && editIndex !== '') {
            // Update existing adjustment
            const index = parseInt(editIndex);
            if (index >= 0 && index < req.session.data.adjustmentArray.length) {
                req.session.data.adjustmentArray[index] = {
                    adjustmentName: adjustmentName,
                    amount: amount
                };
                // Set flag to show change banner
                req.session.data.showAdjustmentChangedBanner = true;
            }
        } else {
            // Append a new object
            req.session.data.adjustmentArray.push({
                adjustmentName: adjustmentName,
                amount: amount
            });
            // Set flag to show add banner
            req.session.data.showAdjustmentAddedBanner = true;
        }

        // Redirect back with the query parameters to maintain context
        const queryParams = new URLSearchParams({
            provider: provider || '',
            contractYear: contractYear || '',
            statement: statement || ''
        }).toString();

        res.redirect(v + 'admin/finance/statement?' + queryParams);
    });

    // Remove adjustment route
    router.get(v + admin + 'finance/remove-adjustment', (req, res) => {
        const { provider, contractYear, statement, index } = req.query;
        
        // Ensure req.session.data.adjustmentArray exists
        if (!Array.isArray(req.session.data.adjustmentArray)) {
            req.session.data.adjustmentArray = [];
        }

        // Remove the adjustment at the specified index
        const adjustmentIndex = parseInt(index);
        if (adjustmentIndex >= 0 && adjustmentIndex < req.session.data.adjustmentArray.length) {
            req.session.data.adjustmentArray.splice(adjustmentIndex, 1);
        }

        // Set flag to show removal banner
        req.session.data.showAdjustmentRemovedBanner = true;

        // Redirect back to statement with query parameters
        const queryParams = new URLSearchParams({
            provider: provider || '',
            contractYear: contractYear || '',
            statement: statement || ''
        }).toString();

        res.redirect(v + 'admin/finance/statement?' + queryParams);
    });
}
