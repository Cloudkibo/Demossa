const config = require('./../../config/index')
const { JWT } = require('google-auth-library')

exports.dialogFlowApiCaller = function (projectId, path, method = 'GET', data) {
  const keys = require(config.GCP_CREDENTIALS_FILE)
  const client = new JWT({
    email: keys.client_email,
    key: keys.private_key,
    scopes: ['https://www.googleapis.com/auth/cloud-platform', 'https://www.googleapis.com/auth/dialogflow']
  })
  let url = `https://dialogflow.googleapis.com/v2/projects/${projectId}/${path}`
  return client.request({
    url,
    method,
    data: JSON.stringify(data)
  })
}
