import request from 'request';

const nconf = require('nconf');
const CLIENT_ID = nconf.get('CLIENT_ID');
const CLIENT_SECRET = nconf.get('CLIENT_SECRET');

console.log('MICROSOFT: client_id & client_secret', CLIENT_ID, CLIENT_SECRET);

let ACCESS_TOKEN;
let isAccessable = false;

let queue = [];

function translate ({ fromLang, toLang }, text) {
  return new Promise((resolve, reject) => {

    request.get(
      {
        url: 'http://api.microsofttranslator.com/V2/Ajax.svc/Translate?text=' + encodeURIComponent(text) + '&to=' + toLang + '&from=' + fromLang,
        auth: { bearer: ACCESS_TOKEN }
      },
      (err, res, body) => err ? reject(err) : resolve(body));
  })
    .then(trimMicrosoft);
}

function isLang (langCode, text) {
  return new Promise((resolve, reject) => {

    request.get(
      {
        url: 'http://api.microsofttranslator.com/V2/Ajax.svc/Detect?text=' + encodeURIComponent(text),
        auth: { bearer: ACCESS_TOKEN }
      },
      (err, res, body) => err ? reject(err) : resolve(body));
  })
    .then(trimMicrosoft)
    .then((code) => ({
      pred: code === langCode,
      lang: code
    }));
}

function requestAPICall (fn) {
  if (isAccessable) { fn(); } else { queue.push(fn); }
}

function dispatchQueue () {
  queue.forEach((fn) => fn());
  queue = [];
}

function updateAccess () {
  getAccessToken(CLIENT_ID, CLIENT_SECRET)
    .then(JSON.parse)
    .then((res) => {
      trackExpiration(res.expires_in);
      return res;
    })
    .then((res) => res.access_token)
    .then((token) => ACCESS_TOKEN = token)
    .then(() => isAccessable = true)
    .then(dispatchQueue)
    .catch(console.error.bind(console));
}

function getAccessToken (client_id, client_secret) {
  return new Promise((resolve, reject) => {

    request.post(
      'https://datamarket.accesscontrol.windows.net/v2/OAuth2-13',
      {
        form: {
          scope: 'http://api.microsofttranslator.com',
          grant_type: 'client_credentials',
        client_id, client_secret}
      },
      (err, res, body) => err ? reject(err) : resolve(body));
  });
}

function trackExpiration (time) {
  setTimeout(() => {

    isAccessable = false;
    updateAccess();
  }, time * 1000);
}

function trimMicrosoft (codeStr) {
  return codeStr.match(/"(.*)"/)[1];
}

export default {
  updateAccess,
  requestAPICall,
  isLang,
translate};
