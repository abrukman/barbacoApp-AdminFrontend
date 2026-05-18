import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogActions,
  IconButton,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { CloudUpload } from "@mui/icons-material";
import SendIcon from "@mui/icons-material/Send";
import { useCanciones } from "../contexts/CancionesContext";
import { traerCancion } from "../api/canciones";
import PartituraSlot from "../components/PartituraSlot";
import PartituraTabs from "../components/PartituraTabs";
//import PartituraViewer from "../components/PartituraViewer";

export default function VerCancion() {
  const { id } = useParams();
  const { loading, edit } = useCanciones();
  const [cancion, setCancion] = useState(null);
  const [loadingCancion, setLoadingCancion] = useState(true);

  const [descripcion, setDescripcion] = useState("");
  const [letra, setLetra] = useState("");
  const [portada, setPortada] = useState(null);
  const portadaPreview = portada
    ? URL.createObjectURL(portada)
    : cancion?.portada?.url;
  const [modoEdicion, setModoEdicion] = useState(false);
  const [editTab, setEditTab] = useState(0);
  const [letraEditada, setLetraEditada] = useState(false);
  const [partituras, setPartituras] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);

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
    setPartituras((prev) => {
      const partitura = prev[index];
      console.log(partitura.eliminar);

      //si todavia no existe en MONGO
      if (!partitura._id) {
        return prev.filter((_, i) => i !== index);
      }

      //si ya existe marcar para eliminar
      return prev.map((p, i) =>
        i === index ? { ...p, eliminar: !p.eliminar } : p,
      );
    });
  };

  const navigate = useNavigate();

  useEffect(() => {
    async function cargarCancion() {
      try {
        const data = await traerCancion(id);
        setCancion(data);
        setDescripcion(data.descripcion || "");
        setLetra(data.letra || "");
        setPartituras(
          (data.partituras || []).map((p) => ({
            _id: p._id,
            instrumento: p.instrumento,
            rol: p.rol,
            archivos: p.archivos || [],
            nuevosArchivos: [],
            eliminar: false,
          })),
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingCancion(false);
      }
    }

    cargarCancion();
  }, [id]);

  if (loadingCancion) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (!cancion)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <Typography color="error">Canción no encontrada</Typography>
      </Box>
    );

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();

    formData.append("descripcion", descripcion);
    formData.append("letra", letra);

    if (portada) {
      formData.append("portada", portada);
    }

    const acciones = [];
    const archivosPartituras = [];

    partituras.forEach((p) => {
      //borrar
      if (p.eliminar) {
        acciones.push({
          accion: "borrar",
          instrumento: p.instrumento,
          rol: p.rol,
        });

        return;
      }

      //reemplazar
      if (p._id && p.nuevosArchivos?.length > 0) {
        acciones.push({
          accion: "reemplazar",
          instrumento: p.instrumento,
          rol: p.rol,
          cantidadArchivos: p.nuevosArchivos.length,
        });

        archivosPartituras.push(...p.nuevosArchivos);

        return;
      }

      //agregar
      if (!p._id && p.archivos?.length > 0) {
        acciones.push({
          accion: "agregar",
          instrumento: p.instrumento,
          rol: p.rol,
          cantidadArchivos: p.archivos.length,
        });

        archivosPartituras.push(...p.archivos);
      }
    });

    formData.append("partiturasMetadata", JSON.stringify(acciones));

    archivosPartituras.forEach((file) => {
      formData.append("archivosPartituras", file);
    });

    console.log("acciones: ", acciones);
    console.log("archivos partituras: ", archivosPartituras);
    for (const [key, value] of formData.entries()) {
      console.log("formdata: ", key, value);
    }

    await edit(id, formData);
    navigate("/canciones");
  }

  return (
    <Box sx={{ width: "100%", maxWidth: "lg", mx: "auto", p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
          modo edición
        </Typography>
        <Switch
          checked={modoEdicion}
          onChange={(e) => setModoEdicion(e.target.checked)}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 4,
          alignItems: "flex-start",
          mb: 4,
          flexWrap: "wrap",
        }}
      >
        {/* portada */}
        <Box
          sx={{
            position: "relative",
            width: 220,
            minWidth: 220,
          }}
        >
          {portada && (
            <Typography
              variant="caption"
              color="warning.main"
              sx={{ display: "block", mt: 1 }}
            >
              nueva portada pendiente de guardar
            </Typography>
          )}
          <Box
            component="img"
            src={portadaPreview}
            alt={cancion.titulo}
            sx={{
              width: "100%",
              objectFit: "cover",
              borderRadius: 2,
              boxShadow: 2,
              display: "block",
            }}
          />
          {modoEdicion && (
            <IconButton
              component="label"
              size="small"
              color="primary"
              sx={{
                position: "absolute",
                bottom: 8,
                right: 8,
              }}
            >
              <EditIcon />
              <input
                type="file"
                hidden
                accept="image/png"
                onChange={(e) => setPortada(e.target.files[0])}
              />
            </IconButton>
          )}
        </Box>

        {/* contenido */}
        <Box sx={{ flex: 1, minWidth: 300 }}>
          <Typography variant="h4" gutterBottom>
            {cancion.titulo}
          </Typography>

          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {cancion.autor}
          </Typography>

          {modoEdicion ? (
            <TextField
              fullWidth
              multiline
              label="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              sx={{ mb: 3 }}
            />
          ) : (
            <Typography sx={{ mb: 3 }}>{cancion.descripcion}</Typography>
          )}

          {modoEdicion ? (
            <Box sx={{ mt: 4 }}>
              <Tabs
                value={editTab}
                onChange={(e, value) => setEditTab(value)}
                sx={{ mb: 3 }}
              >
                <Tab label="letra" />
                <Tab label="partituras" />
              </Tabs>

              {/*TAB LETRA */}
              {editTab === 0 && (
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Typography variant="h5">Letra</Typography>

                    {letraEditada && (
                      <Typography variant="caption" color="warning.main">
                        cambios sin guardar
                      </Typography>
                    )}
                  </Box>

                  <TextField
                    fullWidth
                    multiline
                    minRows={14}
                    value={letra}
                    onChange={(e) => {
                      setLetra(e.target.value);
                      setLetraEditada(true);
                    }}
                  />
                </Box>
              )}

              {/* TAB PARTITURAS */}
              {editTab === 1 && (
                <Box>
                  <Typography variant="h5" gutterBottom>
                    Editar Partituras
                  </Typography>

                  {partituras.map((p, index) => (
                    <PartituraSlot
                      key={p._id || `slot-${index}`}
                      index={index}
                      data={p}
                      onChange={(i, nuevaData) => {
                        const nuevas = [...partituras];
                        nuevas[i] = nuevaData;
                        setPartituras(nuevas);
                      }}
                      puedeEliminar={partituras.length > 1}
                      onRemove={removerPartitura}
                      calcularNuevoRol={calcularNuevoRol}
                    />
                  ))}

                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <IconButton
                      color="primary"
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        mt: 2,
                      }}
                      onClick={() =>
                        setPartituras([
                          ...partituras,
                          {
                            instrumento: "",
                            rol: null,
                            archivos: [],
                            nuevosArchivos: [],
                            eliminar: false,
                          },
                        ])
                      }
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                </Box>
              )}
              {/* GUARDAR */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 4,
                }}
              >
                <Button
                  variant="contained"
                  onClick={() => setConfirmOpen(true)}
                  disabled={loading}
                  endIcon={<SendIcon />}
                >
                  {loading ? "Guardando..." : "Guardar cambios"}
                </Button>
              </Box>
            </Box>
          ) : (
            <PartituraTabs
              partituras={cancion.partituras}
              letra={cancion.letra}
            />
          )}
        </Box>
      </Box>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>¿Guardar cambios?</DialogTitle>
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
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
