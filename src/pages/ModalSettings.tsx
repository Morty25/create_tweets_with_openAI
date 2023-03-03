import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Slider,
  Switch,
  Select,
  MenuItem,
} from "@mui/material";

interface IModalSettings {
  state: boolean;
  setState: (state: boolean) => void;
  temperature: number;
  setTemperature: (temperature: number) => void;
  presence_penalty: number;
  setPresence_penalty: (presence_penalty: number) => void;
  frequency_penalty: number;
  setFrequency_penalty: (frequency_penalty: number) => void;
  top_p: number;
  setTop_p: (top_p: number) => void;
  keyApi: string;
  setKeyApi: (keyApi: string) => void;
  paramN: boolean;
  setParamN: (paramN: boolean) => void;
  langue: string;
  setLangue: (langue: string) => void;
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
    top_p,
    setTop_p,
    keyApi,
    setKeyApi,
    paramN,
    setParamN,
    langue,
    setLangue,
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
          Frequency_penalty : {frequency_penalty} <br />
          Top_p : {top_p} <br />n : {paramN ? "Utilisé" : "Non utilisé"}
        </DialogContentText>
      </DialogContent>
      <DialogContent>
        <DialogContentText>
          temperature: nombre compris entre 0 et 1 qui détermine le nombre de
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
        <DialogContentText>
          top_p: Une manière alternative de contrôler l'originalité et la
          créativité du texte généré.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ width: "80%", marginLeft: "10%" }}>
        <Slider
          aria-label="Top_p"
          valueLabelDisplay="auto"
          marks={marks}
          value={top_p}
          onChange={(e, newValue) => {
            if (e && newValue !== top_p) {
              setTop_p(Number(newValue));
            }
          }}
          step={0.1}
          min={0}
          max={1}
        />
      </DialogActions>

      <DialogContent>
        <DialogContentText>
          Utilisé ou non le paramétre de nombre dans la requete: n
        </DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{
          width: "80%",
          marginLeft: "10%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Switch
          checked={paramN}
          onChange={(e) => setParamN(e.target.checked)}
          inputProps={{ "aria-label": "controlled" }}
        />
      </DialogActions>

      <DialogContent>
        <DialogContentText>Forcé une langue de réponse</DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{
          width: "80%",
          marginLeft: "10%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Select
          value={langue}
          label="language"
          onChange={(e) => setLangue(e.target.value)}
        >
          <MenuItem value="none">Utilisé la langue de l'article</MenuItem>
          <MenuItem value="Anglais">Anglais</MenuItem>
          <MenuItem value="Francais">Francais</MenuItem>
        </Select>
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

export default ModalSettings;
