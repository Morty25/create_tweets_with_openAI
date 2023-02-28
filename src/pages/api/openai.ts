import axios from "axios";
// engine: OpenAI a mis à disposition quatre moteurs de complétion de texte, nommés davinci, adaet . Nous utilisons , qui est le plus capable des quatre, mais le plus lent et le plus cher si vos besoins vont au-delà du niveau gratuit disponible pour l'API.babbagecuriedavinci
// stop: Le moteur GPT-3 ne "comprend" pas vraiment le texte, donc lorsqu'il génère du texte, il a besoin de savoir quand s'arrêter. Dans l'exemple de la construction d'un chat bot, en donnant un arrêt de "Humain :", nous disons au moteur de générer simplement du texte pour la ligne qui commence par "Bot :". Sans marqueur d'arrêt, GPT-3 continuerait à générer du texte en écrivant plus de lignes pour l'utilisateur et l'IA.

const getTweets = async (
  article: string,
  caratereMax: number,
  temperature: number,
  presence_penalty: number,
  frequency_penalty: number,
  top_p: number,
  keyApi?: string,
  langue?: string
) => {
  const commande = `Créer trois tweets différents grace à l'article suivant, votre réponse doit être au format JSON et respecter les contraites`;
  const contraites = [
        '- Chaque tweet doit contenir un hastag au minimum',
        `- Chaque tweet ne dois pas dépasser ${caratereMax} caractères`,
        '- Les tweets ne doivent pas étre numéroté dans le JSON',
        langue === 'none' ? "- Utiliser la langue de l'article" : `- La langue a utilisé : ${langue}`,
    ];
  const keyUse =
    keyApi && keyApi.length > 0 ? keyApi : process.env.OPENAI_API_KEY;
  return await axios({
    method: "POST",
    url: "https://api.openai.com/v1/completions",
    data: {
      model: "text-davinci-003",
      prompt: `${commande} contraites: (${contraites.join(' ')})  article: (${article})`,
      temperature: temperature,
        max_tokens: Math.round(caratereMax * 3), // Max Token volontairement haut pour éviter que le JSON ne soit coupé
      top_p: top_p,
      frequency_penalty: frequency_penalty,
      presence_penalty: presence_penalty,
    },
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${keyUse}`,
    },
  });
};

const getTweetsWithN = async (
    article: string,
    caratereMax: number,
    temperature: number,
    presence_penalty: number,
    frequency_penalty: number,
    top_p: number,
    keyApi?: string,
    langue?: string
  ) => {
    const commande = `Créer un tweet grace à l'article suivant et respecter les contraites`;
    const contraites = [
        '- Chaque tweet doit contenir un hastag au minimum',
        `- Chaque tweet ne dois pas dépasser ${caratereMax} caractères`,
        langue === 'none' ? "- Utiliser la langue de l'article" : `- La langue a utilisé : ${langue}`,
    ];
    const keyUse =
      keyApi && keyApi.length > 0 ? keyApi : process.env.OPENAI_API_KEY;
    const nbrTweet = 3;
    return await axios({
      method: "POST",
      url: "https://api.openai.com/v1/completions",
      data: {
        model: "text-davinci-003",
        prompt: `${commande} contraites: (${contraites.join(' ')})  article: (${article})`,
        temperature: temperature,
        max_tokens: Math.round(caratereMax), // Max Token volontairement haut pour éviter que le tweet ne soit coupé
        top_p: top_p,
        n: nbrTweet,
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
  getTweetsWithN: getTweetsWithN
};
