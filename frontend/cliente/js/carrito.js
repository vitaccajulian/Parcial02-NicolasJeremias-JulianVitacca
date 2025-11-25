const nombre = localStorage.getItem("usuario");
document.getElementById("nombre_usuario").textContent= nombre || "invitado"

const BACKEND_URL = "http://localhost:3000";


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


function calcularTotal(carrito){
    let total = 0;
    for(const item of carrito){
        total += Number(item.precio) * Number(item.cantidad);
    }
    return total
}

function renderizarCarrito(){
    const contenedor = document.getElementById("lista_carrito")
    const spanTotal = document.getElementById("total_carrito")

    const carrito = obtenerCarrito()

    if (carrito.length === 0){
        contenedor.innerHTML = `<p class="carrito_vacio">Tu carrito esta vacio</p>`
        spanTotal.textContent = "0";
        return
    }

    let html = "";

    carrito.forEach(item => {
        const subtotal = Number(item.precio) * Number(item.cantidad)

        console.log(`${item.imagen}`)

        html += `
            <div class="carrito_item" producto_id="${item.id}">
                <div class="carrito__item_imagen">
                    <img src="${BACKEND_URL}/${item.imagen}" alt="${item.titulo}">
                </div>
                <div class="carrito__item_info">
                    <h3>${item.titulo}</h3>
                    <p>Precio: $ ${item.precio}</p>

                    <div class="carrito__item_cantidad">
                        <button class="boton_restar">-</button>
                        <span class="cantidad_valor">${item.cantidad}</span>
                        <button class="boton_sumar">+</button>

                        <p>Subtotal: $ ${subtotal}</p>

                        <button class="boton_eliminar">Eliminar Producto</button>
                    </div>
                </div>
            </div>
        `
    });

    contenedor.innerHTML = html;

    const total = calcularTotal(carrito);
    spanTotal.textContent = total;
}


function modificarCantidad(idProducto, accion){
    idProducto = Number(idProducto)
    const carrito = obtenerCarrito()
    const index = carrito.findIndex(item => item.id === idProducto)

    //console.log(idProducto)
    //console.log(carrito)
    //console.log(index)

    if(index === -1) return;

    const nueva_cantidad = carrito[index].cantidad + accion

    if (nueva_cantidad < 1) {
        alert("No puede poner cantidad 0. Si desea quitarlo, presione eliminar.")
        return
    }

    carrito[index].cantidad = nueva_cantidad;

    guardarCarrito(carrito);
    renderizarCarrito();
}

function eliminarProducto(idProducto){
    idProducto = Number(idProducto)
    let carrito = obtenerCarrito();
    carrito = carrito.filter(item => item.id !== idProducto)
    guardarCarrito(carrito)
    renderizarCarrito();
}


document.addEventListener("DOMContentLoaded", () =>{

    const contenedor = document.getElementById("lista_carrito");
    const boton_finalizar = document.getElementById("boton_finalizar");

    renderizarCarrito()

    if(contenedor){
        contenedor.addEventListener("click", (e) =>{
            const articulo = e.target.closest(".carrito_item")

            if(!articulo) return;

            const idProducto = articulo.getAttribute("producto_id")


            if(e.target.classList.contains("boton_sumar")){
                modificarCantidad(idProducto, +1)
            }

            if(e.target.classList.contains("boton_restar")){
                modificarCantidad(idProducto, -1)
            }

            if(e.target.classList.contains("boton_eliminar")){
                eliminarProducto(idProducto)
            }
        })
    }


    if(boton_finalizar){
        boton_finalizar.addEventListener("click", ()=>{
            const carrito = obtenerCarrito();
            if(carrito.length === 0){
                alert("Tu carrito esta vacio")
                return
            }

            const total = calcularTotal(carrito);
            const ticket = {
                fecha: Date().toString(),
                items: carrito,
                total
            }

            localStorage.setItem("ultimoTicket", JSON.stringify(ticket));
            localStorage.removeItem("carrito");

            window.location.href = "ticket.html"

        })
    }

})