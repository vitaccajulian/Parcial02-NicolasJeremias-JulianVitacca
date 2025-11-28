import multer from 'multer';
import path from 'path';
import fs from 'fs';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const DESTINO_ABSOLUTO = path.join(__dirname, '..', '..', 'public', 'img', 'productos');

// Se verifica que la carpeta exista si Multer no la crea automáticamente
if (!fs.existsSync(DESTINO_ABSOLUTO)) {
    fs.mkdirSync(DESTINO_ABSOLUTO, { recursive: true });
}

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        // Multer lo guarda aquí directamente
        cb(null, DESTINO_ABSOLUTO);
    },
    filename: (req, file, cb) => {

        /* Genera el nombre final limpio */

        let name;
        // Tomamos extension del nombre original
        const ext = path.extname(file.originalname);

        // Si modificamos producto existe un id previo.
        if (req.params.id) {
            const moddedId = String(req.params.id).padStart(3, "0");
            name = `CIL${moddedId}${ext}`;
        } else {
            // Si creamos un producto nuevo, usamos un nombre temporal
            name = `temp_${Date.now()}${ext}`;
        }
        console.log(name)
        cb(null, name);
    }
});

// Exportamos el middleware configurado
export const upload = multer({ storage: storage });
