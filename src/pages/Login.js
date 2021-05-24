import React, { useState } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
// import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import AppIcon from "../images/icon.png";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";

import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/actions/userActions";
const syles = (theme) => ({ ...theme.spreadThis });

function Login(props) {
  const dispatch = useDispatch();

  let UI = useSelector((state) => state.UI);
  const { loading, errors } = UI;
  const { classes } = props;

  const [state, setState] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const userData = {
      email: state.email,
      password: state.password,
    };
    dispatch(loginUser(userData, props.history));
  };

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };
  return (
    <Grid container className={classes.form}>
      <Grid item sm />
      <Grid item sm>
        <img src={AppIcon} alt="Logo" />
        <Typography variant="h2" className={classes.pageTitle}>
          Login
        </Typography>
        <form noValidate onSubmit={handleSubmit}>
          <TextField
            id="email"
            name="email"
            type="email"
            label="E-mail"
            className={classes.textField}
            helperText={errors.email}
            error={errors.email ? true : false}
            value={state.email}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            id="password"
            name="password"
            type="password"
            label="Password"
            className={classes.textField}
            helperText={errors.password}
            error={errors.password ? true : false}
            value={state.password}
            onChange={handleChange}
            fullWidth
          />

          {errors.general && (
            <Typography variant="body2" className={classes.customError}>
              {errors.general}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.button}
            disabled={loading}
          >
            Login
            {loading && (
              <CircularProgress size={30} className={classes.progress} />
            )}
          </Button>
          <br />
          <small>
            Dont have an account? Sign up <Link to="/signup">here</Link>
          </small>
        </form>
      </Grid>
      <Grid item sm />
    </Grid>
  );
}

// Login.propTypes = {
//   classes: PropTypes.object.isRequired,
//   loginUser: PropTypes.func.isRequired,
//   user: PropTypes.func.isRequired,
//   UI: PropTypes.func.isRequired,
// };

// const mapStateToProps = (state) => ({
//   user: state.user,
//   UI: state.UI,
// });

// const mapActionsToProps = {
//   loginUser,
// };

export default withStyles(syles)(Login);
