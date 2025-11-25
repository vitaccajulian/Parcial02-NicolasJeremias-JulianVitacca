import puppeteer from "puppeteer";
const TICKET_URL = 'http://127.0.0.1:5500/frontend/cliente/carrito.html' // Esta pagina hay que obtenerla por parametros

async function downloadTicket(req, res) {

    let html = req.path

    const browser = await puppeteer.launch({
        headless: true,
    });

     const page = await browser.newPage();

     await page.setContent(html);
}
// HAY QUE MODIFICAR EL FRONT PARA QUE ENVIE DATOS POR PARAMETRO PARA PODER IMPRIMIR
// Pasar los datos desde Node al DOM
// Podés hacer algo como:

// await page.evaluate((detalle) => {
//     window.__DETALLE__ = detalle;
// }, req.body.detalle);

// Y tu JS del frontend:

// const productos = window.__DETALLE__;
// renderProductos(productos);

export async function generatePdf(req, res) {
    try {

        const browser = await puppeteer.launch({
            headless: true,
        });

        const page = await browser.newPage();

        await page.goto(TICKET_URL, { waitUntil: "networkidle2" });

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "20px",
                bottom: "20px",
                right: "20px",
                left: "20px",
            },
        });

        res.set({
            "Content-Type": "Application/pdf",
            "Content-Disposition": `attachment; filename="${url}.pdf"`,
        });

        res.send(pdfBuffer);
    } catch (error) {
        console.log(error);
    }
}