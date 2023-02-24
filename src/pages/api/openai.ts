import axios from "axios";

const getTweets = async (
  article: string,
  caratereMax: number,
  temperature: number,
  presence_penalty: number,
  frequency_penalty: number,
  keyApi?: string
) => {
  const commande = `Créer trois tweets différents grace à l'article suivant, chaque tweet doit avoir un ou deux hastag et ne dois pas dépasser ${caratereMax} caractères ? Votre réponse doit être au format JSON.`;
  const keyUse = keyApi && keyApi.length > 0 ? keyApi : process.env.OPENAI_API_KEY
  return await axios({
    method: "POST",
    url: "https://api.openai.com/v1/completions",
    data: {
      model: "text-davinci-003",
      prompt: `${commande}  article: (${article})`,
      temperature: temperature,
      max_tokens: caratereMax * 3,
      top_p: 1.0,
      frequency_penalty: frequency_penalty,
      presence_penalty: presence_penalty,
    },
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${keyUse}`,
    },
  });
};

export const APIOpenAI = {
  getTweets: getTweets,
};
