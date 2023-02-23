import Head from "next/head";
import { Button, Card, Stack, TextField, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";

import { APIOpenAI } from './api/openAI';

/* DOC */
// prompt: Le texte saisi.
// engine: OpenAI a mis à disposition quatre moteurs de complétion de texte, nommés davinci, adaet . Nous utilisons , qui est le plus capable des quatre, mais le plus lent et le plus cher si vos besoins vont au-delà du niveau gratuit disponible pour l'API.babbagecuriedavinci
// stop: Le moteur GPT-3 ne "comprend" pas vraiment le texte, donc lorsqu'il génère du texte, il a besoin de savoir quand s'arrêter. Dans l'exemple de la construction d'un chat bot, en donnant un arrêt de "Humain :", nous disons au moteur de générer simplement du texte pour la ligne qui commence par "Bot :". Sans marqueur d'arrêt, GPT-3 continuerait à générer du texte en écrivant plus de lignes pour l'utilisateur et l'IA.
// temperature: nombre compris entre 0 et 1 qui détermine le nombre de risques créatifs pris par le moteur lors de la génération de texte.
// top_p: Une manière alternative de contrôler l'originalité et la créativité du texte généré.
// frequency_penalty: Un nombre compris entre 0 et 1. Plus cette valeur est élevée, plus le modèle fera d'efforts pour ne pas se répéter.
// presence_penalty: Un nombre compris entre 0 et 1. Plus cette valeur est élevée, plus le modèle fait d'efforts pour parler de nouveaux sujets.
// max_tokens: Longueur de complétion maximale.
/* FIN DOC */

interface ICardTweet {
  tweet: string;
  url: string;
}

const CardTweet = (props: ICardTweet) => {
  const { tweet, url } = props;
  const theme = useTheme();
  const disabledTweet = tweet.length + url.length > 280;
  const urlTwiter = url
    ? `https://twitter.com/intent/tweet?url=${url}&text=${encodeURIComponent(
        tweet
      )}`
    : `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`;
  return (
    <Card
      sx={{
        maxWidth: "400px",
        minWidth: "300px",
        padding: theme.spacing(2),
        margin: theme.spacing(2),
      }}
    >
      <Stack flexDirection="column" spacing={1}>
        <Stack>{tweet}</Stack>
        <Stack>{url}</Stack>
        <a href={urlTwiter} target="_blank" rel="noreferrer">
          <Button
            disabled={disabledTweet}
            variant="outlined"
            sx={{ marginTop: theme.spacing(2) }}
          >
            Tweetez maintenant !
          </Button>
        </a>
      </Stack>
    </Card>
  );
};

const App = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [tweets, setTweets] = useState([]);
  const [urlLie, setUrlLie] = useState("");
  const [article, setArticle] = useState("");
  const caratereMax = 280 - urlLie.length;

  const getTweet = () => {
    if (article) {
      setLoading(true);
      APIOpenAI.getTweets(article, caratereMax).then((res: any) => {
        if (res.status === 200) {
            console.log(res);
          const jsonTweet = JSON.parse(res.data.choices[0].text);
          setTweets(jsonTweet.map((j:any) => j.tweet));
          setLoading(false);
        }
      })
      .catch((e: any) => {
        setLoading(false);
        console.log(e.message, e);
      });
    }
  };

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Stack
        alignItems="center"
        width="100%"
        spacing={4}
      >
        <Stack padding={theme.spacing(4)} sx={{ textAlign: "center" }}>
          Création de Tweet via Open AI. (GPT3)
        </Stack>

        <Stack
          padding={theme.spacing(4)}
          spacing={2}
          width="60%"
          alignItems="center"
        >
          <Typography>Générez facilement votre contenu pour Twitter</Typography>
          <TextField
            placeholder="Votre URL à lier (optionnel)"
            variant="outlined"
            fullWidth
            value={urlLie}
            onChange={(e) => setUrlLie(e.target.value)}
          />
          <TextField
            placeholder="Saisissez votre contenu texte (article, script, vidéo...)"
            variant="outlined"
            fullWidth
            value={article}
            onChange={(e) => setArticle(e.target.value)}
          />
          <Button variant="outlined" onClick={getTweet}>
            Obtenir un tweet
          </Button>
        </Stack>

        <Stack
          padding={theme.spacing(4)}
          width="80%"
          justifyContent="center"
          alignItems="center"
        >
          <Typography>Vos tweets générés</Typography>
          {loading ? (
            <Stack>Loading ...</Stack>
          ) : (
            <Stack
              direction="row"
              justifyContent="space-around"
              width="80%"
              flexWrap="wrap"
            >
              {tweets.map((t) => (
                <CardTweet tweet={t} url={urlLie} key={t} />
              ))}
            </Stack>
          )}
        </Stack>
      </Stack>
    </>
  );
};

export default App;