import Suspender from './suspend_channels';
import translateToEng from './translate_to';
import { getUserName, getChanNameById } from './bot_helpers';
const nconf = require('nconf');

export default function initialize (translator, botId) {
  const SUSPEND_TIMEOUT = nconf.get('SUSPEND_TIMEOUT') || 600000;

  const suspendedChannels = Suspender.getSuspendedChannels();

  translator.on('message', function ({ type, channel, text, user, subtype }) {
    if (text === `<@${botId}>: stop` && !suspendedChannels.has(channel)) {
      return Suspender.suspendChan(channel, SUSPEND_TIMEOUT);
    }

    if (type === 'message' && subtype !== 'message_changed' && !suspendedChannels.has(channel)) {
      const chanId = getChanNameById([...translator.channels, ...translator.groups], channel);
      const uname = getUserName(translator.users, user);
      console.log(chanId, uname);
      // Lets have it for longer messages, short ones help you learn the language :)
      if (text.length > 10) {
        return translateToEng(text)
          .then(replyToUser(uname, chanId))
          .catch();
      }
    }
  });

  function unicodeToChar (text) {
    return text.replace(/\\u[\dA-F]{4}/gi,
      function (match) {
        return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
      });
  }

  function replyToUser (username, channel) {
    return (translated) => {

      return new Promise((resolve, reject) => {

        if (!channel) {
          let textMessage = unicodeToChar(translated.text);
          translator.postMessageToUser(username, textMessage, {as_user: true, link_names: 1, unfurl_links: true, unfurl_media: true, parse: 'full'}, resolve);
        }
        else if (channel.is_group) {
          let textMessage = ['@', username, ' posted this message in ', '#', channel.name, '\n', unicodeToChar(translated.text)].join('');
          translator.postMessageToGroup('english', textMessage, {as_user: true, link_names: 1, unfurl_links: true, unfurl_media: true, parse: 'full'}, resolve);
        } else if (channel.is_channel) {
          let textMessage = ['@', username, ' posted this message in ', '#', channel.name, '\n', unicodeToChar(translated.text)].join('');
          translator.postMessageToChannel('english', textMessage, {as_user: true, link_names: 1, unfurl_links: true, unfurl_media: true, parse: 'full'}, resolve);
        } else {
          reject('Ooops', username, channel, translated);
        }

      });
    };
  }
}
