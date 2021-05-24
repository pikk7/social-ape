import React from "react";
import MyButton from "../../util/MyButton";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { likeScream, unlikeScream } from "../../redux/actions/dataActions";

function LikeButton(props) {
  const dispatch = useDispatch();
  const screamId = props.screamId;
  const { authenticated, likes } = useSelector((state) => state.user);
  const likedScream = () => {
    return likes && likes.find((like) => like.screamId === screamId);
  };

  const likeScreamFunc = () => {
    dispatch(likeScream(screamId));
  };

  const unLikeScreamFunc = () => {
    dispatch(unlikeScream(screamId));
  };
  const likeButton = !authenticated ? (
    <Link to="/login">
      <MyButton tip="Like">
        <FavoriteBorder color="primary" />
      </MyButton>
    </Link>
  ) : likedScream() ? (
    <MyButton tip="Undo like" onClick={unLikeScreamFunc}>
      <FavoriteIcon color="primary" />
    </MyButton>
  ) : (
    <MyButton tip="Like" onClick={likeScreamFunc}>
      <FavoriteBorder color="primary" />
    </MyButton>
  );
  return likeButton;
}

export default LikeButton;
