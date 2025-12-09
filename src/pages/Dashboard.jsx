import { Box, Grid, Paper, Typography } from "@mui/material";

export default function Dashboard() {
    return (
        <Box 
            sx={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: 2,
        }}
        >
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>

            <Grid container spacing={3}>
                {/* Tarjeta total de obras */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6">Total de canciones</Typography>
                        <Typography variant="h3" color="primary">
                            --
                        </Typography>
                    </Paper>
                </Grid>

                {/* Tarjeta puntuación promedio */}
                <Grid size={{xs: 12, md: 4}}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6">Puntuación promedio</Typography>
                        <Typography variant="h3" color="secondary">
                            --
                        </Typography>
                    </Paper>
                </Grid>

                {/* Impresiones */}
                <Grid size={{xs: 12, md: 4}}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6">Impresiones de partituras</Typography>
                        <Typography variant="h3" color="error">
                            --
                        </Typography>
                    </Paper>
                </Grid>

                {/* Gráfico */}
                <Grid size={{ xs: 12 }}>
                    <Paper 
                        elevation={3} 
                        sx={{
                            p: 2,
                            minHeight: 300,
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Gráfico de visitas
                        </Typography>
                        <Box
                            sx={{
                                flexGrow: 1,
                                width: "100%",
                                bgcolor: "#f5f5f5",
                                borderRadius: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#888"
                            }}
                        >
                            Aqui irá un gráfico
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};