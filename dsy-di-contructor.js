const fs = require('fs');
require('dotenv').config()

const EXPORT_PATH = "d:\\_proj\\Export\\"

const HEADER = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<VariablesExchangeFile>
	<fileHeader company="Schneider Automation" product="Unity Pro XL V11.0 - 151207" dateTime="date_and_time#2022-3-14-16:30:6" content="Variable source file" DTDVersion="41"></fileHeader>
	<contentHeader name="Project" version="0.0.7" dateTime="date_and_time#2022-3-5-22:29:13"></contentHeader>
	<dataBlock>
		<variables name="DI_modules" typeName="ARRAY[0..127] OF EBOOL" topologicalAddress="%M400">
			<attribute name="TimeStampSource" value="0"></attribute>\n`
const FOOTER = `	</dataBlock>
</VariablesExchangeFile>`






const formAliasString = (index, alias, comment) => `\t\t<instanceElementDesc name="[${index}]">
\t\t<comment>${comment}</comment>
\t\t\t<attribute name="Alias" value="${alias}"></attribute>
\t\t</instanceElementDesc>`

const formVariablsString = (alias, comment) => `\t\t<variables name="${alias}" typeName="EBOOL">
\t\t\t<comment>${comment}</comment>
\t\t</variables>`


const formatAlias = (_alias) => {
    return _alias
        .replace(".5", '')
        .replace(/[\.\s]/, '_')
}
console.log(process.env.BLR);

const dataArray = require('./data/' + process.env.BLR + '/dis')

const formEquipmentString = ({ _comment, _alias, _area, _index, _params }) => {
    return `${process.env.BLR}.DI.${_alias};Cluster1;DIwithTRN_1;${_area || "_BLR1"};;${_comment};${_index};di;${_params};;;;;;Internal;;;;;;${_alias};;;;`
}
const equipmentArray = dataArray
    .filter(([_comment, _alias]) => _alias)
    .map(([_comment, _alias, _area, _index, _params], index) => {
        if (!_alias) return ""
        const newAlias = formatAlias(_alias)

        return formEquipmentString({ _comment, _alias: newAlias, _area, _index, _params })
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
const equipmentCSVlist = equipmentArray.join('\n') + '\n\n\n';


module.exports = (PLC) => {
    fs.writeFileSync(EXPORT_PATH + 'di_aliases' + PLC + '_new.xsy', result)
    fs.appendFileSync(EXPORT_PATH + 'eqipment' + PLC + '_new.csv', equipmentCSVlist)

}