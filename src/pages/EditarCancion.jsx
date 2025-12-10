import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import  SendIcon  from "@mui/icons-material/Send";
import  { useCanciones }  from "../contexts/CancionesContext";

export default function EditarCancion() {
    const { id } = useParams();
    const { canciones, loading, edit } = useCanciones();
    const cancion = canciones.find(c => c.id === id );
    
    const [descripcion, setDescripcion] = useState('');
    const [letra, setLetra] = useState('');
    const [portada, setPortada] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        if(cancion) {
            setDescripcion(cancion.descripcion || '');
            setLetra(cancion.letra || '')
        }
    }, [cancion]);

    if(loading && !cancion) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                <CircularProgress />
            </Box>
        )
    };
    if(!cancion) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <Typography color="error">Canción no encontrada</Typography>
        </Box>
    )

    async function handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('descripcion', descripcion);
        formData.append('letra', letra);

        if(portada) {
            formData.append('portada', portada);
        };


        await edit(id, formData);
        navigate('/canciones');  

    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
                    <Typography variant="h4" gutterBottom>
                        Editar canción
                    </Typography>
        
                    <form onSubmit={handleSubmit}>
                        <TextField 
                            label="Título"
                            fullWidth
                            disabled
                            margin="normal"
                            value={cancion.titulo}
                        />
        
                        <TextField 
                            label="Autor"
                            fullWidth
                            disabled
                            margin="normal"
                            value={cancion.autor}
                        />
        
                        <TextField 
                            label="Descripción"
                            fullWidth
                            multiline
                            margin="normal"
                            placeholder={cancion.descripcion}
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                        />
        
                        <Box mt={2}>
                            <Button 
                                variant="contained"
                                component="label"
                                startIcon={<CloudUpload />}
                            >
                                Cambiar portada
                                <input
                                    type="file"
                                    hidden
                                    accept="image/png"
                                    onChange={(e) => setPortada(e.target.files[0])} />
                            </Button>
        
                            { portada && <Typography variant="caption" color="warning" sx={{ display: 'flex', mt: 1 }}>{portada.name}</Typography>}
                        </Box>
        
                        <TextField 
                            label="Letra"
                            fullWidth
                            required
                            multiline
                            rows={4}
                            margin="normal"
                            placeholder={cancion.letra}
                            value={letra}
                            onChange={(e) => setLetra(e.target.value)}
                        />
        
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            sx={{ mt: 2 }}
                            endIcon={<SendIcon />}
                        >
                            {loading ? "Guardando..." : "Editar canción"}
                        </Button>        
                    </form>
                </Box>
    );
};