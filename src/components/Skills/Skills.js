import React, { useState } from "react";
import { Button, TextField, Snackbar, FormControl } from "@material-ui/core";
import axios from "axios";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
function Skills(props) {
  const { skillList, id } = props;
  const [skills, setSkills] = useState(skillList);
  const [userKeys, setUserKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const keys = [
    "Esnyu",
    "Imitacio",
    "Arc festes",
    "Drog prevencio",
    "Szexualis prevencio",
  ];
  if (loading) {
    // console.log(skillList);
    let tmp = Object.keys(skillList);
    setUserKeys(tmp);
    setLoading(false);
    // console.log(skillList);
  }
  const handleChange = (event) => {
    const value = parseInt(event.target.value);
    // console.log(value);
    setSkills({
      ...skills,
      [event.target.name]: value,
    });

    // console.log(skills);
  };
  // const endpoint = "http://localhost:8080";

  const handleSubmit = () => {
    axios
      .patch("/user/" + id, {
        skills,
      })
      .then(function (response) {
        setMsg(response.data);
        setOpen(true);
      })
      .catch(function (error) {
        console.log(error);
        //setErrors(error);
      });
  };

  if (!loading) {
    return (
      <>
        {Object.values(skills).map((el, i) => {
          return (
            <FormControl key={"Form" + i} fullWidth margin="normal">
              <TextField
                InputLabelProps={{ shrink: true }}
                type="number"
                id={i + ""}
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
          Skills modify
        </Button>
      </>
    );
  } else {
    return <div>Loading</div>;
  }
}

export default Skills;
