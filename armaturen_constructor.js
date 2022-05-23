/**
 * 
 * 
 * 
B1.MEO.meo_96;Cluster1;meo_Type1;_BLR1;;Обратная связь. ИМ зоны 6;96;meo;;;;;;;PLC1;;;;;;meo_96;;;;"plc=index:22,channel:00/05/05;eu=units:%,format:###.#,min:-5,max:105"
B1.VFD.EI_71;Cluster1;VFD_1;_BLR1;;Шнеки щепы;71;vfd;;;;;;28;PLC1;;;;;;EI_71;;;;"plc=index:28,channel:00/06/03;eu=units:Гц,format:##.#,min:-2,max:65"
B1.Motor.M70;Cluster1;oldMotorType1;_BLR1;;Вентилятор охлаждения шнеков щепы;70;M;;;;;;;;;;;;;M70;;;;

 */

const fs = require('fs');
require('dotenv').config()

const EXPORT_PATH = "d:\\_proj\\Export\\"

const formVfdEquipmentString = ({ comment, plc, area, index, params, aiIndex }) => {
    //    { comment: "Общий шнек склада 2", index: "EY139", mixer: true, area: "_BLR1", plc: "PLC1", params: "plc=index:57,channel: 01/02/00;eu=units:Гц,format:##.#,min:-2,max:65" },
    return `${process.env.ZONE || "B1"}.VFD.EI_${index};Cluster1;VFD_1;${area || "_BLR1"};;${comment};${index};vfd;;;;;;${aiIndex};${plc || "PLC1"};;;;;;EI_${index};;;;${params || "plc=index:28,channel:00/06/03;eu=units:Гц,format:##.#,min:-2,max:65"}`
    //  return `${process.env.BLR}.AI.${_alias};Cluster1;AI_Type1;${_area || "_BLR1"};;${_comment};${_index};ai;;;;;;;${_plc || "PLC1"};;;;;;${_alias};;;;${_params || "plc=index:1,channel:00/03/00;eu=units:°С,format:###.#,min:-2,max:150"}`
}
const formVfdBolllpacks = ({ index }) => {
    return `EI_${index}_work = M${index}_1_val;		EI_${index}_run = MY${index}_5_val;`
}
const dataArray = require('./data/' + process.env.BLR + '/armaturen').vfds;
console.log(dataArray);

const equipmentVfds = dataArray
    .filter((vfd) => vfd && vfd.index)
    .map((vfd, index) => {
        return formVfdEquipmentString(vfd)
    })
const boolpackVfds = dataArray
    .filter((vfd) => vfd && vfd.index)
    .map((vfd, index) => {
        return formVfdBolllpacks(vfd)
    })

const motorsDataArray = require('./data/' + process.env.BLR + '/armaturen').motors;
console.log(motorsDataArray);

const equipmentCSVlist = equipmentVfds.join('\n') + '\n\n\n';
const boolpackList = boolpackVfds.join('\n') + '\n\n\n';

module.exports = (PLC) => {
    // fs.writeFileSync(EXPORT_PATH + 'armaturen_aliases' + PLC + '_new.xsy', result)
    fs.appendFileSync(EXPORT_PATH + 'eqipment' + PLC + '_new.csv', equipmentCSVlist)
    fs.appendFileSync(EXPORT_PATH + '_boolpack' + PLC + '.txt', boolpackList)

}