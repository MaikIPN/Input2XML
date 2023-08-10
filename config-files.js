var pathFiles= {
    logfiles: "./log/",
    inputfiles: "./input/",
    outputfiles: "./output/",
    ntOutputfiles: "./ntoutput/",
    ftpOutputfiles: "./ftpoutput/",
    ftpInputfiles: "./ftpinput/",
    chOutputfiles: "./choutput/",
    valOutputfiles: "./valoutput/",
    configfiles: "./config/",
    outXML: true,
    outTXT: false,
    nIntScanInput: -1,
    tIntScanInput: 12000,
    nIntScanFTPout: -1,
    tIntScanFTPout: 120000,
    nIntScanFTPin: -1,
    tIntScanFTPin: 120000,
    nIntScanValidate: -1,
    tIntScanValidate: 120000,
    //************************/
    port:1990,
    server: 'localhost',
    //***********************/
    mongoDB: 'mongodb://127.0.0.1:27017/file_service',
    //****************************
    stfiles: "./st/",
    //****************************
    charSplit: "|",
}

module.exports = pathFiles;
