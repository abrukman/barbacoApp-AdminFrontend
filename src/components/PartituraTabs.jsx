import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";

export default function PartituraTabs({ partituras, letra }) {
  const [tabActiva, setTabActiva] = useState(0);
  const handleChangeTab = (_, newValue) => {
    setTabActiva(newValue);
  };

  const esTabLetra = tabActiva === 0;
  const partitura = partituras?.[tabActiva - 1];

  return (
    <Box sx={{ mt: 4 }}>
      <Tabs
        value={tabActiva}
        onChange={handleChangeTab}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Letra" />
        {partituras?.map((p, index) => (
          <Tab
            key={p._id || index}
            label={`${p.instrumento} ${p.rol ? `${p.rol}` : ""}`}
          />
        ))}
      </Tabs>

      <Box sx={{ mt: 4 }}>
        {esTabLetra ? (
          <Typography
            sx={{
              whiteSpace: "pre-line",
              lineHeight: 1.8,
            }}
          >
            {letra}
          </Typography>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              gap: 3,
              alignItems: "center",
            }}
          >
            {partitura?.archivos?.map((archivo, index) => (
              <Box
                component="img"
                key={archivo._id || index}
                src={archivo.url}
                alt={`Pagina ${index + 1}`}
                sx={{
                  width: "100%",
                  maxWidth: 900,
                  borderRadius: 2,
                  boxShadow: 2,
                  objectFit: "contain",
                }}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
