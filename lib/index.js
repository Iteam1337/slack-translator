import SlackBot from 'slackbots';
import initialize from './bot_message';

const nconf = require('nconf');

console.log('TRANSLATOR BOT', nconf.get('BOT_NAME'), nconf.get('BOT_TOKEN'));
const translator = new SlackBot({
  token: nconf.get('BOT_TOKEN'),
  name: nconf.get('BOT_NAME')
});

translator.on('start', () => {

  translator.getUser(nconf.get('BOT_NAME'))
    .then(({ id }) => initialize(translator, id))
    .catch((err) => console.error(err, err.stack));
});
