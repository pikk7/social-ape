import React, { useState } from "react";
import FormControl from "@material-ui/core/FormControl";
import { Button, Snackbar, TextField } from "@material-ui/core";
import axios from "axios";
import QRCode from "qrcode.react";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
function Details(props) {
  const { detailsList, id } = props;
  const [details, setDeatils] = useState(detailsList);
  const [userKeys, setUserKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const keys = ["Nev", "Jelszo", "Email", "Kor"];

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const handleSubmit = () => {
    axios
      .patch(
        "/user/" + id,
        {
          ...details,
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*",
          },
        }
      )
      .then(function (response) {
        setMsg(response.data);
        setOpen(true);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  if (loading) {
    // console.log(detailsList);
    let tmp = Object.keys(detailsList);
    setUserKeys(tmp);
    setLoading(false);
    // console.log(detailsList);
  }
  const handleChange = (event) => {
    const value = event.target.value;
    // console.log(value);
    setDeatils({
      ...details,
      [event.target.name]: value,
    });

    // console.log(details);
  };

  if (!loading) {
    return (
      <>
        <h2>QR kodod:</h2>
        <QRCode
          imageSettings={{
            src: "http://localhost:3000/static/media/logo.1501576f.png",
            x: null,
            y: null,
            height: 24,
            width: 24,
            excavate: true,
          }}
          value={`http://localhost:8080/user/${id}`}
        />

        {Object.values(details).map((el, i) => {
          return (
            <FormControl key={"Form" + i} fullWidth margin="normal">
              <TextField
                id={i + ""}
                type={i === 1 ? "password" : "text"}
                label={keys[i]}
                variant="outlined"
                value={el}
                name={userKeys[i]}
                onChange={handleChange}
              />
            </FormControl>
          );
        })}
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success">
            {msg}
          </Alert>
        </Snackbar>
        <Button variant="contained" onClick={handleSubmit}>
          Adatok mentese
        </Button>
      </>
    );
  } else {
    return <div>Loading</div>;
  }
}

export default Details;
