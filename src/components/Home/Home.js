import React from "react";
import { Button } from "@material-ui/core";
import logoImg from "../../img/logo.png";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { Logo, Card } from "../AuthForm/AuthForm";

export default function Home() {
  const { authTokens } = useAuth();
  return (
    <>
      <Card>
        <h2>Home</h2>
        <Logo src={logoImg} />

        {authTokens ? (
          <h2>Isten hozott a gamefication oldalon</h2>
        ) : (
          <>
            <Button variant="contained" component={Link} to="/login">
              Login
            </Button>
            <br></br>
            <Button variant="contained" component={Link} to="/signup">
              Signup
            </Button>
          </>
        )}
      </Card>
    </>
  );
}
