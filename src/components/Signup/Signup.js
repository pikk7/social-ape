import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";

import logoImg from "../../img/logo.png";
import { Card, Logo, Error } from "../AuthForm/AuthForm";
import { useAuth } from "../../context/auth";
import Button from "@material-ui/core/Button/";
import {
  FormControl,
  FormGroup,
  FormLabel,
  FormControlLabel,
  FormHelperText,
  Checkbox,
  TextField,
} from "@material-ui/core";

function Signup() {
  const [isSignedup, setIsSignedup] = useState(false);
  const [isError, setIsError] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [email, setEmail] = useState("");
  const [age, setAge] = useState();
  const { setAuthTokens } = useAuth();

  const error =
    [email, userName, password, password2].filter((v) => v).length !== 4;

  const handleChange = () => {
    setConfirmed(!confirmed);
  };

  function postSignup() {
    axios
      .post("/user", {
        Name: userName,
        Password: password,
        Email: email,
      })
      .then((result) => {
        if (result.status === 200) {
          setAuthTokens(result.data);
          setIsSignedup(true);
        } else {
          setIsError(true);
        }
      })
      .catch((e) => {
        setIsError(true);
      });
  }

  if (isSignedup) {
    return <Redirect to="/login" />;
  }
  return (
    <Card>
      <Logo src={logoImg} />

      <FormControl key={"Form1"} fullWidth margin="normal">
        <TextField
          id={1}
          type={"text"}
          label={"Name"}
          variant="outlined"
          value={userName}
          name={"userName"}
          onChange={(e) => {
            setUserName(e.target.value);
          }}
        />
      </FormControl>
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

      <FormControl key={"Form4"} fullWidth margin="normal">
        <TextField
          type="password"
          label={"Password confirm"}
          variant="outlined"
          name={"Password2"}
          value={password2}
          onChange={(e) => {
            setPassword2(e.target.value);
          }}
          placeholder="Password confirm"
        />
      </FormControl>

      <FormControl key={"Form5"} fullWidth margin="normal">
        <TextField
          label={"Age"}
          variant="outlined"
          name={"Age"}
          type="number"
          value={age}
          onChange={(e) => {
            setAge(e.target.value);
          }}
          placeholder="Age"
        />
      </FormControl>

      <FormControl required error={error} component="fieldset">
        <FormLabel component="legend">Confirmed GDPR</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={confirmed}
                onChange={handleChange}
                name="Confirmed"
              />
            }
            label="Confirmed the GDPR"
          />
        </FormGroup>
        <FormHelperText>You haveto fill all field</FormHelperText>
      </FormControl>

      <Button
        disabled={!confirmed || error}
        variant="contained"
        onClick={postSignup}
      >
        Sign up
      </Button>

      <Link to="/login">Already have an account?</Link>
      {isError && <Error>The input data have error!</Error>}
    </Card>
  );
}

export default Signup;
