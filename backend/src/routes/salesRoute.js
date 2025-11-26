import express from 'express';
import { getSales, getOneSale, createSale, renderTicket} from '../controllers/salesController.js';

const router = express.Router();

// Obtener todos las ventas
router.get('/', getSales);

// Obtener venta por id
router.get('/:id', getOneSale)

// Registrar una venta en BBDD
router.post('/', createSale)

// Ticket
router.get('/ticket/:id', renderTicket)

export default router;