import express from 'express';
import { getSales, getOneSale, createSale, renderTicket} from '../controllers/salesController.js';
import { generatePdf } from '../middleware/downloadTicket.js';
import { generateSale } from '../middleware/generateSale.js';

const router = express.Router();

// Obtener todos las ventas
router.get('/', getSales);

// Obtener venta por id
router.get('/:id', getOneSale)

// Registrar una venta en BBDD
router.post('/', generateSale, createSale)

// Ticket
router.get('/ticket/:id', renderTicket)

// Ticket PDF
router.get('/ticket/:id/pdf', generatePdf);

export default router;