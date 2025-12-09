import AdminLayout from "./layouts/AdminLayout";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ListarCanciones from "./pages/ListarCanciones"
import AgregarCancion from "./pages/AgregarCancion";
import EditarCancion from "./pages/EditarCancion";
import { Alert, Snackbar } from "@mui/material";
import { useCanciones } from "./contexts/CancionesContext";

function App() {
  const { snack, closeSnack } = useCanciones();

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/canciones" element={<ListarCanciones />} />
        <Route path="/canciones/nueva" element={<AgregarCancion />}/>
        <Route path="/canciones/:id/editar" element={<EditarCancion />} />
      </Routes>
      
      <Snackbar
        open={Boolean(snack)}
        autoHideDuration={3000}
        onClose={closeSnack}
      >
        {snack && (
          <Alert
            severity={snack.severity}
            onClose={closeSnack}
            >
              {snack.message}
            </Alert>
          )
        }
      </Snackbar>
    </AdminLayout>
  )
}

export default App
