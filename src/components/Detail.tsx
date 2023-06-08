import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import type {DetailType} from "../types/common";

interface DetailComponentProps {
  detail: DetailType;
  onBackClick: () => void;
}

/**
 * 处理渲染格式
 * @param dateString 
 * @returns 
 */
function formatDate(dateString:string):string {
  const months = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ];

  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = months[date.getMonth()];
  const day = date.getDate();

  return `${month} ${day}, ${year}`;
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
        maxWidth:1200,
        padding: 2,
        marginTop: 2,
        "& .MuiButtonBase-root ":{
          outline:"none"
        }
      }}
    >
      <Button
        startIcon={<ArrowBackIosIcon fontSize="small"  />}
        sx={{ marginBottom: 2, textAlign: "left", color: "white",fontSize:12,opacity:0.8 }}
        onClick={() => {
            onBackClick();
        }}
        variant="text"
      >
        Back To Launches
      </Button>
      <Box
        sx={{
          width: "100%",
          height: {
            xs: 300,
            sm: 300,
            md: 600,
          },
          background:"black",
          marginBottom: 4,
        }}
      >
        {detail?.links?.youtube_id ? (
          <iframe
            style={{ width: "100%", height: "100%",background:"black",border:"none" }}
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
      <Typography  sx={{ marginBottom: 2,opacity:0.6,fontSize:16 }}>{formatDate(detail?.date_utc)}</Typography>
      <Typography variant='h4' sx={{ marginBottom: 6 }}>{detail?.name}</Typography>
      <Typography sx={{ marginBottom: 2,opacity:0.6,fontSize:16 }} align="left">
        {detail?.details}
      </Typography>
    </Box>
  );
};

export default DetailComponent;
