import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

interface DetailComponentProps {
  detail: {
    links: {
      youtube_id: string;
      patch: {
        large: string;
      };
    };
    name: string;
    date_utc: string;
    details: string;
  };
  onBackClick: () => void;
}

const DetailComponent: React.FC<DetailComponentProps> = ({
  detail,
  onBackClick,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: "100%",
      }}
    >
      <Button
        startIcon={<ArrowBackIosIcon />}
        sx={{ marginBottom: 2, textAlign: "left", color: "white" }}
        onClick={() => {
            onBackClick();
        }}
        variant="text"
      >
        返回
      </Button>
      <Box
        sx={{
          width: "100%",
          height: {
            xs: 300,
            sm: 300,
            md: 500,
          },
          marginBottom: 2,
        }}
      >
        {detail.links.youtube_id ? (
          <iframe
            style={{ width: "100%", height: "100%" }}
            className="video"
            title="Youtube player"
            sandbox="allow-same-origin allow-forms allow-popups allow-scripts allow-presentation"
            src={`https://youtube.com/embed/${detail.links.youtube_id}?autoplay=0`}
          ></iframe>
        ) : (
          <CardMedia
            component="img"
            height="200"
            image={detail?.links?.patch?.large}
            alt="green iguana"
          />
        )}
      </Box>
      <Typography sx={{ marginBottom: 2 }}>{detail?.name}</Typography>
      <Typography sx={{ marginBottom: 2 }}>{detail?.date_utc}</Typography>
      <Typography sx={{ marginBottom: 2 }} align="left">
        {detail?.details}
      </Typography>
    </Box>
  );
};

export default DetailComponent;
