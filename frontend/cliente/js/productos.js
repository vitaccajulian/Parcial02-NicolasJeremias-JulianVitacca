const nombre = localStorage.getItem("usuario");
document.getElementById("nombre_usuario").textContent= nombre || "invitado"


const api_url = "http://localhost:3000/api/productos"
const BACKEND_URL = "http://localhost:3000";

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

function productoEnCarrito(id){
    const carrito = obtenerCarrito()
    return carrito.some(item => item.id === id)
}


function actualizarBotonesCarrito(){
    const carrito = obtenerCarrito()

    document.querySelectorAll(".producto_card").forEach(card => {
        const id_card = Number(card.dataset.id)
        const boton_eliminar = card.querySelector(".producto_boton_eliminar")

        if(!boton_eliminar) return

        const en_carrito = carrito.some(item => item.id === id_card)

        if(en_carrito){
            boton_eliminar.classList.remove("oculto");
        }else{
            boton_eliminar.classList.add("oculto");
        }
    })
}


//modal
const modal = document.getElementById("modal_producto")
const modal_imagen = document.getElementById("modal_imagen")
const modal_titulo = document.getElementById("modal_titulo")
const modal_cantidad = document.getElementById("modal_cantidad_item")
const modal_btn_sumar = document.getElementById("modal_sumar")
const modal_btn_restar = document.getElementById("modal_restar")
const modal_btn_eliminar = document.getElementById("modal_eliminar")
const modal_btn_guardar = document.getElementById("modal_guardar")
const modal_btn_cerrar = document.getElementById("modal_cerrar")

let modal_producto_actual = null

function abrirModalProducto(producto){
    modal_producto_actual = producto

    const carrito = obtenerCarrito()
    const existente = carrito.find(item => item.id === producto.id)

    const cantidad_inicial = existente ? existente.cantidad : 1

    modal_titulo.textContent = producto.titulo
    modal_imagen.src =`${BACKEND_URL}/${producto.imagen}`
    modal_imagen.alt = producto.titulo
    modal_cantidad.textContent = cantidad_inicial

    if(existente){
        modal_btn_eliminar.classList.remove("oculto")
    }else{
        modal_btn_eliminar.classList.add("oculto")
    }

    modal.classList.remove("oculto")
}


function cerrarModalProducto(){
    console.log("tocaron cerrar")
    modal.classList.add("oculto")
    modal_producto_actual = null
}

modal_btn_sumar.addEventListener("click", () =>{
    let cant = Number(modal_cantidad.textContent)
    modal_cantidad.textContent = cant + 1
})

modal_btn_restar.addEventListener("click", () =>{
    let cant = Number(modal_cantidad.textContent)

    if (cant > 1){
        modal_cantidad.textContent = cant - 1
    }else{
        alert("La cantidad mínima es 1. Si querés quitar el producto, usá Eliminar.");
    }
})

//si hace click en cerrar
modal_btn_cerrar.addEventListener("click", cerrarModalProducto)

modal.addEventListener("click", (e) => {
    if(e.target === modal){
        cerrarModalProducto()
    }
})

//si hace click en eliminar
modal_btn_eliminar.addEventListener("click" , () =>{
    if(!modal_producto_actual) return

    let carrito = obtenerCarrito()
    carrito = carrito.filter(item => item.id !== modal_producto_actual.id)
    guardarCarrito(carrito)

    actualizarBotonesCarrito();

    alert(`Se elimino "${modal_producto_actual.titulo}" del carrito.`);
    cerrarModalProducto()
})

//si hace click en guardar
modal_btn_guardar.addEventListener("click", ()=>{
    if(!modal_producto_actual) return

    const cantidad_elegida = Number(modal_cantidad.textContent)
    let carrito = obtenerCarrito()

    const index = carrito.findIndex(item => item.id === modal_producto_actual.id)

    if(index === -1){ //osi no esta lo agrego
        carrito.push({
            id: modal_producto_actual.id,
            titulo: modal_producto_actual.titulo,
            precio: modal_producto_actual.precio,
            imagen: modal_producto_actual.imagen,
            cantidad: cantidad_elegida
        })
    }else{
        carrito[index].cantidad = cantidad_elegida
    }

    guardarCarrito(carrito);
    actualizarBotonesCarrito();

    alert(`Se guardó "${modal_producto_actual.titulo}" en el carrito.`);
    cerrarModalProducto();
})



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
            card.className = "producto_card"
            card.dataset.id = id

            console.log(`${BACKEND_URL}/${imagen}`);

            card.innerHTML = `
                <div class="contenedor_imagen_producto">
                    <img src="${BACKEND_URL}/${imagen}" alt="${titulo}">
                </div>
                <div class="contenedor_cuerpo_producto">
                    <div class="producto_titulo">${titulo}</div>
                    <div class="producto_precio">${precio}</div>
                    <div class="producto_stock">stock: ${stock}</div>
                    <div class="producto_botones">
                        <button class="producto_boton_agregar">Añadir al carrito</button>
                        <button class="producto_boton_eliminar oculto">Eliminar del carrito</button>
                    </div>
                </div>
            `

            const boton_agregar = card.querySelector(".producto_boton_agregar")

            boton_agregar.addEventListener("click", () =>{
                if(stock <= 0){
                    alert("No hay stock disponible de este producto")
                    return
                }

                const producto_carrito = {
                    id,
                    titulo,
                    precio: Number(precio),
                    imagen
                }

                abrirModalProducto(producto_carrito)
            })

            const btn_eliminar = card.querySelector(".producto_boton_eliminar")

            btn_eliminar.addEventListener("click", () => {
                let carrito = obtenerCarrito()
                carrito = carrito.filter(item => item.id !== id)
                guardarCarrito(carrito)
                alert(`Se elimino del carrito.`);
                actualizarBotonesCarrito()
                
            })

            const tipo_producto = p["categoria.nombre"].toLowerCase();
            const es_libro = tipo_producto === "libro";
            const es_disco = tipo_producto === "disco";


            if (es_disco){
                gridDiscos.appendChild(card);
            } else if (es_libro){
                gridLibros.appendChild(card);
            }

            actualizarBotonesCarrito()

        });

    }catch (error){
        console.log(error);
        const gridLibros = document.getElementById("grid_libros");
        const gridDiscos = document.getElementById("grid_discos");

        gridLibros.innerHTML ="<p>Error al cargar libros.</p>"
        gridDiscos.innerHTML ="<p>Error al cargar discos.</p>"
    }
}


//inicial
document.addEventListener("DOMContentLoaded", cargarProductos);