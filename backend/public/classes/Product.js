import { updateButtonUI } from "../script/updateButton.js";

export class Product {

    /**
     * @param {Number} id 
     * @param {String} tittle 
     * @param {Number} price 
     * @param {String} category 
     * @param {Number} stock 
     * @param {String} image 
     * @param {Boolean} status 
     */
    constructor(id, tittle, price, image, stock, status, category) {
        this.id = id;
        this.tittle = tittle;
        this.price = price;
        this.image = image;
        this.stock = stock;
        this.status = status;
        this.category = category;
    }

    getId() {
        return this.id
    }

    setId(nuevoId) {
        this.id = nuevoId;
    }

    getPrice() {
        return this.price;
    }

    setPrice(newPrice) {
        this.price = newPrice;
    }

    getCategory() {
        return this.category
    }

    setCategory(newCategory) {
        this.category = newCategory;
    }

    getStock() {
        return this.stock;
    }

    setStock(newStock) {
        this.stock = newStock;
    }

    getImage() {
        return this.image;
    }

    setImage(newImage) {
        this.image = newImage;
    }

    getStatus() {
        return this.status;
    }

    setStatus() {
        this.status = !this.status;
    }

    toHTML() {
        const card = document.createElement("div");
        card.classList.add("card", "m-3");
        card.style.width = "18rem";
        card.id = "cardId"

        const img = document.createElement("img");
        img.src = this.image;
        img.alt = this.tittle;
        img.classList.add("card-img-top");

        const body = document.createElement("div");
        body.classList.add("card-body");

        const title = document.createElement("h5");
        title.classList.add("card-title");
        title.textContent = this.tittle;

        const price = document.createElement("p");
        price.classList.add("card-text");
        price.textContent = `$${this.price}`;

        const btn = document.createElement("a");
        const deleteBtn = document.createElement('a');

        btn.href = "#";
        btn.classList.add("btn", "btn-secondary", "m-2");
        btn.textContent = "Modificar";
        btn.dataset.id = this.id;
        btn.addEventListener("click", (event => {
            window.location.href = `./editar/${this.id}`;
        }))

        deleteBtn.href = "#"
        deleteBtn.dataset.id = this.id;
        deleteBtn.classList.add("btn")
        updateButtonUI(deleteBtn, this.status)
        
        deleteBtn.addEventListener("click", async (event) => {
            event.preventDefault();
            this.setStatus(); // Cambia el estado del producto(this)
            
            let mensaje = updateButtonUI(deleteBtn, this.status)
            console.log("boton")
            try {
                
                const response = await fetch(`/admin/disable/${this.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                })
                
                if(!response.ok){
                    const errorText = await response.text();
                    throw new Error(`Error ${response.status}: ${errorText}`);
                }

                Swal.fire({
                    icon: "success",
                    title: `¡Producto ${mensaje}!`,
                    confirmButtonColor: "#3085d6"
                });
                
            
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Error al actualizar",
                    text: error.message,
                    confirmButtonColor: "#d33"
                });
                console.error("Error al actualizar:", error);
            }
        })

        body.appendChild(title);
        body.appendChild(price);
        body.appendChild(btn);
        body.appendChild(deleteBtn)
        card.appendChild(img);
        card.appendChild(body);
        return card;
    }

    toString() {
        return `
            ID: ${this.id}, 
            Nombre: ${this.tittle}, 
            Precio: ${this.price}, 
            Categoria: ${this.category}, 
            Stock: ${this.stock}, 
            Imagen: ${this.image}, 
            Estado: ${((this.status) ? "Activo" : "Inactivo")}
        `;
    }
}