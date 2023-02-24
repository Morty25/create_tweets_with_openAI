import axios from "axios";

const getTweets = async (
  article: string,
  caratereMax: number,
  temperature: number,
  presence_penalty: number,
  frequency_penalty: number
) => {
  const commande = `Peut tu me créer un JSON avec trois tweets différents grace à l'article suivant ? (Ne pas numéroter les tweets, un tweet doit avoir un ou deux hastag, un tweet ne dois pas dépasser ${caratereMax} caractères)`;
  return await axios({
    method: "POST",
    url: "https://api.openai.com/v1/completions",
    data: {
      model: "text-davinci-003",
      prompt: `${commande} Article: ${article}`,
      temperature: temperature,
      max_tokens: caratereMax * 3,
      top_p: 1.0,
      frequency_penalty: frequency_penalty,
      presence_penalty: presence_penalty,
    },
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.OPENAI_API_KEY,
    },
  });
};

export const APIOpenAI = {
  getTweets: getTweets,
};
