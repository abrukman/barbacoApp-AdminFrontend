import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Card, CardContent, CardMedia, CircularProgress, Dialog, DialogActions, DialogTitle, Grid, IconButton, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import  { useCanciones }  from "../contexts/CancionesContext";

export default function ListarCanciones() {
    const { canciones, loading, remove } = useCanciones();
    const [deleting, setDeleting] = useState(null);
    const navigate = useNavigate();

    const handleConfirmeDelete = async () => {
        if(!deleting) return;
        try {
            await remove(deleting);    
        } catch {
            
        } finally {
            setDeleting(null);
        }
        
    };

    if(loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            <CircularProgress />
            </Box>
        );
    };

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h5">Canciones ({canciones.length})</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("nueva")}>
                    Agregar canción
                </Button>
            </Stack>

            <Grid container spacing={2}>
                {canciones.map((cancion) => {
                    const id = cancion.id;
                    return (
                        <Grid key={id} size={{ xs: 12, sm: 6, md: 4}}>
                            <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                                {cancion.portada && (
                                    <CardMedia component="img" height="140" image={cancion.portada.url} alt={cancion.titulo || "portada"} />
                                )}
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6">{cancion.titulo || "Sin título"}</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        {cancion.autor || ""}
                                    </Typography>
                                </CardContent>

                                <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
                                    <IconButton color="primary" onClick={() => navigate(`${id}/editar`)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => setDeleting(id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            <Dialog open={Boolean(deleting)} onClose={() => setDeleting(null)}>
                <DialogTitle>¿Eliminar esta canción?</DialogTitle>
                <DialogActions>
                    <Button onClick={() => setDeleting(null)}>Cancelar</Button>
                    <Button color="error" onClick={handleConfirmeDelete}>Eliminar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
};