import React, { useState } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
//MUI stuff
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { useDispatch, useSelector } from "react-redux";
import { submitComment } from "../../redux/actions/dataActions";

const styles = (theme) => ({
  ...theme.spreadThis,
});
function CommentForm(props) {
  const { classes } = props;
  const dispatch = useDispatch();

  const UI = useSelector((state) => state.UI);
  const { authenticated } = useSelector((state) => state.user);

  const [body, setBody] = useState("");
  const errors = UI.errors;

  const handleChange = (event) => {
    setBody(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(submitComment(props.screamId, { body: body }));
    setBody("");
  };

  const commentFormMarkup = authenticated ? (
    <Grid item sm={12} styel={{ textAlign: "center" }}>
      <form onSubmit={handleSubmit}>
        <TextField
          name="body"
          type="text"
          label="Comment on Scream "
          error={errors.comment ? true : false}
          helperText={errors.comment}
          value={body}
          onChange={handleChange}
          fullWidth
          className={classes.textField}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.button}
        >
          Submit
        </Button>
      </form>
      <hr className={classes.visibleSeparator}></hr>
    </Grid>
  ) : null;

  return commentFormMarkup;
}

export default withStyles(styles)(CommentForm);
