import { Paper, Typography, withStyles } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import MuiLink from "@material-ui/core/Link";
import LocationOn from "@material-ui/icons/LocationOn";

import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";
import dayjs from "dayjs";

import PropTypes from "prop-types";

const styles = (theme) => ({
  ...theme.spreadThis,
});

const StaticProfile = (props) => {
  const { classes } = props;
  const { username, createdAt, imageUrl, bio, website, location } =
    props.profile;
  return (
    <Paper className={classes.paper}>
      <div className={classes.profile}>
        <div className="image-wrapper">
          <img src={imageUrl} alt="profile" className="profile-image" />
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
      </div>
    </Paper>
  );
};

StaticProfile.protoType = {
  profile: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StaticProfile);
