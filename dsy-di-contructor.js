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

const dataArray = require('./data/' + process.env.BLR + '/dis')

const formEquipmentString = ({ _comment, _alias, _area, _index, _params }) => {
    return `B1.DO.${_alias};Cluster1;DOwithTRN_1;${_area || "_BLR1"};;${_comment};${_index};do;${_params};;;;;;Internal;;;;;;${_alias};;;;`
}


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

// fs.writeFile(EXPORT_PATH + 'di_aliases4_new.xsy', result, (err) => { if (err) console.log(err.message); })


module.exports = (PLC) => {
    fs.writeFileSync(EXPORT_PATH + 'di_aliases' + PLC + '_new.xsy', result)

}