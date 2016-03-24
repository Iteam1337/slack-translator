import TranslatorAPI from './translator_api';

const LANG = 'en';

TranslatorAPI.updateAccess();

function translate (text) {
  return ({ pred, lang }) => {

    return new Promise((resolve, reject) => {

      if (pred === false) {
        TranslatorAPI.requestAPICall(() => {

          TranslatorAPI.translate({ fromLang: lang, toLang: LANG }, text)
            .then((translated) => {
              resolve({lang: lang, text: translated, original: text});
            })
            .catch(reject);
        });
      } else {
        reject(text);
      }
    });
  };
}

export default function translateToEng (text) {
  return new Promise((resolve, reject) => {

    TranslatorAPI.requestAPICall(() => {

      TranslatorAPI.isLang(LANG, text)
        .then(translate(text))
        .then((data) => {
          resolve(data);
        })
        .catch(reject);
    });
  });
}
