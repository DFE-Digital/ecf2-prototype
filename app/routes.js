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
require('./routes/v8')(router)
require('./routes/v9')(router)
require('./routes/v10')(router)
require('./routes/v11')(router)
require('./routes/v12')(router)
require('./routes/v13')(router)
require('./routes/v14')(router)
require('./routes/v15')(router)
require('./routes/v16')(router)
require('./routes/v17')(router)
require('./routes/v18')(router)
require('./routes/v19')(router)