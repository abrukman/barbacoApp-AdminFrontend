import { useCallback, useEffect, useState } from "react";
import { traerCanciones, borrarCancion, agregarCancion, editarCancion } from "../api/canciones";

export default function useCanciones() {
    const [ canciones, setCanciones ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(null);
    const [ snack, setSnack ] = useState(null);
    const closeSnack = () => setSnack(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await traerCanciones();
            setCanciones(data);
        } catch (error) {
            setError(error.message || "Error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const remove = useCallback(
        async (id) => {
            setLoading(true);
            setError(null);
            try {
                await borrarCancion(id);
                setCanciones((prev) => prev.filter((c) => c.id !== id));
                setSnack({
                    severity: 'success',
                    message: 'Canción eliminada correctamente'
                });
            } catch (error) {
                setError(error.message);
                setSnack({
                    severity: 'error',
                    message: error.message || 'Error al eliminar la canción'
                });
                throw error;
            } finally {
                setLoading(false);
            }
        }, []
    );

    const add = useCallback(async (cancion) => {
        setLoading(true);
        setError(null);
        try {
            const nuevaCancion = await agregarCancion(cancion);
            setCanciones((prev) => [...prev, nuevaCancion]);
            setSnack({
                severity: 'success',
                message: 'Canción agregada correctamente'
            });
        } catch (error) {
            setError(error.message);
            setSnack({
                severity: 'error',
                message: error.message || "Error al agregar canción"
            });
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const edit = useCallback(async (id, datos) => {
        setLoading(true);
        setError(null);
        try {
            const cancionAEditar = await editarCancion(id, datos);
            setCanciones(prev => prev.map(c => c.id === id ? cancionAEditar : c));
            setSnack({
                severity: 'success',
                message: 'Canción editada correctamente'
            })
        } catch (error) {
            setError(error.message);
            setSnack({
                severity: 'error',
                message: error.message || 'Error al editar canción'
            });
            throw error;
        } finally {
            setLoading(false)
        };
    }, []);

    return { canciones, loading, error, snack, closeSnack, load, remove, add, edit };
}