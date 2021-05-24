import axios from "axios";
import {
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_UNAUTHETICATED,
  LOADING_USER,
  MARK_NOTIFICATIONS_READ,
} from "../types";

export const loginUser = (userData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/login", userData)
    .then((res) => {
      setAuthorizationHeader(res.data.token);

      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      history.push(`/`);
    })
    .catch((err) => {
      // console.log(err.response.data);
      const rtm = Object.assign({}, err.response.data);
      dispatch({
        type: SET_ERRORS,
        payload: rtm,
      });
    });
};

export const signupUser = (newUserData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/signup", newUserData)
    .then((res) => {
      setAuthorizationHeader(res.data.token);
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      history.push(`/`);
    })
    .catch((err) => {
      // console.log(err.response.data);
      const rtm = Object.assign({}, err.response.data);
      dispatch({
        type: SET_ERRORS,
        payload: rtm,
      });
    });
};

export const getUserData = () => (dispatch) => {
  dispatch({ type: LOADING_USER });
  axios
    .get("/user")
    .then((res) => {
      dispatch({ type: SET_USER, payload: res.data });
    })
    .catch((err) => console.log(err));
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("FbIdToken");
  delete axios.defaults.headers.common["Authorization"];
  dispatch({ type: SET_UNAUTHETICATED });
};

export const uploadImage = (formData) => (dispatch) => {
  dispatch({ type: LOADING_USER });
  axios
    .post("/user/image", formData)
    .then((res) => {
      dispatch(getUserData());
    })
    .catch((err) => console.log(err));
};

export const editUserDetails = (userDetails) => (dispatch) => {
  dispatch({ type: LOADING_USER });
  axios
    .post("/user", userDetails)
    .then(() => {
      dispatch(getUserData());
    })
    .catch((err) => console.log(err));
};

export const markNotificationsRead = (notificationIds) => (dispatch) => {
  axios.post("/notifications", notificationIds).then((res) => {
    dispatch({ type: MARK_NOTIFICATIONS_READ });
  });
};

const setAuthorizationHeader = (token) => {
  const FbIdToken = `Bearer ${token}`;
  localStorage.setItem("FbIdToken", FbIdToken);
  axios.defaults.headers.common["Authorization"] = FbIdToken;
};
