import React, { useState } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { deletScream } from "../../redux/actions/dataActions";
import { useDispatch } from "react-redux";
import MyButton from "../../util/MyButton";
import Button from "@material-ui/core/Button";
import DeleteOutline from "@material-ui/icons/DeleteOutlined";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";

const styles = {
  deleteButton: {
    position: "absolute",
    left: "90%",
    top: "10%",
  },
};

function DeleteScream(props) {
  const [open, setOpen] = useState(false);
  const { classes, screamId } = props;
  const dispatch = useDispatch();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteScreamFunction = () => {
    dispatch(deletScream(screamId));
  };
  return (
    <>
      <MyButton
        tip="Delete Scream"
        onClick={handleOpen}
        btnClassName={classes.deleteButton}
      >
        <DeleteOutline color="secondary"></DeleteOutline>
      </MyButton>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Are you sure you want delete this scream?</DialogTitle>
        <DialogContent>This can't be reverse</DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteScreamFunction} color="secondary">
            Delete Scream
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default withStyles(styles)(DeleteScream);
