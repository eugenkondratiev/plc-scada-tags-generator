const dgs = [
    ["Управляющий сигнал  ПЧ общего шнека склада", "EY139"]
]
const motors = [

]

const meos = [

]

const vfds = [
    { comment: "Общий шнек склада 2", index: "139", aiIndex: "57", mixer: true, area: "_BLR1", plc: "PLC1", params: "plc=index:57,channel: 01/02/00;eu=units:Гц,format:##.#,min:-2,max:65" },

]

/**
 * 
 * 
 * 

B1.MEO.meo_96;Cluster1;meo_Type1;_BLR1;;Обратная связь. ИМ зоны 6;96;meo;;;;;;;PLC1;;;;;;meo_96;;;;"plc=index:22,channel:00/05/05;eu=units:%,format:###.#,min:-5,max:105"
B1.VFD.EI_71;Cluster1;VFD_1;_BLR1;;Шнеки щепы;71;vfd;;;;;;28;PLC1;;;;;;EI_71;;;;"plc=index:28,channel:00/06/03;eu=units:Гц,format:##.#,min:-2,max:65"
B1.Motor.M70;Cluster1;oldMotorType1;_BLR1;;Вентилятор охлаждения шнеков щепы;70;M;;;;;;;;;;;;;M70;;;;

 */
module.exports = {
    dgs,
    motors,
    meos,
    vfds,
}