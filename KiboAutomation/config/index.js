const all = {
  env: process.env.NODE_ENV || 'development',
  ip: process.env.IP || undefined,
  domain: process.env.DOMAIN,
  port: process.env.PORT || 3050,
  secure_port: process.env.SECURE_PORT || 8443
}

module.exports = all
