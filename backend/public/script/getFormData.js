export function obtenerDatosFormulario() {
    const form = document.getElementById("formProducto");
    if (!form) return null;

    // ---- CAMPOS BASE ---- \\
    const data = {
        titulo: form.querySelector('#titulo').value.trim().replace(/\s+/g, "_"),
        precio: Number(form.querySelector('#precio').value),
        stock: Number(form.querySelector('#stock').value),
        estado: form.querySelector('#estado').value === "true",
        categoria: {
            nombre: form.querySelector('#categoria').value.trim()
        },
        imagen: form.querySelector('#imagenExistente') || "",
        info_disco: null,
        info_libro: null
    };

    // ---- IMAGEN ----
    const file = form.querySelector('#imagen').files[0];
    if (file) {
        data.imagen = file;  // se envía el archivo (para FormData)
    }

    // ---- TIPO DE PRODUCTO ----
    const categoria = data.categoria.nombre;

    // ---- INFO DISCO ---- \\
    if (categoria === "disco") {
        const interprete = form.querySelector('#interprete').value.trim();
        const year = form.querySelector('#year').value;
        const generoD = form.querySelector('#generoDisco').value.trim();

        data.info_disco = {
            interprete,
            year: year ? Number(year) : null,
            genero: { genero: generoD }
        };
    }

    // ---- INFO LIBRO ---- \\
    if (categoria === "libro") {
        const autor = form.querySelector('#autor').value.trim();
        const editorial = form.querySelector('#editorial').value.trim();
        const generoL = form.querySelector('#generoLibro').value.trim();

        data.info_libro = {
            autor,
            editorial,
            genero: { genero: generoL }
        };
    }

    return data;
}
