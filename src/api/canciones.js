const BASE_URL = "http://localhost:5000/api/canciones";

export async function traerCanciones() {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Error al obtener lista de canciones");
    return res.json();
};

export async function borrarCancion(id) {
    const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    if(!res.ok) {
        const text = await res.text();
        throw new Error(text || "Error al borrar");
    }
    return res.json();
};

export async function agregarCancion(datos) {

    const res = await fetch(BASE_URL, {
        method: "POST",
        body: datos,
    });

    if(!res.ok) {
        const text = await res.text();
        throw new Error(text || "Error al agregar canción");
    }
    return res.json();
};

export async function editarCancion(id, datos) {
    const res = await fetch(`${BASE_URL}/${id}`, { 
        method: 'PATCH',
        body: datos,
    });

    if(!res.ok) {
        throw new Error('Error al editar la canción');
    }

    return res.json();
};