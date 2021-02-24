import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import logoImg from "../../img/logo.png";
import { Card, Logo, Error } from "../AuthForm/AuthForm";
import { useAuth } from "../../context/auth";
import { FormControl, TextField, Button } from "@material-ui/core"; //import { useJwt } from "react-jwt";

function Login(props) {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setAuthTokens } = useAuth();
  // const token = useContext(AuthContext);
  // const { decodedToken, isExpired } = useJwt(token["authTokens"]);
  const referer = props.location.state ? props.location.state.referer : "/";

  async function postLogin() {
    axios
      .post("/login", {
        Email: email,
        Password: password,
      })
      .then((result) => {
        if (result.status === 200) {
          setAuthTokens(result.data);
          // console.log(result.data);
          setLoggedIn(true);
        } else {
          setIsError(true);
        }
      })
      .catch((e) => {
        setIsError(true);
        // console.log(e);
      });
  }

  if (isLoggedIn) {
    return <Redirect to={referer} />;
  }

  return (
    <Card>
      <Logo src={logoImg} />

      <FormControl key={"Form2"} fullWidth margin="normal">
        <TextField
          id={2}
          label={"E-mail"}
          variant="outlined"
          name={"Email"}
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          placeholder="email"
        />
      </FormControl>
      <FormControl key={"Form3"} fullWidth margin="normal">
        <TextField
          type="password"
          label={"Password"}
          variant="outlined"
          name={"Password"}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          placeholder="Password"
        />
      </FormControl>
      <Button variant="contained" onClick={postLogin}>
        Login
      </Button>

      <Link to="/signup">Don't have an account?</Link>
      {isError && (
        <Error>The username or password provided were incorrect!</Error>
      )}
    </Card>
  );
}

export default Login;
