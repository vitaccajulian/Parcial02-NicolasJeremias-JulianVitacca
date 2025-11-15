
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

document.addEventListener("DOMContentLoaded", async() => {
    console.log("hola")
    let ruta_base = "";

    if (location.pathname.includes("/cliente/")){
        ruta_base = "../compartida/";
    }else{
        ruta_base = "compartida/";
    }

    await cargarElementos("#header", ruta_base + "header.html")
    await cargarElementos("#footer", ruta_base + "footer.html")

})