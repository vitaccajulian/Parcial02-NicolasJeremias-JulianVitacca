export const updateButtonUI = (buttonElement, status) => {
    let txtBtn;

    // Para evitar conflictos se borran ambas clases
    buttonElement.classList.remove("btn-danger", "btn-outline-danger");

    if (status) {

        txtBtn = "Desactivar";
        buttonElement.classList.add("btn-danger");

    } else {

        txtBtn = "Activar";
        buttonElement.classList.add("btn-outline-danger");

    }
    buttonElement.textContent = txtBtn;
    
    return (status) ? "Activado" : "Desactivado"
};