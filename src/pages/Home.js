import React, { useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Scream from "../components/scream/Scream";
import Profile from "../components/profile/Profile";
import { getScreams } from "../redux/actions/dataActions";
import { useSelector, useDispatch } from "react-redux";
import ScreamSkeleton from "../util/ScreamSkeleton";
const Home = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    //effect
    dispatch(getScreams());
  }, [dispatch]);
  const { screams, loading } = useSelector((state) => state.data);
  let recentScreamsMarkuo = !loading ? (
    screams.map((scream, i) => {
      return <Scream scream={scream} key={scream.screamId} />;
    })
  ) : (
    <ScreamSkeleton />
  );

  return (
    <Grid container spacing={2}>
      <Grid item sm={8} xs={12}>
        {recentScreamsMarkuo}
      </Grid>
      <Grid item sm={4} xs={12}>
        <Profile />
      </Grid>
    </Grid>
  );
};

export default Home;
