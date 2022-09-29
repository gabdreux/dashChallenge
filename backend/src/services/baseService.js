const knex = require('../../../config/database');

const PRODUCT_TYPES = [
    'OUTROS',
    'old',
    'FIXO',
    'WTTX',
    'WEB',
    'POS_PURO',
    'CONTROLE'
];

class ProductTypeError extends Error {
    constructor(message) {
        super();
        this.message = message;
    }
}

module.exports = {
    async list({ state, startDate, endDate, productType }) {
        const query = knex('base');

        if (state) { query.where({ UF: state }); }
        if (startDate && endDate) {
            query
                .where('DATA', '>=', startDate)
                .where('DATA', '<=', endDate);
        }
        if (productType && PRODUCT_TYPES.includes(productType)) {
            query.where({ PRODUTO: productType })
        }
        if (productType && !PRODUCT_TYPES.includes(productType)) {
            throw new ProductTypeError(`productType is invalid. Must be one of ${PRODUCT_TYPES.join(', ')}`);
        }

        const results = await query;

        return results;
    },
    async aggregate({ state, startDate, endDate, productType }) {

    }
};