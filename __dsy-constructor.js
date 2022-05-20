const formAIs = require('./dsy-ai-contructor')
const formDIs = require('./dsy-di-contructor')
const formAOs = require('./dsy-ao-contructor')
const formDOs = require('./dsy-do-contructor')

const PLC = "4";

function main (){

    formAIs(PLC);
    formDIs(PLC);
    formAOs(PLC);
    formDOs(PLC);
}



main()
