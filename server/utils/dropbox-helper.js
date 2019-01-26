var fetch = require('isomorphic-fetch');
var fetch = require('isomorphic-fetch');

const config = {
  fetch: fetch,
  clientId: 'zxj96cyp7qvu5fp',
  clientSecret: 'nennum8mk99tvoi'
};

const Dropbox = require('dropbox').Dropbox;
var dbx = new Dropbox(config);

const redirectUri = `http://localhost:3000/dropbox/saveToken`;

var getAuthorizationUrl = () => {
  return dbx.getAuthenticationUrl(redirectUri, null, 'code')
}

var saveToken = async (req, user) => {

  let code = req.query.code;

  var options = Object.assign({
    code,
    redirectUri
  }, config);

  const token = await dbx.getAccessTokenFromCode(redirectUri, code);

  // requesting dropbox API for account information for current token
  // this holds the user's email address
  const response = await fetch('https://api.dropboxapi.com/2/users/get_current_account', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!(response.status >= 400)) {
    var accountInfo = await response.json();
    return await user.addAccount({ 'access_token': token }, 'dropbox', accountInfo.email);
  }
  else 
    return Promise.reject('Failed to reach dropbox servers!');

}

var getFilesForAccount = async (token) => {
  var dbx = new Dropbox({ accessToken: token.access_token, fetch: fetch });
  return await dbx.filesListFolder({ path: '' })
}

module.exports = { getAuthorizationUrl, saveToken, getFilesForAccount }