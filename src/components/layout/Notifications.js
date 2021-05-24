import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

import { useDispatch, useSelector } from "react-redux";
import NotificationsIcon from "@material-ui/icons/Notifications";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ChatIcon from "@material-ui/icons/Chat";
import { Badge, IconButton, Menu, MenuItem, Tooltip } from "@material-ui/core";
import { markNotificationsRead } from "../../redux/actions/userActions";

export default function Notifications(props) {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  dayjs.extend(relativeTime);
  const notifications = useSelector((state) => state.user.notifications);

  const handleOpen = (event) => {
    setAnchorEl(event.target);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onMenuOpened = () => {
    console.log("sajt");
    let unreadNotificationsIds = notifications
      .filter((not) => !not.read)
      .map((not) => not.notificationId);

    dispatch(markNotificationsRead(unreadNotificationsIds));
  };

  let notificationIcon;
  if (notifications && notifications.length > 0) {
    let notNumber = notifications.filter((not) => not.read === false).length;
    notNumber > 0
      ? (notificationIcon = (
          <Badge badgeContent={notNumber} color="secondary">
            <NotificationsIcon />
          </Badge>
        ))
      : (notificationIcon = <NotificationsIcon />);
  } else {
    notificationIcon = <NotificationsIcon />;
  }

  let notificationsMarkup =
    notifications && notifications.length > 0 ? (
      notifications.map((not) => {
        const verb = not.type === "like" ? "liked" : "commented on";
        const time = dayjs(not.createdAt).fromNow();
        const iconColor = not.read ? "primary" : "secondary";
        const icon =
          not.type === "like" ? (
            <FavoriteIcon color={iconColor} style={{ marginRight: 10 }} />
          ) : (
            <ChatIcon color={iconColor} style={{ marginRight: 10 }} />
          );

        return (
          <MenuItem
            key={not.createdAt}
            onClick={handleClose}
            component={Link}
            to={`/users/${not.recipient}/scream/${not.screamId}`}
          >
            {icon}
            <Typography color="default" variant="body1">
              {not.sender} {verb} your scream {time}
            </Typography>
          </MenuItem>
        );
      })
    ) : (
      <MenuItem onClick={handleClose}>You have not notifications yet</MenuItem>
    );
  return (
    <>
      <Tooltip placement="top" title="Notifications">
        <IconButton
          aria-owns={anchorEl ? "simple-menu" : undefined}
          aria-haspopup="true"
          onClick={handleOpen}
        >
          {notificationIcon}
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onExit={onMenuOpened}
      >
        {notificationsMarkup}
      </Menu>
    </>
  );
}
