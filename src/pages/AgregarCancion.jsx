import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { CloudUpload } from "@mui/icons-material";
import SendIcon from "@mui/icons-material/Send";
import { useCanciones } from "../contexts/CancionesContext";
import { useNavigate } from "react-router-dom";
import PartituraSlot from "../components/PartituraSlot";

export default function AgregarCancion() {
  const { add, loading } = useCanciones();

  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [letra, setLetra] = useState("");
  const [portada, setPortada] = useState(null);
  const [partituras, setPartituras] = useState([
    {
      instrumento: "",
      archivos: [],
    },
  ]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const archivos = partituras.flatMap((p) => p.archivos);
  const puedeEnviar = partituras.some(
    (p) => p.instrumento && p.archivos.length > 0,
  );

  function calcularNuevoRol(instrumento) {
    const delInstrumento = partituras.filter(
      (p) => p.instrumento === instrumento && !p.eliminar,
    );

    //no existe ninguna => rol null
    if (delInstrumento.length === 0) {
      return null;
    }

    //buscar roles existentes
    const rolesNumericos = delInstrumento
      .filter((p) => p.rol !== null && p.rol !== undefined)
      .map((p) => Number(p.rol))
      .filter((r) => !isNaN(r));

    //si solo existe null asignar 2
    if (rolesNumericos.length === 0) {
      return 2;
    }

    return Math.max(...rolesNumericos) + 1;
  }
  const removerPartitura = (index) => {
    // si borramos el último devuelve el genérico
    setPartituras((prev) => {
      if (prev.length === 1) {
        return [{ instrumento: "", archivos: [] }];
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();

    const metadata = partituras.map((p) => ({
      instrumento: p.instrumento,
      rol: p.rol,
      cantidadArchivos: p.archivos.length,
    }));

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("autor", autor);
    formData.append("descripcion", descripcion);
    formData.append("letra", letra);
    if (portada) formData.append("portada", portada);
    formData.append("partiturasMetadata", JSON.stringify(metadata));
    archivos.forEach((file) => {
      formData.append("archivosPartituras", file);
    });

    console.log(formData);

    await add(formData);
    navigate("/canciones");
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
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
              onChange={(e) => setPortada(e.target.files[0])}
            />
          </Button>

          {portada && (
            <Typography
              variant="caption"
              color="warning"
              sx={{ display: "flex", mt: 1 }}
            >
              {portada.name}
            </Typography>
          )}
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

        {partituras.map((p, index) => (
          <PartituraSlot
            key={index}
            index={index}
            data={p}
            puedeEliminar={partituras.length > 1}
            onChange={(i, nuevaData) => {
              const nuevas = [...partituras];
              nuevas[i] = nuevaData;
              setPartituras(nuevas);
            }}
            onRemove={removerPartitura}
            calcularNuevoRol={calcularNuevoRol}
          />
        ))}

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <IconButton
            color="primary"
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
            onClick={() =>
              setPartituras([
                ...partituras,
                { instrumento: "", rol: null, archivos: [] },
              ])
            }
          >
            <AddIcon />
          </IconButton>
        </Box>

        <Box sx={{ mt: 4 }}>
          {!puedeEnviar && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Debe agregar al menos una partitura con instrumento y archivos
            </Alert>
          )}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button
            type="button"
            variant="contained"
            color="primary"
            disabled={loading || !puedeEnviar}
            sx={{ mt: 2 }}
            endIcon={<SendIcon />}
            onClick={() => setConfirmOpen(true)}
          >
            {loading ? "Guardando..." : "Crear"}
          </Button>
        </Box>
      </form>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>¿Crear canción?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={async () => {
              setConfirmOpen(false);

              await handleSubmit({
                preventDefault: () => {},
              });
            }}
          >
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
