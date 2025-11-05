
document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("usuario")
    const boton = document.getElementById("boton_continuar")


    boton.addEventListener("click", () => {
        const nombre = input.value.trim();

        if (!nombre){
            alert("Atencion, debe ingresar su nombre si quiere continuar.")
            return;
        }

        localStorage.setItem("usuario", nombre);

        window.location.href = "productos.html"


    })

});