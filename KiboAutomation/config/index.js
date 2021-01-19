const all = {
  env: process.env.NODE_ENV || 'development',
  ip: process.env.IP || undefined,
  domain: process.env.DOMAIN,
  port: process.env.PORT || 3050,
  secure_port: process.env.SECURE_PORT || 8443,
  papertrail_log_levels: process.env.PAPERTRAIL_LOG_LEVELS || '',
  GCP_CREDENTIALS_FILE: process.env.GCP_CREDENTIALS_FILE || '/Users/cloudkibo/Desktop/GCPCredential/smart-reply-dev-66c9c58c745e',
  ECOMMERCE_PROJECT_ID: process.env.ECOMMERCE_PROJECT_ID || 'ecommercechatbot-sfst'
}

module.exports = all
