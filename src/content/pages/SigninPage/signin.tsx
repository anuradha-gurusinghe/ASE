import {
  Box,
  Card,
  Typography,
  Container,
  Divider,
  Button,
  FormControl,
  OutlinedInput,
  InputAdornment,
  TextField,
  Alert,
  Input,
  CircularProgress
} from '@mui/material';
import InputComponent from 'src/components/InputComponent';

import { Helmet } from 'react-helmet-async';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { AuthService, UserLoginData } from 'src/services/AuthService';
import { Label } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { auth, provider, signInWithPopup } from 'src/firebase/firebase';

const MainContent = styled(Box)(
  ({ theme }) => `
      height: 100%;
      display: flex;
      flex: 1;
      overflow: auto;
      flex-direction: column;
      align-items: center;
      justify-content: center;
  `
);

const OutlinedInputWrapper = styled(OutlinedInput)(
  ({ theme }) => `
      background-color: ${theme.colors.alpha.white[100]};
  `
);

const ButtonSearch = styled(Button)(
  ({ theme }) => `
      margin-right: -${theme.spacing(1)};
  `
);

function Signin() {
  //
  const [user, setUser] = useState<any>('');
  const [isLoading, setIsLoading] = useState<any>('');
  const [email, setEmail] = useState('');
  const [pasword, setPassword] = useState('');
  const [error, setError] = useState<string | undefined>();
  let navigate = useNavigate();

  const handleAuth = async () => {
    setIsLoading(true);

    setTimeout(async () => {
      if (email !== 'admin@gmail.com' || pasword !== 'admin@1234') {
        setError('Invalid email or password');
        setIsLoading(false);
        return;
      }

      localStorage.setItem(
        'token',
        'JWT abb@aan122annamszahdgowpwm384@@msmmsyfiofnfnfnskksksn,,,wwiprl##jka'
      );
      navigate('/management/all-stations');
      setIsLoading(false);
    }, 3000);
  };
  //

  return (
    <>
      <Helmet>
        <title>SignIn to ADMIN Panal</title>
      </Helmet>
      <MainContent>
        <Container maxWidth="md">
          <Box textAlign="center">
            <img alt="404" height={180} src="/static/images/status/theme.svg" />
            <Typography variant="h2" sx={{ my: 2 }}>
              FuelIn Admin Application
            </Typography>
          </Box>
          <Container maxWidth="sm">
            <Card sx={{ textAlign: 'center', mt: 3, p: 4 }}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  return false;
                }}
              >
                <InputComponent
                  label="Email"
                  value={email}
                  setValue={setEmail}
                />
                <InputComponent
                  type="password"
                  label="Password"
                  value={pasword}
                  setValue={setPassword}
                />

                {error ? <Alert color="error">{error}</Alert> : null}

                <Divider sx={{ my: 4 }}></Divider>
                <Button onClick={handleAuth} type="submit" variant="outlined">
                  {isLoading ? <CircularProgress></CircularProgress> : 'Login'}
                </Button>
              </form>
            </Card>
          </Container>
        </Container>
      </MainContent>
    </>
  );
}

export default Signin;
