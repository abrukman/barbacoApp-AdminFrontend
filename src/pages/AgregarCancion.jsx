import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import  SendIcon  from "@mui/icons-material/Send";
import  { useCanciones }  from "../contexts/CancionesContext";

export default function AgregarCancion() {
    const { add, loading } = useCanciones();

    const [titulo, setTitulo] = useState('');
    const [autor, setAutor] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [letra, setLetra] = useState('');
    const [portada, setPortada] = useState(null);
    const partituras = [{
        instrumento: 'cifrado',
        archivo: 'http://nube.com/cifrado-invierno.svg'
    }];
    async function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('titulo', titulo);
        formData.append('autor', autor);
        formData.append('descripcion', descripcion);
        formData.append('letra', letra);
        formData.append('partituras', JSON.stringify(partituras));

        if(portada) formData.append('portada', portada);

        await add(formData);
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Agregar canción
            </Typography>

            <form onSubmit={handleSubmit}>
                <TextField 
                    label="Título"
                    fullWidth
                    required
                    margin="normal"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                />

                <TextField 
                    label="Autor"
                    fullWidth
                    required
                    margin="normal"
                    value={autor}
                    onChange={(e) => setAutor(e.target.value)}
                />

                <TextField 
                    label="Descripción"
                    fullWidth
                    multiline
                    margin="normal"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                />

                <Box mt={2}>
                    <Button 
                        variant="contained"
                        component="label"
                        startIcon={<CloudUpload />}
                    >
                        Subir portada
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
                    {loading ? "Guardando..." : "Agregar canción"}
                </Button>
            </form>
        </Box>
    );
};