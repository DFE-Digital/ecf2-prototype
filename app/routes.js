//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here
require('./routes/v1')(router)
require('./routes/v2')(router)
require('./routes/v3')(router)
require('./routes/v4')(router)
require('./routes/v5')(router)
require('./routes/v6')(router)
require('./routes/v7')(router)