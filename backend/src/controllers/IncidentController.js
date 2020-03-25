const connection = require('../database/connection');

module.exports = {

    async index(req, res) {

        const { page = 1 } = req.query; // parametros da rota

        // retorna o total de casos cadastrados no cabecalho da resposta
        const [count] = await connection('incidents').count();

        console.log(count);

        const incidents = await connection('incidents')
            .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
            .limit(5)
            .offset((page - 1) * 5) // paginacao
            .select([
                'incidents.*', 
                'ongs.name', 
                'ongs.email', 
                'ongs.whatsapp', 
                'ongs.city', 
                'ongs.uf'
             ]);

        res.header('X-Total-Count', count['count(*)']);

        return res.json(incidents);
    },

    async create(req, res) {
        const { title, description, value } = req.body;

        // recebido atraves do cabecalho da requisicao
        const ong_id = req.headers.authorization;

        const [id] = await connection('incidents').insert({
            title, 
            description,
            value, 
            ong_id
        });

        return res.json({ id });
    },

    async delete(req, res) {
        const { id } = req.params;
        
        // recebido atraves do cabecalho da requisicao
        const ong_id = req.headers.authorization;

        const incident = await connection('incidents')
            .where('id', id)
            .select('ong_id')
            .first();

        if (incident.ong_id !== ong_id) {
            return res.status(401).json({ error: 'Operation not permited.'});
        }

        await connection('incidents').where('id', id).delete();

        // 204 - no content
        return res.status(204).send();
    }
};