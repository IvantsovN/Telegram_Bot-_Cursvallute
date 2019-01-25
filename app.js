const TelegramBot = require('node-telegram-bot-api');
const request = require('request');
// replace the value below with the Telegram token you receive from @BotFather
const token = '754577819:AAFV0n7RttFEuaeobtQLlrheqhJeF2aCf1c';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/curse/, (msg, match) => {

  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'Выберите какая валюта вас интересует', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '€ - EUR',
            callback_data: 'EUR'
          }, {
            text: '$ - USD',
            callback_data: 'USD'
          }
        ]
      ]
    }
  });
});

bot.onText(/\/rate_bot/, (msg, match) => {

  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Оцените работу  ', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '5',
            callback_data: '5'
          }, {
            text: ' 4',
            callback_data: '4'
          },
          {
            text: '3',
            callback_data: '3'
          }, {
            text: ' 2',
            callback_data: '2'
          }
        ]
      ]
    }
  });

});

bot.on('callback_query', query => {
  const id = query.message.chat.id;

  if(query.data == "USD" || query.data == "EUR"){
    request('https://www.cbr-xml-daily.ru/daily_json.js', function (error, response, body) {
      const data = JSON.parse(body);
      const date =  new Date().toLocaleDateString();

      let md =`Курс ${query.data} на ${date} - ${data.Valute[query.data].Value}₽`;
      bot.sendMessage(id, md, {parse_mode: 'Markdown'});
    });
  }

  if(query.data == "5" || query.data == "4") {
    bot.sendMessage(id, md);
    bot.sendDocument(id,'https://media.giphy.com/media/bKBM7H63PIykM/giphy.gif');
  }

  if(query.data == "3" || query.data == "2") {
    let md = "Почему ты так жесток ко мне?";
    bot.sendMessage(id, md);
    bot.sendDocument(id,'http://vamotkrytka.ru/_ph/53/2/208533419.gif?1548379640');
  }

})

bot.onText(/\/calc (.+)/, (msg, match) => {

  const chatId = msg.chat.id;
  const resp = +match[1]; // the captured "whatever"
  request('https://www.cbr-xml-daily.ru/daily_json.js', function (error, response, body) {
    const data = JSON.parse(body);

    let md =`${resp}₽   ${Math.round(resp/+data.Valute.USD.Value * 100)/100}$   ${Math.round(resp/+data.Valute.EUR.Value * 100)/100}€`;
    bot.sendMessage(chatId, md);
  })

});

bot.onText(/\/start/, (msg, match) => {
  const chatId = msg.chat.id;
  const name = msg.from.first_name;
  let md = `Привет, ${name}! Меня создал Тамирлан Омаров, чтобы ты в любой момент мог узнать курс ЦБ и перевести родные деревянные в зеленый нал👇👇👇👇👇👇👇👇👇👇👇👇👇👇`;
  bot.sendMessage(chatId, md);
  bot.sendDocument(chatId,'https://media.giphy.com/media/edXbRv1oCC14k/giphy.gif');
});
