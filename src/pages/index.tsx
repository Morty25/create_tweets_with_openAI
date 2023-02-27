import Head from "next/head";
import { useState, useEffect } from "react";
import { format } from "date-fns";

import SettingsSuggestOutlinedIcon from "@mui/icons-material/SettingsSuggestOutlined";
import {
  Button,
  Card,
  Stack,
  TextField,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Slider,
} from "@mui/material";
import Textarea from "@mui/joy/Textarea";
import { useTheme } from "@mui/material/styles";

import { APIOpenAI } from "./api/openai";

// engine: OpenAI a mis à disposition quatre moteurs de complétion de texte, nommés davinci, adaet . Nous utilisons , qui est le plus capable des quatre, mais le plus lent et le plus cher si vos besoins vont au-delà du niveau gratuit disponible pour l'API.babbagecuriedavinci
// stop: Le moteur GPT-3 ne "comprend" pas vraiment le texte, donc lorsqu'il génère du texte, il a besoin de savoir quand s'arrêter. Dans l'exemple de la construction d'un chat bot, en donnant un arrêt de "Humain :", nous disons au moteur de générer simplement du texte pour la ligne qui commence par "Bot :". Sans marqueur d'arrêt, GPT-3 continuerait à générer du texte en écrivant plus de lignes pour l'utilisateur et l'IA.
// top_p: Une manière alternative de contrôler l'originalité et la créativité du texte généré.

interface IModalSettings {
  state: boolean;
  setState: (state: boolean) => void;
  temperature: number;
  setTemperature: (temperature: number) => void;
  presence_penalty: number;
  setPresence_penalty: (presence_penalty: number) => void;
  frequency_penalty: number;
  setFrequency_penalty: (frequency_penalty: number) => void;
  keyApi: string;
  setKeyApi: (keyApi: string) => void;
}

const ModalSettings = (props: IModalSettings) => {
  const {
    state,
    setState,
    temperature,
    setTemperature,
    presence_penalty,
    setPresence_penalty,
    frequency_penalty,
    setFrequency_penalty,
    keyApi,
    setKeyApi,
  } = props;

  const marks = [0, 0.2, 0.4, 0.6, 0.8, 1].map((e) => ({
    value: e,
    label: `${e}`,
  }));

  return (
    <Dialog
      open={state}
      onClose={() => setState(false)}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle style={{ cursor: "move" }}>Paramétre</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Temperature : {temperature} <br />
          Presence_penalty : {presence_penalty} <br />
          Frequency_penalty : {frequency_penalty}
        </DialogContentText>
      </DialogContent>
      <DialogContent>
        <DialogContentText>
          temperature : nombre compris entre 0 et 1 qui détermine le nombre de
          risques créatifs pris par le moteur lors de la génération de texte.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ width: "80%", marginLeft: "10%" }}>
        <Slider
          aria-label="Temperature"
          valueLabelDisplay="auto"
          marks={marks}
          value={temperature}
          onChange={(e, newValue) => {
            if (e && newValue !== temperature) {
              setTemperature(Number(newValue));
            }
          }}
          step={0.1}
          min={0}
          max={1}
        />
      </DialogActions>

      <DialogContent>
        <DialogContentText>
          presence_penalty: Un nombre compris entre 0 et 1. Plus cette valeur
          est élevée, plus le modèle fait d'efforts pour parler de nouveaux
          sujets.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ width: "80%", marginLeft: "10%" }}>
        <Slider
          aria-label="Presence_penalty"
          valueLabelDisplay="auto"
          marks={marks}
          value={presence_penalty}
          onChange={(e, newValue) => {
            if (e && newValue !== presence_penalty) {
              setPresence_penalty(Number(newValue));
            }
          }}
          step={0.1}
          min={0}
          max={1}
        />
      </DialogActions>

      <DialogContent>
        <DialogContentText>
          frequency_penalty: Un nombre compris entre 0 et 1. Plus cette valeur
          est élevée, plus le modèle fera d'efforts pour ne pas se répéter.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ width: "80%", marginLeft: "10%" }}>
        <Slider
          aria-label="Frequency_penalty"
          valueLabelDisplay="auto"
          marks={marks}
          value={frequency_penalty}
          onChange={(e, newValue) => {
            if (e && newValue !== frequency_penalty) {
              setFrequency_penalty(Number(newValue));
            }
          }}
          step={0.1}
          min={0}
          max={1}
        />
      </DialogActions>

      <DialogContent>
        <DialogContentText>Insérer ça propre clef OpenAI</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ width: "80%", marginLeft: "10%" }}>
        <TextField
          placeholder="Key API"
          variant="outlined"
          value={keyApi}
          onChange={(e) => {
            setKeyApi(e.target.value);
            localStorage.setItem("OpenAIKey", e.target.value);
          }}
          fullWidth
        />
      </DialogActions>

      <DialogActions>
        <Button onClick={() => setState(false)}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
};
interface ICardTweet {
  tweet: string;
  url: string;
}

const CardTweet = (props: ICardTweet) => {
  const { tweet, url = "" } = props;
  const theme = useTheme();
  const disabledTweet = tweet.length + url.length > 280;
  const urlTwiter = url
    ? `https://twitter.com/intent/tweet?url=${url}&text=${encodeURIComponent(
        tweet
      )}`
    : `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`;
  return (
    <Card
      variant="outlined"
      sx={{
        maxWidth: "400px",
        minWidth: "250px",
        padding: theme.spacing(2),
        margin: theme.spacing(2),
      }}
    >
      <Stack spacing={1}>
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

interface ITweet {
  date: string;
  tweets: string[];
  url: string;
}

const App = () => {
  const theme = useTheme();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [temperature, setTemperature] = useState<number>(0.5);
  const [frequency_penalty, setFrequency_penalty] = useState<number>(0.8);
  const [presence_penalty, setPresence_penalty] = useState<number>(0);
  const [keyApi, setKeyApi] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [urlLie, setUrlLie] = useState<string>("");
  const [article, setArticle] = useState<string>("");
  const caratereMax = urlLie ? 280 : 257;

  useEffect(() => {
    const keyStorage = localStorage.getItem("OpenAIKey");
    if (keyStorage) {
      setKeyApi(keyStorage);
    }
  }, []);

  const getTweet = () => {
    if (article) {
      setLoading(true);
      APIOpenAI.getTweets(
        article,
        caratereMax,
        temperature,
        presence_penalty,
        frequency_penalty,
        keyApi
      )
        .then((res: any) => {
          if (res.status === 200) {
            const jsonTweet = JSON.parse(res.data.choices[0].text);
            if (jsonTweet[0].tweet) {
              const date = new Date();
              setTweets([
                {
                  date: `${format(date, "k")}h : ${format(date, "m")}min`,
                  tweets: jsonTweet.map((j: any) => j.tweet),
                  url: urlLie,
                },
                ...tweets,
              ]);
            }
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
      <Stack alignItems="center" width="100%" spacing={4}>
        <Stack
          padding={theme.spacing(4)}
          justifyContent="space-between"
          alignItems="center"
          direction="row"
          width="100%"
        >
          <Stack width="24px" />
          <Typography variant="h4">
            Création de Tweet via Open AI. (GPT3)
          </Typography>
          <IconButton
            color="primary"
            aria-label="settings"
            onClick={() => setOpenModal(true)}
          >
            <SettingsSuggestOutlinedIcon />
          </IconButton>
        </Stack>

        <Stack
          padding={theme.spacing(4)}
          spacing={2}
          width="60%"
          alignItems="center"
        >
          <Typography variant="h5">
            Générez facilement votre contenu pour Twitter
          </Typography>
          <TextField
            placeholder="Votre URL à lier (optionnel)"
            variant="outlined"
            value={urlLie}
            onChange={(e) => setUrlLie(e.target.value)}
            disabled={loading}
            fullWidth
          />
          <Textarea
            placeholder="Saisissez votre contenu texte (article, script, vidéo...)"
            minRows={3}
            variant="outlined"
            color="neutral"
            value={article}
            onChange={(e) => setArticle(e.target.value)}
            disabled={loading}
            sx={{
              width: "100%",
            }}
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
          <Typography variant="h5">Vos tweets générés</Typography>
          {loading && <Stack>Loading ...</Stack>}
          {tweets.map((t) => (
            <>
              <Typography sx={{ textAlign: "center" }}>
                Généré à {t.date}
              </Typography>
              <Stack
                direction="row"
                justifyContent="space-around"
                width="100%"
                flexWrap="wrap"
              >
                {t.tweets.map((tweet) => (
                  <CardTweet
                    tweet={tweet}
                    url={t.url}
                    key={`${t.date}-${tweet}`}
                  />
                ))}
              </Stack>
            </>
          ))}
        </Stack>

        <ModalSettings
          state={openModal}
          setState={setOpenModal}
          temperature={temperature}
          setTemperature={setTemperature}
          presence_penalty={presence_penalty}
          setPresence_penalty={setPresence_penalty}
          frequency_penalty={frequency_penalty}
          setFrequency_penalty={setFrequency_penalty}
          keyApi={keyApi}
          setKeyApi={setKeyApi}
        />
      </Stack>
    </>
  );
};

export default App;
