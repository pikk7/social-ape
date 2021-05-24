/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { IconButton, Tooltip } from "@material-ui/core";

export default ({ children, onClick, tip, btnClassName, tipClassName }) => (
  <Tooltip title={tip} className={tipClassName} placement="top">
    <IconButton onClick={onClick} className={btnClassName}>
      {children}
    </IconButton>
  </Tooltip>
);
