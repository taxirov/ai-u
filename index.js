require('dotenv').config()

const { Telegraf } = require('telegraf')
const { Configuration, OpenAIApi } = require("openai")

const bot = new Telegraf(process.env.BOT_TOKEN)
const configuration = new Configuration({
    apiKey: process.env.API_KEY_1
  })

const openai = new OpenAIApi(configuration)

async function chatCompletion(content) {
    const res = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: content}]
        })

    return res.data.choices[0].message?.content
}

bot.start((ctx) => {
  ctx.reply('Salom! AI U botiga xush kelibsiz. Sizga qanday yordam berishim mumkin?')
})

bot.on('text', async (msg) => {
  const prompt = msg.message.text;
  if (prompt) {
    try {
      msg.reply('Biroz kuting 🔎')
      const content = await chatCompletion(prompt)
      if (!content) {
        msg.reply("Iltimos qaytadan urinib ko'ring")
      } else {
        msg.reply(content)
      }
    } catch (error) {
      console.error(error);
      msg.reply("Javobni yaratishda xatolik yuz berdi. Iltimos keyinroq qayta urinib ko'ring.");
    }
  }
})

bot.launch();