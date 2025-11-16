const nombre = localStorage.getItem("usuario");
document.getElementById("nombre_usuario").textContent= nombre || "invitado"


const api_url = "http://localhost:3000/api/productos"

//carrito

function obtenerCarrito(){
    const carrito_guardado = localStorage.getItem("carrito");

    if (!carrito_guardado){
        return [];
    }

    try{
        return JSON.parse(carrito_guardado)
    }catch(e){
        console.error("Error al parsear el carrito", e)
        return[];
    }
}

function guardarCarrito(carrito){
    localStorage.setItem("carrito", JSON.stringify(carrito))
}

function agregarAlCarrito(producto){
    const carrito = obtenerCarrito()

    const existe = carrito.findIndex(item => item.id === producto.id);

    if (existe !== -1) {
        carrito[existe].cantidad += 1;
    }else{
        carrito.push({
            id: producto.id,
            titulo: producto.titulo,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: 1
        })
    }

    guardarCarrito(carrito);
    alert(`Se agrego "${producto.titulo}" al carrito.`)
}


//productos
async function cargarProductos() {
    try{
        const respuesta = await fetch(api_url)

        if(!respuesta){
            throw new Error("Error al obtener los productos. intente denuevo.")
        }

        const productos = await respuesta.json();

        const gridLibros = document.getElementById("grid_libros");
        const gridDiscos = document.getElementById("grid_discos");

        gridDiscos.innerHTML= "";
        gridLibros.innerHTML= "";

        productos.forEach((p) => {
            const id = p.id;
            const titulo = p.titulo ?? "Sin titulo";
            const precio = p.precio ?? "-";
            const imagen = p.imagen ?? "";
            const stock = p.stock ?? 0;
            

            const card = document.createElement("div");
            card.className = "producto-card"

            card.innerHTML = `
                <div class="contenedor_imagen_producto">
                    <img src="${imagen}" alt="${titulo}">
                </div>
                <div class="contenedor_cuerpo_producto">
                    <div class="producto_titulo">${titulo}</div>
                    <div class="producto_precio">${precio}</div>
                    <div class="producto_stock">stock: ${stock}</div>
                    <button class="producto_boton">Añadir al carrito</button>
                </div>
            `

            const boton = card.querySelector(".producto_boton");
            boton.addEventListener("click", () => {
                if (stock <= 0) {
                    alert("No hay stock disponible de este producto.")
                    return;
                }else{
                    const productoCarrito = {
                        id,
                        titulo,
                        precio: Number(precio),
                        imagen
                    }
                    
                    agregarAlCarrito(productoCarrito)
                }
            })

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
        const gridLibros = document.getElementById("grid_libros");
        const gridDiscos = document.getElementById("grid_discos");

        gridLibros.innerHTML ="<p>Error al cargar libros.</p>"
        gridDiscos.innerHTML ="<p>Error al cargar discos.</p>"
    }
}


document.addEventListener("DOMContentLoaded", cargarProductos);