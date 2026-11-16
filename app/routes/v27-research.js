// #4638 (who's the DP): research landing page for Sophia's sessions, 24–25 Nov 2026.
// Participants see letters only. The letter-to-version key stays in this file.
// Loaded from the top of v27.js, so these routes run before the v27 ones.

const RESEARCH_HOME = '/v27/research'
const JOURNEY_START = '/v27/school/lead-provider'
const CHECK_ANSWERS = '/v27/school/check-answers'

const OPTIONS = {
  a: 'autocomplete',
  b: 'dropdown',
  c: 'radios',
  d: 'list'
}

const inResearch = req => req.session.data['researchMode'] === 'yes'

// Clear everything from the last option, but remember we're in a research session
// so the header link keeps pointing back to the landing page.
const resetSession = req => {
  req.session.data = { researchMode: 'yes' }
}

module.exports = router => {
  router.get(RESEARCH_HOME, (req, res) => {
    res.render('v27/research/index', {
      options: Object.keys(OPTIONS).map(letter => ({
        letter: letter.toUpperCase(),
        href: `${RESEARCH_HOME}/start/${letter}`
      }))
    })
  })

  router.get(`${RESEARCH_HOME}/start/:letter`, (req, res) => {
    const dpVersion = OPTIONS[req.params.letter.toLowerCase()]

    if (!dpVersion) {
      return res.redirect(RESEARCH_HOME)
    }

    resetSession(req)
    res.redirect(`${JOURNEY_START}?dpVersion=${dpVersion}`)
  })

  router.get(`${RESEARCH_HOME}/reset`, (req, res) => {
    resetSession(req)
    res.redirect(RESEARCH_HOME)
  })

  // During research, "Confirm details" ends the option and returns to the options page.
  // Outside research, hand over to the normal v27 route.
  router.post(CHECK_ANSWERS, (req, res, next) => {
    if (!inResearch(req)) {
      return next()
    }

    resetSession(req)
    res.redirect(RESEARCH_HOME)
  })
}