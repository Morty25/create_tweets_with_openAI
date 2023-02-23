import axios from "axios";

const getTweets = async (article: string, caratereMax: number) => {
    const commande = `Peut tu me créer un JSON avec trois tweets différents de ${caratereMax} caractère maximum grace à l'article suivant ?`;
    return await axios({
      method: "POST",
      url: "https://api.openai.com/v1/completions",
      data: {
        model: "text-davinci-003",
        prompt: `${commande} Article: ${article}`,
        temperature: 0.5,
        max_tokens: caratereMax * 3,
        top_p: 1.0,
        frequency_penalty: 0.8,
        presence_penalty: 0.0,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.OPENAI_API_KEY,
      },
    })
};

export const APIOpenAI = {
    getTweets: getTweets,
};

