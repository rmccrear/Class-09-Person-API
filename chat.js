const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.CHAT_KEY,
});
const openai = new OpenAIApi(configuration);

async function knockKnockJoke(name, topic) {
  const chatCompletion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: `Please tell a pleasant knock knock about ${name} and ${topic}` }],
  });
  console.log(chatCompletion.data.choices[0].message);
  return chatCompletion.data.choices[0].message;
}


module.exports = knockKnockJoke;

// knockKnockJoke("Justin", "Country Music");