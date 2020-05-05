const all = {
  viewMorePageIds: ['382154169188869'],
  GCP_CREDENTIALS_FILE: process.env.GCP_CREDENTIALS_FILE || '/Users/sojharo/RestructureWork/GCPCredentials/smart-reply-dev-66c9c58c745e.json',
  fbAccessToken: {
    // demossa
    382154169188869: 'EAAUTvApDOEYBAHXldCT12Scr89oRZAsfaz4folqdZCcW4oP1Vt3XIYf2vTwqSZBoYvZB8U0I6GeIazHwP8FaYPWdnnJaR9HfaJWWSY4cymOHCjAMELxhWpZAS9b20texHkPsBjfuzoVmVRMLoCWWL8rreMW4JktrQtmmo33EAYe50ZACgIRLkZB9xk0P7Qj38EZD',
    // demossa2
    350372502408394: 'EAAUTvApDOEYBAACp48icVb1C8jxmAK2Fc6dJOjQupo4QMnB3oXY3SqrXmZA2cHF3It4V9aB81DsZA3vRqbOHGHGzw58I32ZB6gZBqVCPSVYrN67CUOM16ukBCubo5Vlhnzjj9VCV7ZAzRIZBQwKsGHTXzZCrOV3KzW8LmTo35gA8nLXwToubghJXm9GUqNAphIZD',
    // CovidAlert
    113059013658389: 'EAAUTvApDOEYBADtsHRhghU0Oszu1ToK4ge7zFwS5cYZAhdPhXEMZBf6NlsZAtau1FpSXfSWcbY4tAawZAh7fM9PZBAeW1C8N2ZBDfN6Gcaz6HimpDJJrzdPfZCd0V7VwRHapALsN48RziBRCgUYu3JLt95CeqWQHqorI78bZCSZCEScTh2Ofm4evN',
    // Health Alert Me
//    103839534565995: 'EAAUTvApDOEYBAMKMDIsc4QaEMe7kIk8ordg58jsTLqDl632CZBvt0Al9UkY2yZCbZAoBZC9Ab7CLQV1W96uGsgqPrKuIIJpLsCMz55sfgPRDangPZBF05vq8RkX3kBd2bU9A46TO0bBvUySR0FwZC3FNybMQrwlV7gQawj2dOvivSZCpM0oQ0rC',
    // CovidAlertUrdu
//    104316101220333: 'EAAUTvApDOEYBALmqqxAInW6wiWZCa5fJmb6W1vmeE8n8ioTaOdbgJx5uZCua08PrAT46nnHGlldjh70u5twlUXtLqCejmsfUjNXnt5BGnpxYx4jEofZCxte0o1bwnCmykSEeSuZCXVzF8uYTSJA50ZB1ZBvNhabwHFUcAm5hHZBCpkZBDShuN1eZB'

  },
  gcpPojectId: {
    382154169188869: 'demossa-768c0',
    350372502408394: 'demossa2-a9b99',
    113059013658389: 'covidvirus-vtfpal',
//    103839534565995: 'covidvirus-vtfpal',
//    104316101220333: 'covid19viruspk-qkgdtj'
  },
  corsDomains: ['https://kiboengage.cloudkibo.com', 'https://skiboengage.cloudkibo.com', 'http://localhost:3021', 'http://localhost:3000']
}

module.exports = all
