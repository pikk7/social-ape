import React from "react";
import { Grid, withStyles, Typography } from "@material-ui/core";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

const styles = (theme) => ({
  ...theme.spreadThis,
  commentImage: {
    maxWidth: "100%",
    height: 100,
    objectFit: "cover",
    borderRadius: "50%",
  },
  commentData: {
    marginLeft: 20,
  },
});
function Comments(props) {
  const { comments, classes } = props;

  return (
    <Grid container>
      {comments.map((comment, index) => {
        const { body, createdAt, userImage, username } = comment;

        return (
          <Fragment key={createdAt}>
            <Grid item sm={12}>
              <Grid container>
                <Grid item sm={2}>
                  <img
                    src={userImage}
                    alt="comment"
                    className={classes.commentImage}
                  />
                </Grid>

                <Grid item sm={9}>
                  <div className={classes.commentData}>
                    <Typography
                      variant="h5"
                      component={Link}
                      to={`/users/${username}`}
                      color="primary"
                    >
                      {username}
                    </Typography>

                    <Typography variant="body2" color="textSecondary">
                      {dayjs(createdAt).format("h:mm a, YYYY MMMM  DD")}
                    </Typography>
                    <hr className={classes.invisibleSeparator}></hr>
                    <Typography variant="body1">{body}</Typography>
                  </div>
                </Grid>
              </Grid>
            </Grid>
            {index !== comments.length - 1 && (
              <hr className={classes.visibleSeparator}></hr>
            )}
          </Fragment>
        );
      })}
    </Grid>
  );
}

export default withStyles(styles)(Comments);
