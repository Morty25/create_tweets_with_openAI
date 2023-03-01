import { Button, Card, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";

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

export default CardTweet;
