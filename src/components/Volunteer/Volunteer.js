import React, { useContext, useState } from "react";

import { AuthContext } from "../../context/auth";
import { useJwt } from "react-jwt";
import Skills from "../Skills/Skills";
import Details from "../Details/Details";
import { Card } from "../AuthForm/AuthForm";

function Volunteer(props) {
  const token = useContext(AuthContext);
  const { decodedToken } = useJwt(token["authTokens"]);
  const [needData, setNeedData] = useState(true);
  const [id, setId] = useState(1);
  const [skillList, setSkillList] = useState({
    firstAid: 0,
    simulation: 0,
    facePainting: 0,
    drog: 0,
    sex: 0,
  });
  const [details, setDetails] = useState({
    Nev: "",
    Jelszo: "",
    "E-mail": "",
    Kor: 0,
  });

  if (needData && decodedToken) {
    let tmp = decodedToken["CustomUserInfo"];
    // delete tmp.UpdatedAt;
    // delete tmp.CreatedAt;
    // delete tmp.DeletedAt;
    // delete tmp.Achievement;
    // delete tmp.Events;
    setId(tmp.ID);
    setDetails({
      Name: tmp.Name,
      Password: tmp.Password,
      Email: tmp.Email,
      Age: tmp.Age,
    });

    setSkillList({
      firstAid: tmp.FirstAid,
      simulation: tmp.Simulation,
      facePainting: tmp.FacePainting,
      drog: tmp.Drog,
      sex: tmp.Sex,
    });
    setNeedData(!needData);
  }

  // console.log(skillList);
  return (
    <>
      <p>A különböző önkéntesség alatt használt szakmai tudásod szintjei.</p>

      <ol start="1">
        <li> sosem végeztem ilyen, vagy hasonló tevékenyésget </li>
        <li>
          {" "}
          néhányszor vállaltam már ilyen típusú feladatot, van némi gyakorlatom
          a teületen
        </li>
        <li>
          {" "}
          képzett önkéntes / képzés nélküli, de nagy gyakorlattal rendelkező
          önkéntes{" "}
        </li>
        <li> képzett ÉS nagy gyakorlattal rendelkező önkéntes</li>
        <li> képző önkéntes</li>
      </ol>
      <Card>
        <h2>ID: {id}</h2>
        {decodedToken && skillList && (
          <>
            <Details detailsList={details} id={id} />
            <Skills skillList={skillList} id={id} />
          </>
        )}
      </Card>
    </>
  );
}

export default Volunteer;
