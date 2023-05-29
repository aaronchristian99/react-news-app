import React from "react";
import {useRoutes} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Preferences from "./pages/Preferences";
import UserPreferences from "./pages/UserPreferences";
import "./App.css";
import {createTheme} from "@mui/material";
import {ThemeProvider} from "@emotion/react";

// Create a custom theme with overrides
const theme = createTheme({
    palette: {
        primary: {
          main: '#ff2b0f'
        }
    },
});

function App() {
  return (
      <ThemeProvider theme={theme}>
        {useRoutes([
          {
            path: '/',
            children: [
              {
                index: true,
                element: <Home />
              },
              {
                path: '/login',
                element: <Login />
              },
              {
                path: '/register',
                element: <Register />
              },
              {
                path: '/user-preferences',
                element: <UserPreferences />
              },
              {
                path: '/preferences',
                element: <Preferences />
              }
            ]
          }
        ])}
      </ThemeProvider>
  )
}

export default App;
