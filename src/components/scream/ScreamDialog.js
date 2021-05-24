import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  Dialog,
  DialogContent,
  withStyles,
  Grid,
  Typography,
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import ChatIcon from "@material-ui/icons/Chat";
import Comments from "./Comments";
import CloseIcon from "@material-ui/icons/Close";
import { getScream, clearErrors } from "../../redux/actions/dataActions";
import { useSelector, useDispatch } from "react-redux";
import MyButton from "../../util/MyButton";
import { UnfoldMore } from "@material-ui/icons";
import LikeButton from "./LikeButton";
import CommentForm from "./CommentForm";

const styles = (theme) => ({
  ...theme.spreadThis,
  profileImage: {
    maxWidth: 200,
    height: 200,
    borderRadius: "50%",
    objectFit: "cover",
  },
  dialogContent: {
    padding: 20,
  },
  closeButton: {
    position: "absolute",
    left: "90%",
  },
  expandButton: {
    position: "absolute",
    left: "90%",
  },
  spinnerDiv: {
    textAlign: "center",
    marginTop: 50,
    marginBottom: 50,
  },
});
const Link = require("react-router-dom").Link;

function ScreamDialog(props) {
  const UI = useSelector((state) => state.UI);

  const { body, createdAt, likeCount, commentCount, userImage, comments } =
    useSelector((state) => state.data.scream);
  const { loading } = UI;
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [oldPath, setOldPath] = useState("");
  const { classes, screamId, username } = props;

  const handleOpen = () => {
    setOldPath(window.location.pathname);

    window.history.pushState(
      null,
      null,
      `/users/${username}/scream/${screamId}`
    );
    setOpen(true);
    dispatch(getScream(screamId));
  };

  useEffect(() => {
    if (props.openDialog) {
      handleOpen();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    console.log("1" + oldPath + " 2" + window.location.pathname);
    if (oldPath === window.location.pathname) {
      console.log("sajt");
      window.history.pushState(null, null, `/users/${username}`);
    } else {
      window.history.pushState(null, null, oldPath);
    }
    setOpen(false);
    dispatch(clearErrors());
  };
  const dialogMarkup = loading ? (
    <div className={classes.spinnerDiv}>
      <CircularProgress size={200} thickness={2} />
    </div>
  ) : (
    <Grid container>
      <Grid item sm={5}>
        <img src={userImage} alt="Profile" className={classes.profileImage} />
      </Grid>

      <Grid item sm={7}>
        <Typography
          component={Link}
          color="primary"
          variant="h5"
          to={`/users/${username}`}
        >
          @{username}
        </Typography>
        <hr className={classes.invisibleSeparator} />
        <Typography variant="body2" color="textSecondary">
          {dayjs(createdAt).format("YYYY MMMM DD, h:mm a")}
        </Typography>
        <hr className={classes.invisibleSeparator} />
        <Typography variant="body1">{body}</Typography>
        <LikeButton screamId={screamId} />
        <span>{likeCount} likes</span>
        <MyButton tip="comments">
          <ChatIcon color="primary"></ChatIcon>
        </MyButton>
        <span>{commentCount} comments</span>
      </Grid>
      <hr className={classes.visibleSeparator} />
      <CommentForm screamId={screamId} />
      <Comments comments={comments} />
    </Grid>
  );

  return (
    <>
      <MyButton
        onClick={handleOpen}
        tip="Expand scream"
        tipClassName={classes.expandButton}
      >
        <UnfoldMore color="primary"></UnfoldMore>
      </MyButton>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <MyButton
          tip="Close"
          onClick={handleClose}
          tipClassName={classes.closeButton}
        >
          <CloseIcon />
        </MyButton>
        <DialogContent className={classes.DialogContent}>
          {dialogMarkup}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default withStyles(styles)(ScreamDialog);
