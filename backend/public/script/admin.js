import { Product } from '../classes/Product.js'

const api_url = "http://localhost:3000/api/productos"

async function cargarProductos(filtro) {

    const gridLibros = document.getElementById("grid_libros");
    const gridDiscos = document.getElementById("grid_discos");
    gridLibros.innerHTML = "";
    gridDiscos.innerHTML = "";

    try {
        const respuesta = await fetch(api_url)

        if (!respuesta) {
            throw new Error("Error al obtener los productos. intente denuevo.")
        }

        const productos = await respuesta.json();

        let productos_cache = [];
        if (filtro == "todo") {
            productos_cache = productos.reverse()
        } else {
            // Filtramos por categoria y colocamos los ultimos agregados primeros en la lista
            productos_cache = productos.filter(p => p["categoria.nombre"].toLowerCase() == filtro).reverse()
        }

        productos_cache.forEach(p => {
            const producto = new Product(p.id, p.titulo, p.precio, p.imagen, p.stock, p.estado, p["categoria.nombre"])
            if (p["categoria.nombre"] == 'Disco') {
                gridDiscos.appendChild(producto.toHTML());
            } else {
                gridLibros.appendChild(producto.toHTML());
            }
        });

    } catch (error) {
        console.log(error);
        gridLibros.innerHTML = "<p>Error al cargar libros.</p>"
        gridDiscos.innerHTML = "<p>Error al cargar discos.</p>"
    }
}

document.addEventListener("DOMContentLoaded", async () => {

    cargarProductos("todo"); // Carga por defecto

    document.querySelectorAll(".filtros_btn").forEach(boton => {
        let filtro = (boton.dataset.filtro);

        boton.addEventListener("click", () => {
            cargarProductos(filtro)
        })
    })
});