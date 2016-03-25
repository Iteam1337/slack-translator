import TranslatorAPI from './translator_api';

const nconf = require('nconf');
const DEFAULT_TO_LANG = nconf.get('DEFAULT_FROM_LANG') || 'en';
const DEFAULT_FROM_LANG = nconf.get('DEFAULT_TO_LANG') || 'sv';

TranslatorAPI.updateAccess();

function translate (text) {
  return ({ pred, lang }) => {

    return new Promise((resolve, reject) => {

      if (lang !== DEFAULT_TO_LANG) {
        TranslatorAPI.requestAPICall(() => {
          TranslatorAPI.translate({ fromLang: lang, toLang: DEFAULT_TO_LANG }, text)
            .then((translated) => {
              resolve({lang: lang, text: translated, original: text});
            })
            .catch(reject);
        });
      } else {
        TranslatorAPI.requestAPICall(() => {
          TranslatorAPI.translate({ fromLang: lang, toLang: DEFAULT_FROM_LANG }, text)
            .then((translated) => {
              resolve({lang: lang, text: translated, original: text});
            })
            .catch(reject);
        });
      }
    });
  };
}

export default function translateToEng (text) {
  return new Promise((resolve, reject) => {

    TranslatorAPI.requestAPICall(() => {

      TranslatorAPI.isLang(DEFAULT_TO_LANG, text)
        .then(translate(text))
        .then((data) => {
          resolve(data);
        })
        .catch(reject);
    });
  });
}
