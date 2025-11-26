import puppeteer from "puppeteer";
const BASE_URL = "http://localhost:3000";

export async function generatePdf(req, res) {
    const { id } = req.params;

    try {

        const browser = await puppeteer.launch({
            headless: true,
        });

        const page = await browser.newPage();

        const TICKET_URL = `${BASE_URL}/api/ventas/ticket/${id}`

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
            "Content-Disposition": `attachment; filename="${id}.pdf"`,
        });

        res.send(pdfBuffer);
    } catch (error) {
        console.log(error);
    }
}