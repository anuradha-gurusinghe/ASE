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
  Input
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { AuthService, UserLoginData } from 'src/services/AuthService';
import { Label } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  let navigate = useNavigate();
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required('Please Enter Your Email')
        .email('Email is invalid'),
      password: Yup.string().required('Please Enter Your Password')
    }),
    onSubmit: (values) => {
      console.log('Signing in');
      const loginData = {
        ...values,
        medium: 'EMAIL'
      };

      logInUser(loginData);
    }
  });

  const logInUser = async (values: UserLoginData) => {
    setIsLoading(true);

    try {
      const response = await AuthService.userLogin(values);
      setIsLoading(false);
      if (response.success && response.data.role === 'SUPER_ADMIN') {
        navigate('/dashboards');
        console.log('sucess!!!!!!!!!!!');
      } else if (!response.success) {
        if (typeof response.error == 'string') {
          setError(response.error);
        } else {
          setError('Connection Error!');
        }
      } else {
        setError('Not Authorized');
      }
    } catch (error) {
      setIsLoading(false);
      setError('Connection Error!');
    }
  };
  useEffect(() => {
    console.log(error);
  }, [error]);
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
              The Budgetee Application- ADMIN Panel
            </Typography>
            <Typography
              variant="h4"
              color="text.secondary"
              fontWeight="normal"
              sx={{ mb: 4 }}
            >
              Just handle your Budget simply!
            </Typography>
          </Box>
          <Container maxWidth="sm">
            <Card sx={{ textAlign: 'center', mt: 3, p: 4 }}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                {error ? <Alert color="error">{error}</Alert> : null}
                <FormControl variant="outlined" fullWidth>
                  <div>
                    <p className="form-label">{'Email'}</p>
                    <Input
                      name="email"
                      className="form-control"
                      placeholder={'Enter email'}
                      type="email"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.email || ''}
                    />
                    {validation.touched.email && validation.errors.email ? (
                      <p className="text-danger">{validation.errors.email}</p>
                    ) : null}
                  </div>
                </FormControl>
                <FormControl variant="outlined" fullWidth>
                  <div>
                    <p className="form-label">{'Password'}</p>
                    <Input
                      name="password"
                      value={validation.values.password || ''}
                      type="password"
                      placeholder={'Enter Password'}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                    />
                    {validation.touched.password &&
                    validation.errors.password ? (
                      <p style={{ color: 'red' }}>
                        {validation.errors.password}
                      </p>
                    ) : null}
                  </div>
                </FormControl>
                <Divider sx={{ my: 4 }}></Divider>
                <Button type="submit" variant="outlined">
                  Login
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
