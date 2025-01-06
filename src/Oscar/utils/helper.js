
const { waitAndCheckInnerHtml, waitAndClick} = require('./utils')


async function checkExtensionData(page, name, number){
    console.log(`Checking ${name} ${number}`);
    await waitAndCheckInnerHtml(page, '.qpeHeaderH1', "Quipo");
    await waitAndCheckInnerHtml(page, '.qpePatientName',name);
    console.log("Closing Extension ");
    await waitAndClick(page, "svg[width='16']");
}

async function launchExtesion(page, name, number, selector){
    await waitAndClick(page, selector);
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('Extension launched')
    await checkExtensionData(page, name, number);
}

module.exports = { checkExtensionData, launchExtesion }