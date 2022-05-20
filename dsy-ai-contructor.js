const fs = require('fs');
require('dotenv').config()

const EXPORT_PATH = "d:\\_proj\\Export\\"

const HEADER = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <VariablesExchangeFile>
    	<fileHeader company="Schneider Automation" product="Unity Pro XL V11.0 - 151207" dateTime="date_and_time#2022-3-15-1:11:4" content="Variable source file" DTDVersion="41"></fileHeader>
	<contentHeader name="Project" version="0.0.17" dateTime="date_and_time#2022-3-5-22:29:13"></contentHeader>
	<dataBlock>
		<variables name="AIs" typeName="ARRAY[1..80] OF AI" topologicalAddress="%MW100">
			<attribute name="TimeStampSource" value="0"></attribute>\n`
const FOOTER = `	</dataBlock>
<DDTSource DDTName="AI" version="0.10" dateTime="dt#2013-07-01-15:24:38">
    <attribute name="TypeSignatureCheckSumString" value="6472"></attribute>
    <structure>
        <variables name="Value" typeName="REAL">
            <comment>   --- Ïðåîáðàçîâàííîå çíà÷åíèå äèñêðåòíîãî âõîäà</comment>
        </variables>
        <variables name="err" typeName="INT">
            <comment>   --- êîä îøèáêè: 3 = &lt;4mA; 5 = &gt;20mA; 9 = íåïðàâèëüíî çàäàíû ïðåäåëû çíà÷åíèÿ âõîäà äî ïðåîáðàçîâàíèÿ</comment>
        </variables>
        <variables name="Filter_N" typeName="INT">
            <comment>   --- Êîëè÷åñòâî çíà÷åíèé äëÿ ðàñ÷¸òà ñêîëüçÿùåãî ñðåäíåãî</comment>
        </variables>
        <variables name="Value_min" typeName="REAL">
            <comment>   --- Ìèíèìàëüíîå çíà÷åíèå øêàëû ïðåîáðàçîâàíîãî ïàðàìåòðà</comment>
        </variables>
        <variables name="Value_max" typeName="REAL">
            <comment>   --- Ìàêñèìàëüíîå çíà÷åíèå øêàëû ïðåîáðàçîâàííîãî ïàðàìåòðà</comment>
        </variables>
        <variables name="LLow" typeName="REAL">
            <comment>   --- Ìèíèìàëüíîå àâàðèéíîå çíà÷åíèå</comment>
        </variables>
        <variables name="Low" typeName="REAL">
            <comment>   --- Ìèíèìàëüíîå çíà÷åíèå</comment>
        </variables>
        <variables name="High" typeName="REAL">
            <comment>   --- Ìàêñèìàëüíîå çíà÷åíèå</comment>
        </variables>
        <variables name="HHigh" typeName="REAL">
            <comment>   --- Ìàêñèìàëüíîå àâàðèéíîå çíà÷åíèå</comment>
        </variables>
        <variables name="AI_Value" typeName="INT">
            <comment>   --- Çíà÷åíèå âõîäà äî ïðåîáðàçîâàíèÿ</comment>
        </variables>
        <variables name="Value_2" typeName="INT">
            <comment>   --- ðåçåðâ</comment>
        </variables>
    </structure>
</DDTSource>
</VariablesExchangeFile>
`
const VAR_TYPE = "AI"
const formEquipmentString = ({ _comment, _alias, _plc, _area, _index, _params }) => {

    return `B1.AI.${_alias};Cluster1;AI_Type1;${_area || "_BLR1"};;${_comment};${_index};ai;;;;;;;${_plc || "PLC1"};;;;;;${_alias};;;;${_params || "plc=index:1,channel:00/03/00;eu=units:°С,format:###.#,min:-2,max:150"}`
}


const formAliasString = (index, alias, comment) => `\t\t<instanceElementDesc name="[${index + 1}]">
\t\t<comment>${comment}</comment>
\t\t\t<attribute name="Alias" value="${alias}"></attribute>
\t\t</instanceElementDesc>`

const formVariablsString = (alias, comment) => `\t\t<variables name="${alias}" typeName="${VAR_TYPE}">
\t\t\t<comment>${comment}</comment>
\t\t</variables>`


const formatAlias = (_alias) => {
    return _alias
        .replace(".5", '')
        .replace(/[\.\s]/, '_')
}


const dataArray = require('./data/' + process.env.BLR + '/ais');
const equipmentArray = dataArray
    .filter(([_comment, _alias]) => _alias)
    .map(([_comment, _alias, _plc, _area, _index, _params], index) => {
        if (!_alias) return ""
        const newAlias = formatAlias(_alias)

        return formEquipmentString({ _comment, _alias: newAlias, _plc, _area, _index, _params })
    })


const aliasesArray = dataArray
    // .filter(([_comment, _alias]) => _alias)
    .map(([_comment, _alias], index) => {
        // console.log("_comment, _alias  - ", _comment, _alias);
        // if (!_alias) console.log("NOT ALIAS");
        // /
        if (!_alias) return ""
        const newAlias = formatAlias(_alias)
        if (!newAlias) console.log("_comment, _alias  - ", _comment, _alias);
        return formAliasString(index, newAlias, _comment)
    })

const varsArray = dataArray
    .filter(([_comment, _alias]) => _alias)
    .map(([_comment, _alias], index) => {
        if (!_alias) return
        const newAlias = formatAlias(_alias)
        return formVariablsString(newAlias, _comment)
    })

const result = HEADER + aliasesArray.join('\n') + '\n\t</variables>\n' + varsArray.join('\n') + '\n\t' + FOOTER
// console.log(aliasesArray);
// console.log(varsArray);
const equipmentCSVlist = equipmentArray.join('\n') + '\n\n\n';

module.exports = (PLC) => {

    fs.writeFileSync(EXPORT_PATH + 'ai_aliases' + PLC + '_new.xsy', result
        // , (err) => { if (err) console.log(err.message); }
    )
    fs.appendFileSync(EXPORT_PATH + 'eqipment' + PLC + '_new.csv', equipmentCSVlist)

    // fs.writeFile('test-dsy.txt', aliasesArray.join('\n'), (err) => { if (err) console.log(err.message); })
    // fs.writeFile('test-dsy2.txt', varsArray.join('\n'), (err) => { if (err) console.log(err.message); })

}