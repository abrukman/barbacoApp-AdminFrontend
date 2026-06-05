import { createContext, useContext, useEffect, useState } from "react";
import {
  agregarCancion,
  borrarCancion,
  editarCancion,
  traerCanciones,
} from "../api/canciones";

const CancionesContext = createContext();

export function CancionesProvider({ children }) {
  const [canciones, setCanciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState(null);
  const closeSnack = () => setSnack(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await traerCanciones();
      setCanciones(data);
    } catch (error) {
      setSnack({
        severity: "error",
        message: error.message || "Error al cargar canciones",
      });
    } finally {
      setLoading(false);
    }
  };

  const add = async (formData) => {
    setLoading(true);
    try {
      await agregarCancion(formData);
      await load();
      setSnack({
        severity: "success",
        message: "Canción agregada correctamente",
      });
    } catch (error) {
      setSnack({
        severity: "error",
        message: error.message || "Error al agregar canción",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const edit = async (id, formData) => {
    setLoading(true);
    try {
      await editarCancion(id, formData);
      await load();
      setSnack({
        severity: "success",
        message: "Canción editada correctamente",
      });
    } catch (error) {
      setSnack({
        severity: "error",
        message: error.message || "Error al editar la canción",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    setLoading(true);
    try {
      await borrarCancion(id);
      setCanciones((prev) => prev.filter((c) => c.id !== id));
      setSnack({
        severity: "success",
        message: "Canción eliminada correctamente",
      });
    } catch (error) {
      setSnack({
        severity: "error",
        message: error.message || "Error al eliminar cancion",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <CancionesContext.Provider
      value={{
        canciones,
        loading,
        snack,
        closeSnack,
        load,
        add,
        edit,
        remove,
      }}
    >
      {children}
    </CancionesContext.Provider>
  );
}

export const useCanciones = () => useContext(CancionesContext);
