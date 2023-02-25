import { useContext, useEffect, useState } from 'react';
import UserContext from './context/UserContext';
import { environment } from './environment/environment';
import { RequestState } from './RequestState';
import { AuthService } from './services/AuthService';

export function Auth({ children }) {
  const [token, setToken] = useState<string>();
  const [userRequestState, setUserRequestState] = useState<RequestState>(
    RequestState.INITIAL
  );
  const [user, setUser] = useState(undefined);

  if (!token) {
    const token = AuthService.getToken();

    if (token) {
      setToken(token);
    } else {
      location.href = environment.app_url + '/sign-in';
      // location.href = environment.app_url + "/signin";
    }
  }

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/signin';
  };

  useEffect(() => {
    if (token && !user && userRequestState === RequestState.INITIAL) {
      setUserRequestState(RequestState.LOADING);
      AuthService.getMe()
        .then((res) => {
          console.log(res.data);
          setUserRequestState(RequestState.SUCCESS);
          setUser(res.data);
        })
        .catch(() => {
          setUserRequestState(RequestState.FAILED);
        });
    }
  }, [token]);

  switch (userRequestState) {
    case RequestState.FAILED:
      logout();
      return <br />;
    case RequestState.SUCCESS:
      return (
        <div>
          <UserContext.Provider value={[user, setUser]}>
            {children}
          </UserContext.Provider>
        </div>
      );
    default:
      return (
        <div className="pre-loader min-h-screen ">
          {/* <img className="h14 w14 m-auto mt-72 block " src={logo} /> */}
        </div>
      );
  }
}
