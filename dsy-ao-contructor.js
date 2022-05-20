const fs = require('fs');
require('dotenv').config()

const EXPORT_PATH = "d:\\_proj\\Export\\"

const HEADER = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<VariablesExchangeFile>
	<fileHeader company="Schneider Automation" product="Unity Pro XL V11.0 - 151207" dateTime="date_and_time#2022-3-16-23:58:36" content="Variable source file" DTDVersion="41"></fileHeader>
	<contentHeader name="Project" version="0.0.24" dateTime="date_and_time#2022-3-5-22:29:13"></contentHeader>
	<dataBlock>
		<variables name="AOs" typeName="ARRAY[1..24] OF AO" topologicalAddress="%MW2000">
			<attribute name="TimeStampSource" value="0"></attribute>\n`
const FOOTER = `	</dataBlock>
<DDTSource DDTName="AO" version="0.02" dateTime="dt#2022-03-16-22:37:41">
    <attribute name="TypeSignatureCheckSumString" value="B855"></attribute>
    <structure>
        <variables name="val" typeName="REAL"></variables>
        <variables name="in_min" typeName="REAL"></variables>
        <variables name="in_max" typeName="REAL"></variables>
        <variables name="out_min" typeName="INT"></variables>
        <variables name="out_max" typeName="INT"></variables>
        <variables name="prm" typeName="INT"></variables>
        <variables name="simOut" typeName="INT"></variables>
        <variables name="rate" typeName="REAL"></variables>
    </structure>
</DDTSource>
</VariablesExchangeFile>
`




const VAR_TYPE = "AO"

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
const dataArray = require('./data/' + process.env.BLR + '/aos')

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




module.exports = (PLC) => {

    fs.writeFileSync(EXPORT_PATH + 'ao_aliases' + PLC + '_new.xsy', result)
    // fs.writeFile(EXPORT_PATH + 'ao_aliases4_new.xsy', result, (err) => { if (err) console.log(err.message); })

}