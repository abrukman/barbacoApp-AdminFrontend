import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import DownloadIcon from "@mui/icons-material/Download";

export default function PartituraViewer({ partitura }) {
  const archivoPrincipal = partitura.archivos?.[0];

  if (!archivoPrincipal) return null;

  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 3,
        boxShadow: 2,
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {partitura.instrumento}
          {partitura.rol ? `${partitura.rol}` : ""}
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            mb: 2,
          }}
        >
          {partitura.archivos.map((archivo, index) => (
            <Box
              key={archivo._id || index}
              component="img"
              src={archivo.url}
              alt={`Página ${index + 1}`}
              sx={{
                width: 140,
                borderRadius: 2,
                cursor: "pointer",
                boxShadow: 1,
              }}
            />
          ))}
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<OpenInFullIcon />}
            href={archivoPrincipal.url}
            target="_blank"
          >
            Abrir
          </Button>

          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            href={archivoPrincipal.url}
            target="_blank"
          >
            Descargar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
