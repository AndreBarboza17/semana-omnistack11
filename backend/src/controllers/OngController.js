const crypto = require('crypto');
const connection = require('../database/connection');

module.exports = {

    async index (req, res){
        
        const ongs = await connection('ongs').select('*');

        return res.json(ongs);

    },

    async create(req, res) {
        const { name, email, whatsapp, city, uf } = req.body;

        //obtem 4 ytes de caracteres e converte em HEXADECIMAL
        const id = crypto.randomBytes(4).toString('HEX');

        await connection('ongs').insert({
            id, 
            name, 
            email, 
            whatsapp, 
            city, 
            uf,
        });

        // console.log(data);

        return res.json({ id });
    }
};