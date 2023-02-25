import { Typography, Avatar, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useContext } from 'react';
import UserContext from 'src/context/UserContext';

function PageHeader() {
  const theme = useTheme();
  const [user, setUser] = useContext(UserContext);
  console.log(user);
  return (
    <Grid container alignItems="center">
      <Grid item></Grid>
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          WELCOME TO FUELIN,
        </Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
