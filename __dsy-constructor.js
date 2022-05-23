const formAIs = require('./dsy-ai-contructor')
const formDIs = require('./dsy-di-contructor')
const formAOs = require('./dsy-ao-contructor')
const formDOs = require('./dsy-do-contructor')
require('dotenv').config();

const PLC = process.env.PLC;

function main (){

    formAIs(PLC);
    formDIs(PLC);
    formAOs(PLC);
    formDOs(PLC);
}



main()
