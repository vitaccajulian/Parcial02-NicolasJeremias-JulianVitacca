const nombreTicket = localStorage.getItem("usuario");
const spanNombreTicket = document.getElementById("nombre_usuario")


function cargarTicket(){
    const ticketGuardado = localStorage.getItem("ultimoTicket")
    const contenedorDetalle = document.getElementById("ticket_detalle")
    const ticketTotal = document.getElementById("ticket_total")
    const ticketFecha = document.getElementById("ticket_fecha")

    if (!contenedorDetalle || !ticketTotal || !ticketFecha) return;

    if(!ticketGuardado){
        contenedorDetalle.innerHTML = "<p>No hay ninguna compra para mostrar.</p>"
        ticketTotal.textContent = "0"
        ticketFecha =""
        return
    }

    let ticket

    try{
        ticket = JSON.parse(ticketGuardado)
    }catch(e){
        console.log("error al parsear el ticket", e)
        contenedorDetalle.innerHTML = "<p>Error al mostrar el ticket</p>"
        ticketTotal.textContent = "0"
        return
    }

    ticketFecha.textContent = `Fecha: ${ticket.fecha}`;

    let html = "<ul>"

    ticket.items.forEach(item => {
        const subtotal = Number(item.precio) * Number(item.cantidad)
        html += `
            <li>
                ${item.titulo} - Cantidad: ${item.cantidad} - Precio: $${item.precio} - Subtotal: $${subtotal}
            </li>
        `;
    });

    html += "</ul>"

    contenedorDetalle.innerHTML = html
    ticketTotal.textContent = ticket.total
}

document.addEventListener("DOMContentLoaded", cargarTicket)