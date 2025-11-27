export function completeForm(p) {
    
    // DATOS GENERALES
    const titulo = document.getElementById("titulo");
    const precio = document.getElementById("precio");
    const stock = document.getElementById("stock");
    const estado = document.getElementById("estado");
    const categoria = document.getElementById("categoria");
    const imagenExistente = document.getElementById("imagenExistente");
    const previewImg = document.getElementById("previewImg");

    titulo.value = p.titulo || "-Sin Definir-";
    precio.value = p.precio || "0";
    stock.value = p.stock || "0";
    estado.value = p.estado ? "true" : "false";
    categoria.value = p.categoria?.nombre || "";

    // Imagen
    if (p.imagen) {
        imagenExistente.value = p.imagen;
        previewImg.src = p.imagen;
        previewImg.classList.remove("d-none");
    }

    // INFO DISCO
    const seccionDisco = document.getElementById("seccionDisco");
    if (p.info_disco) {
        seccionDisco.classList.remove("d-none");
        const interprete = document.getElementById("interprete");
        const year = document.getElementById("year");
        const generoDisco = document.getElementById("generoDisco");

        interprete.value = p.info_disco.interprete;
        year.value = p.info_disco.year;
        generoDisco.value = p.info_disco.genero?.genero || "";
    }

    // INFO LIBRO
    const seccionLibro = document.getElementById("seccionLibro");
    if (p.info_libro) {
        seccionLibro.classList.remove("d-none");
        const autor = document.getElementById("autor");
        const editorial = document.getElementById("editorial");
        const generoLibro = document.getElementById("generoLibro");

        autor.value = p.info_libro.autor;
        editorial.value = p.info_libro.editorial;
        generoLibro.value = p.info_libro.genero?.genero || "";
    }
}
