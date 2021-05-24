import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  withStyles,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import MyButton from "../../util/MyButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import { postScream } from "../../redux/actions/dataActions";
import { CLEAR_ERRORS } from "../../redux/types";

const styles = (theme) => ({
  ...theme.speadThis,
  submitButton: { position: "relative", float: "right", marginTop: 10 },
  progressSpinner: { position: "absolute" },
  closeButton: { position: "absolute", left: "91%", top: "6%" },
});

const PostScream = (props) => {
  const { classes } = props;
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const UI = useSelector((state) => state.UI);
  const loading = UI.loading;
  const errors = UI.errors;

  useEffect(() => {
    dispatch({ type: CLEAR_ERRORS });
    setBody("");
  }, [open, dispatch]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // dispatch({ type: CLEAR_ERRORS });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(postScream({ body }));
    setBody("");
  };

  const handleChange = (event) => {
    setBody(event.target.value);
  };
  return (
    <>
      <MyButton onClick={handleOpen} tip="Post a Scream!">
        <AddIcon />
      </MyButton>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <MyButton
          tip="Close"
          onClick={handleClose}
          tipClassName={classes.closeButton}
        >
          <CloseIcon />
        </MyButton>
        <DialogTitle>Post a new scream</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              name="body"
              type="text"
              label="SCREAM!!!"
              multiline
              rows="3"
              placeholder="Scream at your fellow friends"
              error={errors.error ? true : false}
              helperText={errors.error}
              className={classes.textField}
              onChange={handleChange}
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submitButton}
              disabled={loading}
            >
              Submit
              {loading && (
                <CircularProgress
                  size={30}
                  className={classes.progressSpinner}
                />
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default withStyles(styles)(PostScream);
