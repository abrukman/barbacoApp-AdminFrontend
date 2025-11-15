import AdminLayout from "./layouts/AdminLayout";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AgregarCancion from "./pages/AgregarCancion";
import EditarCancion from "./pages/EditarCancion";


function App() {

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={Dashboard} />
        <Route path="/canciones" element={AgregarCancion} />
        <Route path="/canciones/nueva" element={AgregarCancion}/>
        <Route path="/canciones/:id" element={EditarCancion} />
      </Routes>
    </AdminLayout>
  )
}

export default App
