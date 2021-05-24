import { Grid, withStyles } from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import StaticProfile from "../components/profile/StaticProfile";
import Scream from "../components/scream/Scream";
import { getUserData } from "../redux/actions/dataActions";
import ProfileSkeleton from "../util/ProfileSkeleton";
import ScreamSkeleton from "../util/ScreamSkeleton";

const styles = (theme) => ({
  ...theme.spreadThis,
});

function User(props) {
  const [profile, setProfile] = useState(null);
  const dispatch = useDispatch();
  const data = useSelector((state) => state.data);
  // eslint-disable-next-line no-unused-vars
  const [screamIdParam, setScreamIdParam] = useState(
    props.match.params.screamId
  );

  const { screams, loading } = data;
  const username = props.match.params.username;
  //setScreamIdParam(props.match.params.screamId);
  useEffect(() => {
    // if (props.match.params.scremId) {
    //   setScreamIdParam(props.match.params.screamId);
    // }
    dispatch(getUserData(username));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    axios
      .get(`/user/${username}`)
      .then((res) => {
        setProfile(res.data.user);
      })
      .catch((err) => console.log(err));
  }, [dispatch, username]);
  const screamsMarkup = loading ? (
    <ScreamSkeleton />
  ) : screams === null ? (
    <p>No screams from this user</p>
  ) : !screamIdParam ? (
    screams.map((scream) => <Scream key={scream.screamId} scream={scream} />)
  ) : (
    screams.map((scream) => {
      if (scream.screamId !== screamIdParam) {
        return <Scream key={scream.screamId} scream={scream} />;
      } else {
        return (
          <Scream key={scream.screamId} scream={scream} openDialog={true} />
        );
      }
    })
  );
  return (
    <Grid container spacing={2}>
      <Grid item sm={8} xs={12}>
        {screamsMarkup}
      </Grid>
      <Grid item sm={4} xs={12}>
        {profile === null ? (
          <ProfileSkeleton />
        ) : (
          <StaticProfile profile={profile} />
        )}
      </Grid>
    </Grid>
  );
}

export default withStyles(styles)(User);
