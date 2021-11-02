import { BrowserRouter, Switch } from 'react-router-dom';
import { Container, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import axios from 'axios';

import { SignIn } from 'components/Guest';
import Admin from 'components/Admin';
import Standard from 'components/Standard';
import { AdminRoute, GuestRoute, PrivateRoute } from 'components/Common/Routes';
import store from 'store';

axios.defaults.baseURL = 'http://localhost:4000';
if (store.getState().auth.isLoggedIn)
  axios.defaults.headers.common['Authorization'] = `Bearer ${
    store.getState().auth.token
  }`;

const theme = createTheme();

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <CssBaseline />
        <Container
          maxWidth={false}
          disableGutters
          sx={{
            height: '100vh',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <BrowserRouter>
            <Switch>
              <GuestRoute path="/signin" component={SignIn} />
              <AdminRoute path="/admin" component={Admin} />
              <PrivateRoute path="/user" component={Standard} />
            </Switch>
          </BrowserRouter>
        </Container>
      </Provider>
    </ThemeProvider>
  );
};

export default App;
