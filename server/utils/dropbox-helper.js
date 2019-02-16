const Dropbox = require('dropbox').Dropbox;
const fetch = require('isomorphic-fetch');

const utils = require('./utils');
const { dropboxCreds } = require('../config/config');

var dbx = new Dropbox({ 
  fetch: fetch, 
  clientId: dropboxCreds.clientId, 
  clientSecret: dropboxCreds.clientSecret 
});

var getAuthorizationUrl = () => {
  return dbx.getAuthenticationUrl(dropboxCreds.redirectUri, null, 'code')
}

var saveToken = async (req, user) => {
  try {
    let code = req.body.code;
    const token = await dbx.getAccessTokenFromCode(dropboxCreds.redirectUri, code);
    const userInfo = await getUserInfo(token);
    const accounts = await user.addAccount({ 'access_token': token }, 'dropbox', userInfo.email);
    return accounts;
  } catch (e) {
    console.log(e);
    throw e;
  }

}

var getFilesForAccount = async (token) => {
  var dbx = new Dropbox({ accessToken: token.access_token, fetch: fetch });
  return utils.standarizeFileData(await dbx.filesListFolder({ path: '' },), 'dropbox');
}

var getUserInfo = async (token) => {
  var dbx = new Dropbox({ accessToken: token, fetch: fetch });
  const info = await dbx.usersGetCurrentAccount().catch((e) => {
    console.log(e);
    throw 'Error getting user info from Dropbox';
  });
  return info;
}

var getStorageInfo = async (token) => {
  var dbx = new Dropbox({ accessToken: token.access_token, fetch: fetch });
  const info = await dbx.usersGetSpaceUsage().catch((e) => {
    console.log(e);
    throw 'Error getting storage info from Dropbox';
  });
  return info;
}

var getDownloadUrl = async (token, fileId) => {
  var dbx = new Dropbox({ accessToken: token.access_token, fetch: fetch });
  const response = await dbx.filesGetTemporaryLink({ path: fileId }).catch((e) => {
    console.log(e);
    throw 'Unable to get file from Dropbox';
  });
  return response.link;
}

var deleteItem = async (token, itemId) => {
  var dbx = new Dropbox({ accessToken: token.access_token, fetch: fetch });
  await dbx.filesDelete({ path: itemId }).catch((e) => {
    console.log(e);
    throw 'Unable to delete file from Dropbox';
  });
}

module.exports = { 
  getAuthorizationUrl, 
  saveToken, 
  getFilesForAccount, 
  getDownloadUrl, 
  getStorageInfo, 
  deleteItem 
}