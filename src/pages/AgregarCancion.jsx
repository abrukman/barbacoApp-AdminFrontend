import { useState } from "react";
import {
  Alert,
  Box,
  Button,
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
  const archivos = partituras.flatMap((p) => p.archivos);
  const puedeEnviar = partituras.some(
    (p) => p.instrumento && p.archivos.length > 0,
  );
  const contarInstrumentos = () => {
    const count = {};
    partituras.forEach((p) => {
      if (!p.instrumento) return;
      count[p.instrumento] = (count[p.instrumento] || 0) + 1;
    });
    return count;
  };
  const instrumentosCount = contarInstrumentos();
  const calcularIndices = () => {
    const contador = {};
    return partituras.map((p) => {
      if (!p.instrumento) return { ...p, indice: null };

      contador[p.instrumento] = (contador[p.instrumento] || 0) + 1;

      return {
        ...p,
        indice: contador[p.instrumento],
      };
    });
  };
  const partiturasConIndice = calcularIndices().map((p) => ({
    ...p,
    total: p.instrumento ? instrumentosCount[p.instrumento] : 0,
  }));
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

    const metadata = partiturasConIndice.map((p) => ({
      instrumento: p.instrumento,
      rol: p.total > 1 ? String(p.indice) : null,
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
      formData.append("partituras", file);
    });

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

        {partiturasConIndice.map((p, index) => (
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
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || !puedeEnviar}
            sx={{ mt: 2 }}
            endIcon={<SendIcon />}
          >
            {loading ? "Guardando..." : "Crear"}
          </Button>
        </Box>
      </form>
    </Box>
  );
}
