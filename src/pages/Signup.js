import React, { useState } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import AppIcon from "../images/icon.png";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";
//REDUX
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../redux/actions/userActions";

const syles = (theme) => ({ ...{ theme } });

function Signup(props) {
  const dispatch = useDispatch();
  // const user = useSelector((state) => state.user);

  let UI = useSelector((state) => state.UI);
  const { loading, errors } = UI;
  const { classes } = props;
  const [state, setState] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  });
  // const [errors, setErrors] = useState({
  //   general: null,
  //   email: null,
  //   password: null,
  //   confirmPassword: null,
  //   username: null,
  // });
  // const [loading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    //setLoading(true);
    const newUserData = {
      email: state.email,
      password: state.password,
      confirmPassword: state.confirmPassword,
      username: state.username,
    };
    dispatch(signupUser(newUserData, props.history));
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
        <img src={AppIcon} alt="Logo" className={classes.image} />
        <Typography variant="h2" className={classes.pageTitle}>
          Signup
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

          <TextField
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            className={classes.textField}
            helperText={errors.confirmPassword}
            error={errors.confirmPassword ? true : false}
            value={state.confirmPassword}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            id="username"
            name="username"
            type="text"
            label="User Name"
            className={classes.textField}
            helperText={errors.username}
            error={errors.username ? true : false}
            value={state.username}
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
            Signup
            {loading && (
              <CircularProgress size={30} className={classes.progress} />
            )}
          </Button>
          <br />
          <small>
            Already have an account? Login <Link to="/login">here</Link>
          </small>
        </form>
      </Grid>
      <Grid item sm />
    </Grid>
  );
}

// Signup.propTypes = {
//   classes: PropTypes.object.isRequired,
//   user: PropTypes.object.isRequired,
//   UI: PropTypes.object.isRequired,
//   signupUser: PropTypes.func.isRequired,
// };

export default withStyles(syles)(Signup);
