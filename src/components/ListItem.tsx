import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import  { FC } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

interface Props {
  imageURL: string;
  title: string;
  date: string;
  id: string;
  onClick?: () => void;
}

const ListItem: FC<Props> = (props) => {
  return (
    <Card
      onClick={props.onClick}
      sx={{
        margin: 2,
        background: "#000",
        boxShadow: "none",
        minWidth: {
          sx: 400,
          md: 400,
        },
      }}
    >
      <CardActionArea
        sx={{
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        <LazyLoadImage
          alt={props.title}
          height={320}
          width="100%"
          effect="blur"
          style={{
            objectFit:"cover"
          }}
          placeholderSrc={props.imageURL}
          src={props.imageURL || ""}
        />
        <CardContent
          sx={{
            flexDirection: "column",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            marginBottom: 5,
          }}
        >
          <Typography
            sx={{ marginTop: 6, marginBottom: 2 }}
            color="white"
            textAlign={"left"}
            variant="body2"
          >
            {props.date}
          </Typography>
          <Typography
            color="white"
            textAlign={"left"}
            gutterBottom
            variant="h5"
            component="div"
          >
            {props.title}
          </Typography>
          <Button
            variant="outlined"
            color={"inherit"}
            sx={{
              color: "white",
              border: "1px solid white",
              marginTop: 2,
            }}
          >
            learn more
          </Button>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ListItem;
