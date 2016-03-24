# slack-translator
Slack bot to translate chat messages of any language into specified language ( English for now ). Messages
are posted from the channel the bot listens to the #languagename channel.

The bot replies in English when you message it.

![](http://d.pr/i/1ljMR+)

## Why?

Because I need immeditate translations of messages and its easier to see it in Slack then Google Translate or even going /translate for every message.

## Credits

Initially started by [@roman01la](https://github.com/roman01la/slack-traductor) I made a bunch of changes for our use case.


## Usage

Get Translator Microsoft Translator API account: https://datamarket.azure.com/dataset/bing/microsofttranslator

Create `.env` file and put the following env vars inside:


```
BOT_NAME=bot_name
BOT_TOKEN=bot_token
CLIENT_ID=microsofttranslator_client_id
CLIENT_SECRET=microsofttranslator_client_secret
SUSPEND_TIMEOUT=600000
```

- SUSPEND_TIMEOUT — the time period in ms while the bot will not translate messages

```
$ npm i
$ npm start
```
### Commands

`@translator: stop` — suspend the bot for 10 minutes in current channel/group

### Deployment

We use tutum and link it to the image


