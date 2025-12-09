import { useState } from "react";
import {
    AppBar,
    Typography,
    IconButton,
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    Box,
    Toolbar
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Draw } from "@mui/icons-material";

export default function AdminLayout({ children }){
    const [open, setOpen] = useState(false);

    const toggleDrawer = () =>{
        setOpen(!open);
    };

    const menuItems = [
        { text: "Listar Canciones"},
        { text: "Agregar Canción"}
    ];

    return (
        <Box sx={{ display: "flex" }}>
            {/* AppBar */}
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={toggleDrawer}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h6" noWrap>
                        Panel de control
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* SideBar */}
            <Drawer open={open} onClose={toggleDrawer}>
                <Box sx={{ width:250 }} role="presentation">
                    <List>
                        {menuItems.map((item) => (
                            <ListItemButton key={item.text}>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        ))}
                    </List>
                </Box>
            </Drawer>

            {/* Contenido principal */}
            <Box
                component="main"
                sx={{ 
                    flexGrow: 1, 
                    p: 3, 
                    mt: 8,
                    display: "flex",
                    justifyContent: "center",
                }}
                >
                { children }
            </Box>
        </Box>
    );
};