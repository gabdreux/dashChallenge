const fs = require("fs");
const { parse } = require("csv-parse");
const Queue = require('async/queue');
const { dbConnection } = require('../db/connection');

const MAX_CONCURRENT_TASKS = 100;
const columns = [
    "DATA",
    "HORA",
    "DIA",
    "MES",
    "UF",
    "ESTADO",
    "ALO",
    "CPC",
    "CPCA",
    "PP",
    "CLIENTE_NAO_ESTA",
    "CLIENTE_NAO_VALIDOU",
    "DESCONHECE",
    "DESCONHECE_DIVIDA",
    "FALECIDO",
    "FONE_MUDO",
    "LIG_PERDIDA",
    "PREVENTIVO",
    "RECADO",
    "ALEGA",
    "RETORNO_AGENDADO",
    "DADOS_INVALIDOS",
    "SEM_INTERESSE",
    "NAO_TABULADA",
    "RETORNO_INDIRETO",
    "FRAUDE",
    "OCUPADO",
    "RECEPT",
    "PROCESSO_JURIDICO",
    "CONTESTACAO",
    "VALOR",
    "TIPO",
    "PRODUTO"
];

const isNumeric = function (str) {
    if (typeof str !== "string") return false;
    return !isNaN(str) && !isNaN(parseFloat(str));
};

const parseToAValidNumber = function (value) {
    if (value === 'NULL') return null;

    if (typeof (value) === 'string' && value.includes(',')) {
        return parseFloat(value.replace(',', '.'));
    } else {
        return isNumeric(value)
            ? parseInt(value)
            : value;
    }
};

const convertDate = function (row) {
    const [day, month, year] = row.DATA.split('/');
    const date = new Date(+year, month - 1, +day);
    return { ...row, DATA: date }
}

const treatRowData = function (row) {
    const rowToInsert = columns
        .map((col, index) => {
            let value = parseToAValidNumber(row[index]);
            return [col, value];
        })
        .reduce((acc, cur) => {
            return { ...acc, [cur[0]]: cur[1] }
        }, {})

    return convertDate(rowToInsert);
};

const dataQueue = Queue(function (row, complete) {
    setTimeout(async () => {
        const db = dbConnection();
        await db('base').insert(row);
        complete(null, { row });
    }, 5000)
}, MAX_CONCURRENT_TASKS);


(async function main() {
    const knex = dbConnection();

    await knex.raw(`
        CREATE TABLE \`base\` (
            \`DATA\` timestamp NULL DEFAULT NULL,
            \`HORA\` int DEFAULT NULL,
            \`DIA\` int DEFAULT NULL,
            \`MES\` int DEFAULT NULL,
            \`UF\` text,
            \`ESTADO\` text,
            \`ALO\` int DEFAULT NULL,
            \`CPC\` int DEFAULT NULL,
            \`CPCA\` int DEFAULT NULL,
            \`PP\` int DEFAULT NULL,
            \`CLIENTE_NAO_ESTA\` int DEFAULT NULL,
            \`CLIENTE_NAO_VALIDOU\` int DEFAULT NULL,
            \`DESCONHECE\` int DEFAULT NULL,
            \`DESCONHECE_DIVIDA\` int DEFAULT NULL,
            \`FALECIDO\` int DEFAULT NULL,
            \`FONE_MUDO\` int DEFAULT NULL,
            \`LIG_PERDIDA\` int DEFAULT NULL,
            \`PREVENTIVO\` int DEFAULT NULL,
            \`RECADO\` int DEFAULT NULL,
            \`ALEGA\` int DEFAULT NULL,
            \`RETORNO_AGENDADO\` int DEFAULT NULL,
            \`DADOS_INVALIDOS\` int DEFAULT NULL,
            \`SEM_INTERESSE\` int DEFAULT NULL,
            \`NAO_TABULADA\` int DEFAULT NULL,
            \`RETORNO_INDIRETO\` int DEFAULT NULL,
            \`FRAUDE\` int DEFAULT NULL,
            \`OCUPADO\` int DEFAULT NULL,
            \`RECEPT\` int DEFAULT NULL,
            \`PROCESSO_JURIDICO\` int DEFAULT NULL,
            \`CONTESTACAO\` int DEFAULT NULL,
            \`VALOR\` float DEFAULT NULL,
            \`TIPO\` text,
            \`PRODUTO\` text
        ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
    `);

    fs.createReadStream("./data_tim.csv")
        .pipe(parse({ delimiter: ",", from_line: 2 }))
        .on("data", async function (row) {
            const valueToInsert = treatRowData(row);
            console.log('processing: ', valueToInsert);
            dataQueue.push(valueToInsert, function (_error, { row }) {
                console.log("===========> processed item ", JSON.stringify(row));
            });
        })
        .on("end", function () {
            console.log("finished");
        })
        .on("error", function (error) {
            console.log(error.message);
        });
})();

