import { Generos } from "../models/index.js";

export const getAllGenres = async (req, res) => {
    try {
        const generos = await Generos.findAll();

        if (!generos) {
            return res.status(400).json({ message: "No encontraron géneros." });
        }

        res.send(generos);
    } catch (error) {
        console.log(error);
    }
};
