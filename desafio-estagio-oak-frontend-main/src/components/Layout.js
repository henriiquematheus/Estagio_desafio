import React, { useState, useEffect } from "react";
import {
  AppBar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  Paper,
} from "@mui/material";
import { IoAddCircleOutline, IoListOutline } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar>
        <div>Admin Dashboard</div>
      </Toolbar>
    </AppBar>
  );
};

const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPath, setSelectedPath] = useState(location.pathname);

  useEffect(() => {
    setSelectedPath(location.pathname);
  }, [location]);

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: "240px",
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: "240px",
          boxSizing: "border-box",
          backgroundColor: "#f5f5f5",
        },
      }}
    >
      <Box
  sx={{
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
    width: "100%",
  }}
>
<Paper
  elevation={3}
  sx={{
    padding: "12px",
    marginBottom: "20px",
    textAlign: "center",
    width: "100%",
    background: "#1565c0",
    color: "#fff",
    boxShadow: "0 3px 5px 2px rgba(21, 101, 192, .3)",
  }}
>
  <Typography variant="h5" component="div" gutterBottom>
    Dashboard
  </Typography>
</Paper>

  <List sx={{ width: "100%" }}>
    <ListItem
      button
      onClick={() => navigateTo("/create-product")}
      selected={selectedPath === "/create-product"}
      sx={{
        "&.Mui-selected": {
          backgroundColor: "#1976d2",
          color: "#fff",
          "&:hover": { backgroundColor: "#1976d2" },
        },
      }}
    >
      <ListItemIcon sx={{ color: "action.active", minWidth: "35px" }}>
        <IoAddCircleOutline />
      </ListItemIcon>
      <ListItemText primary="Create Product" />
    </ListItem>
    <ListItem
      button
      onClick={() => navigateTo("/product-list")}
      selected={selectedPath === "/product-list"}
      sx={{
        "&.Mui-selected": {
          backgroundColor: "#1976d2",
          color: "#fff",
          "&:hover": { backgroundColor: "#1976d2" },
        },
      }}
    >
      <ListItemIcon sx={{ color: "action.active", minWidth: "35px" }}>
        <IoListOutline />
      </ListItemIcon>
      <ListItemText primary="Product List" />
    </ListItem>
  </List>
</Box>
    </Drawer>
  );
};

export { Header, Menu };
