import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

export default function CardComponent(props) {
  const { dis, id, editHandler, pic, mainHeader, station, date, status } =
    props;

  console.log(status);

  return (
    <Card
      style={{ backgroundColor: status === 'APPROVED' ? '#7FFFD4' : status === "PENDING" ? '#00FFFF'   : status === 'CANCELED' ? '#F08080' : '#D3D3D3' }}
      onClick={() => editHandler(id)}
      sx={{
        display: 'flex',
        width: '350px',
        height: '11rem',
        cursor: 'pointer'
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h5">
            {mainHeader}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
          >
            {dis}
            {status && <div> {status} </div>}
            {station && <div> {station} </div>}
            {date && <div> {date}</div>}
          </Typography>
        </CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}></Box>
      </Box>
    </Card>
  );
}
