import React from "react";
// import PropeTypes from "prop-types";
import { Button, Paper, Typography, withStyles } from "@material-ui/core";
import EditDetails from "./EditDetails";
import EditIcon from "@material-ui/icons/Edit";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import MuiLink from "@material-ui/core/Link";
import LocationOn from "@material-ui/icons/LocationOn";

import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";
import dayjs from "dayjs";
import { logoutUser, uploadImage } from "../../redux/actions/userActions";
import { KeyboardReturn } from "@material-ui/icons";
import MyButton from "../../util/MyButton";
import ProfileSkeleton from "../../util/ProfileSkeleton";

const styles = (theme) => ({
  ...theme.spreadThis,
});

function Profile(props) {
  const { classes } = props;
  const dispatch = useDispatch();

  const handleImageChange = (event) => {
    const image = event.target.files[0];
    //send to the server
    const formData = new FormData();
    formData.append("image", image, image.name);
    dispatch(uploadImage(formData));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleEditPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput.click();
  };
  const {
    credentials: { username, createdAt, imageUrl, bio, website, location },
    loading,
    authenticated,
  } = useSelector((state) => state.user);

  let profileMarkup = !loading ? (
    authenticated ? (
      <Paper className={classes.paper}>
        <div className={classes.profile}>
          <div className="image-wrapper">
            <img src={imageUrl} alt="profile" className="profile-image" />
            <input
              hidden="hidden"
              type="file"
              id="imageInput"
              onChange={handleImageChange}
            />
            <MyButton
              tip="Edit profile picture"
              onClick={handleEditPicture}
              btnClassName="button"
            >
              <EditIcon color="primary" />
            </MyButton>
          </div>
          <hr />
          <div className="profile-details">
            <MuiLink
              component={Link}
              to={`/users/${username}`}
              color="primary"
              variant="h5"
            >
              @{username}
            </MuiLink>
            <hr></hr>
            {bio && <Typography variant="body2">{bio}</Typography>}
            <hr></hr>
            {location && (
              <>
                <LocationOn color="primary" />
                <span>{location}</span>
                <hr></hr>
              </>
            )}
            {website && (
              <>
                <LinkIcon color="primary" />
                <a href={website} target="_blank" rel="noopener noreferrer">
                  {website}
                </a>

                <hr></hr>
              </>
            )}
            <CalendarToday color="primary" />{" "}
            <span>Joined {dayjs(createdAt).format("YYYY MMM")}</span>
          </div>

          <MyButton tip="Logout" onClick={handleLogout}>
            <KeyboardReturn color="primary" />
          </MyButton>

          <EditDetails />
        </div>
      </Paper>
    ) : (
      <Paper className={classes.paper}>
        <Typography variant="body2" align="center">
          No profile found, please login again
        </Typography>

        <div className={classes.buttons}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/login"
          >
            Login
          </Button>
          <Button
            variant="contained"
            color="secondary"
            component={Link}
            to="/signup"
          >
            Signup
          </Button>
        </div>
      </Paper>
    )
  ) : (
    <ProfileSkeleton />
  );

  return profileMarkup;
}

export default withStyles(styles)(Profile);
