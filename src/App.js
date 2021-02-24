import React, { useState } from "react";
import "./App.css";

import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "./components/Appbar";
import { AuthContext } from "./context/auth";
import ErrorBoundary from "./components/ErrorBoundary";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";

function App() {
  const [authTokens, setAuthTokens] = useState(
    localStorage.getItem("tokens") || ""
  );
  const theme = createMuiTheme({
    palette: {
      primary: {
        main: "#ed1b2e",
        dark: "#a51220",
        contrastText: "#000",
      },
      secondary: {
        light: "#757ce8",
        main: "#3f50b5",
        dark: "#002884",
        contrastText: "#fff",
      },
    },
  });

  const setTokens = (data) => {
    if (data) {
      // user login
      localStorage.setItem("tokens", JSON.stringify(data));
    } else {
      // user logout
      localStorage.removeItem("tokens");
    }
    setAuthTokens(data);
  };
  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
          <AppBar />
        </ErrorBoundary>
      </MuiThemeProvider>
    </AuthContext.Provider>
  );
}

export default App;
