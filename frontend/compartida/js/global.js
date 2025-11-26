async function cargarElementos(elemento, ruta) {
    const contenedor = document.querySelector(elemento);
    if (!contenedor) return

    try{
        const res = await fetch(ruta)
        const html = await res.text()
        contenedor.innerHTML = html;
    }catch (e){
        console.error("Error cargando el elemento: ", ruta, e)
    }
}


function botonCarrito(){
    const boton_carrito = document.getElementById("btnCarrito")
    if(!boton_carrito) return;

    boton_carrito.addEventListener("click", ()=>{
        window.location.href = "/frontend/cliente/carrito.html"
    })
}

document.addEventListener("DOMContentLoaded", async() => {

    let ruta_base = "";

    if (location.pathname.includes("/cliente/")){
        ruta_base = "../compartida/";
    }else{
        ruta_base = "compartida/";
    }

    await cargarElementos("#header", ruta_base + "header.html")
    await cargarElementos("#footer", ruta_base + "footer.html")

    botonCarrito()


    /*funciones para cambiar de tema */

    const boton_tema = document.getElementById("boton_tema")
    const body = document.body

    const tema_guardado = localStorage.getItem("tema")

    
    if (tema_guardado === "oscuro") {
        body.classList.add("tema_oscuro");
        boton_tema.textContent = "☀ Activar Modo claro";
        console.log("tema_oscuro");
    } else {
        boton_tema.textContent = "🌙 Activar Modo oscuro";
        console.log("tema_claro");
    }
    
    boton_tema.addEventListener("click", () => {
        const usa_tema_oscuro = body.classList.contains("tema_oscuro")

        if(usa_tema_oscuro){  //aca pregunto si la clase ya tiene el tema oscuro puesto. de ser asi, tengo que pasar a tema claro. porque toco denuevo boton.  
            body.classList.remove("tema_oscuro");
            localStorage.setItem("tema", "claro");    
            boton_tema.textContent = "🌙 Activar Modo oscuro"; 
        } else {   
            body.classList.add("tema_oscuro");
            localStorage.setItem("tema", "oscuro");  
            boton_tema.textContent = "☀ Activar Modo claro";  
        }
    })

    

})