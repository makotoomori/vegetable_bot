const airtable = require('airtable');
const defaultConfig = {
  END_POINTT_URL: process.env.END_POINTT_URL,
  API_KEY: process.env.AT_API_KEY,
  BASE_ID: process.env.AT_BASE_ID
}

process.env.END_POINTT_URL

module.exports = {
  createClient (config = defaultConfig) {
    airtable.configure({
      endpointUrl:config.END_POINTT_URL,
      apiKey:config.API_KEY
    })
    return airtable.base(config.BASE_ID);
  }
}
