import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  IconButton,
  Dialog,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import UndoIcon from "@mui/icons-material/Undo";
import { useState } from "react";

export default function PartituraSlot({
  data,
  onChange,
  index,
  onRemove,
  puedeEliminar,
  calcularNuevoRol,
}) {
  const handleChange = (field, value) => {
    onChange(index, {
      ...data,
      [field]: value,
    });
  };
  const capitalizar = (str = "") =>
    str.trim().length ? str.charAt(0).toUpperCase() + str.slice(1) : "";
  const titulo = data.instrumento
    ? data.total > 1
      ? `${capitalizar(data.instrumento)} ${data.rol}`
      : capitalizar(data.instrumento)
    : `Partitura ${index + 1}`;
  const esPartituraExistente = Boolean(data._id);
  const tieneReemplazoPendiente = data.nuevosArchivos?.length > 0;
  const puedeEditarArchivos = !data._id || tieneReemplazoPendiente;
  const archivosMostrados =
    data.nuevosArchivos?.length > 0 ? data.nuevosArchivos : data.archivos;
  const campoArchivos = tieneReemplazoPendiente ? "nuevosArchivos" : "archivos";
  //const esDuplicado = data.total > 1;
  const getPreview = (file) => {
    if (file instanceof File) {
      return URL.createObjectURL(file);
    }

    if (file?.url) {
      return file.url;
    }

    return "";
  };

  const moverArchivo = (from, to) => {
    const nuevos = [...archivosMostrados];
    const [movido] = nuevos.splice(from, 1);
    nuevos.splice(to, 0, movido);

    handleChange(campoArchivos, nuevos);
  };
  const eliminarArchivo = (indexArchivo) => {
    const nuevos = archivosMostrados.filter((_, i) => i !== indexArchivo);
    handleChange(campoArchivos, nuevos);
  };
  const [previewIndex, setPreviewIndex] = useState(null);
  const archivoActual =
    previewIndex !== null ? archivosMostrados[previewIndex] : null;

  const irAnterior = () => {
    setPreviewIndex((prev) => Math.max(prev - 1, 0));
  };
  const irSiguiente = () => {
    setPreviewIndex((prev) => Math.min(prev + 1, archivosMostrados.length - 1));
  };

  return (
    <>
      <Box
        sx={{
          border: "1px solid",
          borderColor: data.eliminar ? "error.main" : "divider",
          backgroundColor: data.eliminar
            ? "rgba(255, 0, 0, 0.04)"
            : "background.paper",
          opacity: data.eliminar ? 0.75 : 1,
          p: 2,
          mt: 2,
          borderRadius: 2,
          transition: "0.2s",
        }}
      >
        {data.eliminar && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            Esta partitura será eliminada al guardar los cambios
          </Typography>
        )}
        {esPartituraExistente && !tieneReemplazoPendiente && !data.eliminar && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Esta partitura se reemplaza completa. No se editan páginas
            individuales.
          </Typography>
        )}
        {tieneReemplazoPendiente && (
          <Typography color="warning.main" variant="body2" sx={{ mb: 2 }}>
            Esta partitura será reemplazada al guardar.
          </Typography>
        )}
        <Typography variant="subtitle1">{titulo}</Typography>
        {/* Instrumento */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            select
            label="instrumento"
            sx={{ flex: 2 }}
            margin="normal"
            value={data.instrumento}
            onChange={(e) => {
              const instrumento = e.target.value;
              const nuevoRol = !data._id
                ? calcularNuevoRol(instrumento)
                : data.rol;

              onChange(index, {
                ...data,
                instrumento,
                rol: nuevoRol,
              });
            }}
          >
            <MenuItem value="cifrado">cifrado</MenuItem>
            <MenuItem value="guitarra">guitarra</MenuItem>
            <MenuItem value="teclado">teclado</MenuItem>
            <MenuItem value="bajo">bajo</MenuItem>
            <MenuItem value="bateria">batería</MenuItem>
            <MenuItem value="trompeta">trompeta</MenuItem>
            <MenuItem value="trombon">trombon</MenuItem>
            <MenuItem value="saxoTenor">saxo tenor</MenuItem>
            <MenuItem value="saxoAlto">saxo alto</MenuItem>
            <MenuItem value="clarinete">clarinete</MenuItem>
            <MenuItem value="flauta">flauta</MenuItem>
          </TextField>
          {/* rol por defecto deshabilitado */}
          <TextField
            label="rol"
            sx={{ flex: 1 }}
            margin="normal"
            value={data.rol || ""}
            disabled
          />
        </Box>
        {/* archivos */}
        <Button component="label" variant="contained" sx={{ mt: 1 }}>
          {esPartituraExistente ? "Reemplazar archivos" : "Subir archivos"}
          <input
            type="file"
            hidden
            multiple
            onChange={(e) => {
              const nuevos = Array.from(e.target.files);
              if (esPartituraExistente) {
                handleChange("nuevosArchivos", [
                  ...(data.nuevosArchivos || []),
                  ...nuevos,
                ]);
              } else {
                handleChange("archivos", [...data.archivos, ...nuevos]);
              }
            }}
          />
        </Button>
        {archivosMostrados.length > 0 && (
          <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
            {archivosMostrados.length} archivo(s)
          </Typography>
        )}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            justifyContent: "flex-start",
            mt: 2,
          }}
        >
          {archivosMostrados.map((file, i) => (
            <Box
              key={i}
              sx={{
                width: 150,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                p: 1,
                textAlign: "center",
                position: "relative",
              }}
            >
              <Typography variant="caption">{i + 1}</Typography>
              <Box
                component="img"
                src={getPreview(file)}
                sx={{
                  width: "100%",
                  height: 60,
                  objectFit: "cover",
                  mt: 0.5,
                  cursor: "pointer",
                }}
                onClick={() => setPreviewIndex(i)}
              />

              <Typography variant="caption" sx={{ display: "block", mt: 0.5 }}>
                {file.name || file.publicId || "Archivo"}
              </Typography>
              {puedeEditarArchivos && (
                <Box
                  sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}
                >
                  {/* flecha izquierda */}
                  {i !== 0 && (
                    <IconButton
                      size="small"
                      onClick={() => moverArchivo(i, i - 1)}
                    >
                      <ArrowCircleLeftIcon />
                    </IconButton>
                  )}

                  {/* flecha derecha */}
                  {i !== archivosMostrados.length - 1 && (
                    <IconButton
                      size="small"
                      onClick={() => moverArchivo(i, i + 1)}
                    >
                      <ArrowCircleRightIcon />
                    </IconButton>
                  )}
                </Box>
              )}
              {puedeEditarArchivos && (
                //boton quitar archivo
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => eliminarArchivo(i)}
                  sx={{ position: "absolute", top: 0, right: 0 }}
                >
                  <CloseIcon />
                </IconButton>
              )}
            </Box>
          ))}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          {tieneReemplazoPendiente ? (
            <IconButton
              color="warning"
              size="small"
              onClick={() => handleChange("nuevosArchivos", [])}
            >
              <UndoIcon />
            </IconButton>
          ) : (
            puedeEliminar && (
              <IconButton
                color="error"
                size="small"
                onClick={() => onRemove(index)}
              >
                {data.eliminar ? <UndoIcon /> : <DeleteIcon />}
              </IconButton>
            )
          )}
        </Box>
      </Box>
      <Dialog
        open={previewIndex !== null}
        onClose={() => setPreviewIndex(null)}
        maxWidth="md"
      >
        <Box sx={{ p: 2, textAlign: "center", position: "relative" }}>
          {/* flecha izquierda */}
          {previewIndex > 0 && (
            <IconButton
              onClick={irAnterior}
              sx={{
                position: "absolute",
                left: 5,
                top: "50%",
                transform: "translateY(-50%)",
                color: "gray",
              }}
            >
              <ArrowBackIosIcon />
            </IconButton>
          )}

          {/* imagen */}
          {archivoActual && (
            <Box
              component="img"
              src={getPreview(archivoActual)}
              sx={{
                maxWidth: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
              }}
            />
          )}

          {/* flecha derecha */}
          {previewIndex < archivosMostrados.length - 1 && (
            <IconButton
              onClick={irSiguiente}
              sx={{
                position: "absolute",
                right: 5,
                top: "50%",
                transform: "translateY(-50%)",
                color: "gray",
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          )}
        </Box>
      </Dialog>
    </>
  );
}
