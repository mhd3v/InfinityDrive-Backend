const dbUrl = 'mongodb://localhost:27017/InfinityDrive';

module.exports = {
  odriveCreds: {
    redirectUrl: process.env.REDIRECT_URI || 'http://localhost:4200/Dashboard/Accounts',
    clientID: '399390b3-77f1-4245-ad94-9dfb90272f24',
    clientSecret: 'ghhTASU77-%jxzrQLN005~_',
    responseType: 'code',
    responseMode: 'query',
    scope: ['User.Read', 'Files.ReadWrite.All', 'offline_access'],
  },

  gdriveCreds: {
    client_id: '651431583012-j0k0oent5gsprkdimeup45c44353pb35.apps.googleusercontent.com',
    client_secret: '9aRhiRYg7Va5e5l6Dq-x5VFL',
    redirect_uri: process.env.REDIRECT_URI || 'http://localhost:4200/Dashboard/Accounts',
    scope: ['https://www.googleapis.com/auth/drive'],
  },

  dropboxCreds: {
    clientId: 'zxj96cyp7qvu5fp',
    clientSecret: 'nennum8mk99tvoi',
    redirectUri: process.env.REDIRECT_URI || 'http://localhost:4200/Dashboard/Accounts',
  },

  dbConnectionUrl: process.env.NODE_ENV === 'test' ? `${dbUrl}Test` : process.env.MONGODB_URI || dbUrl,

};
