
const nombre = localStorage.getItem("usuario");
document.getElementById("nombre_usuario").textContent= nombre || "invitado"


const api_url = "http://localhost:3000/api/productos"

async function cargarProductos() {
    try{
        const respuesta = await fetch(api_url)

        if(!respuesta){
            throw new Error("Error al obtener los productos. intente denuevo.")
        }

        const productos = await respuesta.json();

        const gridLibros = document.getElementById("grid-libros");
        const gridDiscos = document.getElementById("grid-discos");

        gridDiscos.innerHTML= "";
        gridLibros.innerHTML= "";

        productos.forEach((p) => {
            const titulo = p.titulo ?? "Sin titulo";
            const precio = p.precio ?? "-";
            const imagen = p.imagen ?? "";
            const stock = p.stock ?? 0;

            const card = document.createElement("article");
            card.className = "producto-card"

            card.innerHTML = `
                <div class="contenedor_imagen_producto">
                    <img src="${imagen}" alt="${titulo}">
                </div>
                <div class="contenedor_cuerpo_producto">
                    <div class="producto_titulo">${titulo}</div>
                    <div class="producto_precio">${precio}</div>
                    <button class="producto_boton">Añadir al carrito</button>
                </div>
            `

            const tipo_producto = p["categoria.nombre"].toLowerCase();
            const es_libro = tipo_producto === "libro";
            const es_disco = tipo_producto === "disco";


            if (es_disco){
                gridDiscos.appendChild(card);
            } else if (es_libro){
                gridLibros.appendChild(card);
            }

        });

    }catch (error){
        console.log(error);
        const gridLibros = document.getElementById("grid-libros");
        const gridDiscos = document.getElementById("grid-discos");

        gridLibros.innerHTML ="<p>Error al cargar libros.</p>"
        gridDiscos.innerHTML ="<p>Error al cargar discos.</p>"
    }
}


document.addEventListener("DOMContentLoaded", cargarProductos);