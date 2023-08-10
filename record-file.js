var config = require('./config-files');
var chList = require('./channel-list');
var log = require('./log-file');


var getRecordLine = {
    recordData: {
        commonData: {
            PAN: "",
            CHNAME: "",
            TRACK1: "",
            TRACK2: "",
            TRACK3: "",
            ICVV: "",
            CVV2: "",
            CVC2: "",
            CVC: "",
            DSINCE: "",
            DTHRU: "",
            TYPEIF: "",
            MASKPAN: "",
            SPACEPAN: "",
            TRIGRAM_TH: "",
            TRIGRAM_NT: "",
            AID: "",
            CUSTOMER: "",
            TAG_5A: "",
            TAG_9F1F: "",
            TAG_8F: "",
            TAG_57: "",
            TAG_5F24: "",
            TAG_5F30: "",
            TAG_5F34: "",
            TAG_DF34: "",
            CARDGRAPHICAL: "",
            CARDCARRIER: "",
            SERVICE_CODE:"",
        },
        varData: {
            VAR01: "",
            VAR02: "",
            VAR03: "",
            VAR04: "",
            VAR05: "",
            VAR06: "",
            VAR07: "",
            VAR08: "",
            VAR09: "",
            VAR10: "",
            VAR11: "",
            VAR12: "",
            VAR13: "",
            VAR14: "",
            VAR15: "",
            VAR16: "",
            VAR17: "",
            VAR18: "",
            VAR19: "",
            VAR20: "",
            VAR21: "",
            VAR22: "",
            VAR23: "",
            VAR24: "",
            VAR25: "",
            VAR26: "",
            VAR27: "",
            VAR28: "",
            VAR29: "",
            VAR30: "",
        },
    },
    getRecordXML(line,fileName,isXML){
        
        var chID = "";

        if(chList.length>0)
        {
           for(var j=0;j<chList.length;j++)
           {
            var fnAux = chList[j].fileName.split(";");
                if(fnAux.length>0)
                {
                    //console.log(fileName);
                    for(var i=0;i<fnAux.length-1;i++)
                    {
                        //console.log(fileName.indexOf(fnAux[i]));
                        if(fileName.indexOf(fnAux[i])!=-1)
                        {
                            chID = chList[j].user;
                            break;
                        }
                    }
                }
                if(chID!="")
                {
                    break;
                }
           }
        }
        else{
            log.pushLog("processfile:no exist channel list");
        }
       
        if(chID=="")
        {
            return "*\n";
        }
        else{
            if(chID=="BANDEL01")
            {
                return parseBANDEL_XML(line,this.recordData,isXML);
            }
            else if(chID=="COOPED01")
            {
                return parseCOOPED01_XML(line,this.recordData,isXML);
            }
            else
            {
                return "*\n";
            }
        }
    },
    getRecord(line,fileName,isXML){
        
        var chID = "";

        if(chList.length>0)
        {
           for(var j=0;j<chList.length;j++)
           {
            var fnAux = chList[j].fileName.split(";");
                if(fnAux.length>0)
                {
                    //console.log(fileName);
                    for(var i=0;i<fnAux.length-1;i++)
                    {
                        //console.log(fileName.indexOf(fnAux[i]));
                        if(fileName.indexOf(fnAux[i])!=-1)
                        {
                            chID = chList[j].user;
                            break;
                        }
                    }
                }
                if(chID!="")
                {
                    break;
                }
           }
        }
        else{
            log.pushLog("processfile:no exist channel list");
        }
       
        if(chID=="")
        {
            return "*\n";
        }
        else{
            if(chID=="TWR01")
            {
                if(line.substring(6,7)=="$")//se verifica por el 1er separador
                {
                    return parseTWV(line,this.recordData,isXML);
                }
                else{
                    return parseTWM(line,this.recordData,isXML);
                }
            }
            else if(chID=="BNC03")
            {
                return parseBNC(line,this.recordData,isXML);
            }
            else if(chID=="BANDEL01")
            {
                if(fileName.indexOf("DX_BDELPURE")!=-1)
                {
                    return parseDX_BANDEL(line,this.recordData,false);
                }
                else{
                    return parseBANDEL(line,this.recordData,isXML);
                }
            }
            else if(chID=="COOPED01")
            {
                if(fileName.indexOf("DX_COOPED01")!=-1)
                {
                    return parseDX_COOPED01(line,this.recordData,false);
                }
                else{
                    return parseCOOPED01(line,this.recordData,isXML);
                }
            }
            else
            {
                return "*\n";
            }
        }
    },
    getHeadXML(line,nLine,fileName){
        
        var chID = "";
        let fileKeyListVS = "";
        let fileKeyListMC = "";
        if(chList.length>0)
        {
           for(var j=0;j<chList.length;j++)
           {
            var fnAux = chList[j].fileName.split(";");
                if(fnAux.length>0)
                {
                   // console.log(fileName);
                    for(var i=0;i<fnAux.length-1;i++)
                    {
                        //console.log(fileName.indexOf(fnAux[i]));
                        if(fileName.indexOf(fnAux[i])!=-1)
                        {
                            chID = chList[j].user;
                            fileKeyListMC = chList[j].mcKeys;
                            fileKeyListVS = chList[j].vsKeys;
                            break;
                        }
                    }
                }
                if(chID!="")
                {
                    break;
                }
           }
        }
        else{
            log.pushLog("processfile:no exist channel list");
        }
       
        if(chID=="")
        {
            return "*\n";
        }
        else{
            let customer = fileName.substring(6,12);
            let trigram = fileName.substring(0,5);
            let customerID = fileName.substring(14,28);
            let nCards = nLine-1;
            let batchID = trigram+fileName.substring(22,28);

            let lineOut = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n" + 
                       "<Customer Name=\""+customer+"\" Trigram=\""+trigram+"\">\n" +
                       "<InputFile CustomerRequestUID=\""+customerID+"\" Name=\""+fileName+".xml"+"\" DateTimeOfReception=\""+customerID+"\" CardQuantity=\""+nCards+"\">\n" +
                       "<Batch BatchID=\""+batchID+"\" CardQuantity=\""+nCards+"\" CardType=\"OE_TEST\" ArtWork=\"4121\" GraphRef=\"\" ElecRef=\"\">\n";
             //Hasta aquí se realiza parceo de encabezado en el XML   

            if(chID=="TWR01")
            {
                if(line.substring(6,7)=="$")//se verifica por el 1er separador, evaluar seleccionar por el bin
                {
                    lineOut = lineOut + ";" + config.configfiles+fileKeyListVS+".xml";
                    return lineOut;
                }
                else{
                    lineOut = lineOut + ";" + config.configfiles+fileKeyListMC+".xml";
                    return lineOut;
                }
            }
            else if(chID=="BNC03")
            {
                lineOut = lineOut + ";" + config.configfiles+fileKeyListVS+".xml";
                return lineOut;
            }
            else if(chID=="BANDEL01")
            {
                lineOut = lineOut + ";" + config.configfiles+fileKeyListVS+".xml";
                return lineOut;
            } 
            else if(chID=="COOPED01")
            {
                lineOut = lineOut + ";" + config.configfiles+fileKeyListVS+".xml";
                return lineOut;
            } 
            else
            {
                return "*\n";
            }
        }
    },
    getFootXML(){
        
        let lineOut = "</Batch>\n" + 
                    "</InputFile>\n" +
                    "</Customer>\n";
                    
        return lineOut;
    
    },
    getFileName(fileName){
        
        var name = "";
        if(chList.length>0)
        {
           for(var j=0;j<chList.length;j++)
           {
            var fnAux = chList[j].fileName.split(";");
                if(fnAux.length>0)
                {
                    console.log(fileName);
                    for(var i=0;i<fnAux.length-1;i++)
                    {
                        console.log(fileName.indexOf(fnAux[i]));
                        if(fileName.indexOf(fnAux[i])!=-1)
                        {
                            name = chList[j].trigram + "_" + chList[j].user + "_0_";
                            break;
                        }
                    }
                }
                if(name!="")
                {
                    break;
                }
           }
           return name;
        }
        else{
            log.pushLog("processfile:no exist channel list");
            return name;
        }
    }
}

function parseBNC(line,recordData,isXML){
    try {
        recordData.varData.VAR01 = line.substring(0,6); //secuencial
        recordData.commonData.PAN = line.substring(7,26); //Nro. Plastico
        recordData.commonData.DTHRU = line.substring(27,32); //Fecha vencimiento
        recordData.commonData.CHNAME = line.substring(33,54); //Nombre cliente
        recordData.commonData.TRACK1 = line.substring(56,131); //Track1
        recordData.commonData.TRACK2 = line.substring(133,170); //Track2
        recordData.commonData.TRACK3 = line.substring(173,198); //Track3
        recordData.varData.VAR02 = line.substring(200,208); //DCTA_4ULTCI
        recordData.varData.VAR03 = line.substring(209,249); //Nombre cliente 2
        recordData.varData.VAR04 = line.substring(250,290); //Direccion 1
        recordData.varData.VAR05 = line.substring(291,331); //Direccion 2
        recordData.varData.VAR06 = line.substring(332,372); //Direccion 3
        recordData.varData.VAR07 = line.substring(373,398); //Espacios_Blancos
        recordData.varData.VAR08 = line.substring(399,410); //Ceros
        recordData.commonData.CVC2 = line.substring(411,414); //CVC2
        recordData.commonData.DSINCE = line.substring(415,420); //Fecha apertura
        recordData.varData.VAR09 = line.substring(421,432); //Limite credito
        recordData.varData.VAR10 = line.substring(433,437); //4ULTCI
        recordData.varData.VAR11 = line.substring(438,464); //Espacios_Blacos
        recordData.varData.VAR12 = line.substring(465,470); //Codigo_Agencia
        recordData.varData.VAR13 = line.substring(471,483); //Espacios_Blancos
        recordData.commonData.CVC = line.substring(484,487); //Chip CVC
        recordData.varData.VAR14 = line.substring(487,501); //Separador
        recordData.varData.VAR15 = line.substring(501,507); //Nro Asignacion
        recordData.commonData.TYPEIF = "BNC MC ML4 CRED USD";
        recordData.commonData.TRIGRAM_TH = "G09D0";
        recordData.commonData.TRIGRAM_NT = "BNC";
        recordData.commonData.MASKPAN = recordData.commonData.PAN.replace(/ /g,'').substring(0,5) + "****" + recordData.commonData.PAN.replace(/ /g,'').substring(10,15);  
        recordData.commonData.SPACEPAN = recordData.commonData.PAN.replace(/ /g,'').substring(0,4) + " " + recordData.commonData.PAN.replace(/ /g,'').substring(4,8) + " " + recordData.commonData.PAN.replace(/ /g,'').substring(8,12) + " " + recordData.commonData.PAN.replace(/ /g,'').substring(12,16);
        recordData.commonData.CUSTOMER = "BNC";
        recordData.commonData.AID = "A0000000041010";
        recordData.commonData.TAG_57 = recordData.commonData.TRACK2.replace("=","D").substring(0,29)+recordData.commonData.CVC+"00000F";
        recordData.commonData.TAG_8F = "EF";
        recordData.commonData.TAG_5F34 = "01";
        recordData.commonData.TAG_5F30 = "0201";
        recordData.commonData.TAG_5A = recordData.commonData.PAN;
        recordData.commonData.TAG_DF34 = false;
        recordData.commonData.TAG_5A = false;
        recordData.commonData.CARDGRAPHICAL = false;
        recordData.commonData.CARDCARRIER = false;

        //showParseBNC(recordData);
        if(isXML){
            return lineInputNTxml(recordData);
        }
        else{
            return lineInputNT(recordData,config.charSplit);
        }
    } 
    catch (err) {
        console.log(err);
        log.pushLog("parseBNC:exception:" + err);
    } 
}

function showParseBNC(recordData){
    console.log(
        recordData.varData.VAR01 + ";" +
        recordData.commonData.PAN.replace(/ /g,'') + ";" + 
        recordData.commonData.DTHRU + ";" +
        recordData.commonData.CHNAME + ";" +
        recordData.commonData.TRACK1 + ";" +
        recordData.commonData.TRACK2 + ";" +
        recordData.commonData.TRACK3 + ";" +
        recordData.varData.VAR02 + ";" +
        recordData.varData.VAR03 + ";" +
        recordData.varData.VAR04 + ";" +
        recordData.varData.VAR05 + ";" +
        recordData.varData.VAR06 + ";" +
        recordData.varData.VAR07 + ";" +
        recordData.varData.VAR08 + ";" +
        recordData.commonData.CVC2 + ";" +
        recordData.commonData.DSINCE + ";" +
        recordData.varData.VAR09 + ";" +
        recordData.varData.VAR10 + ";" +
        recordData.varData.VAR11 + ";" +
        recordData.varData.VAR12 + ";" +
        recordData.varData.VAR13 + ";" +
        recordData.commonData.CVC + ";" +
        recordData.varData.VAR14 + ";" +
        recordData.varData.VAR15 + ";");
}

function parseTWV(line,recordData,isXML){
    try {
        recordData.varData.VAR01 = line.substring(0,6); //folio
        recordData.commonData.PAN = line.substring(7,26); //Nro. Plastico
        recordData.commonData.DTHRU = line.substring(27,32); //Fecha vencimiento
        recordData.commonData.CHNAME = line.substring(33,54); //Nombre cliente
        recordData.commonData.CVV2 = line.substring(55,58); //CVV2
        recordData.commonData.TRACK1 = line.substring(60,136); //Track1
        recordData.commonData.TRACK2 = line.substring(138,175); //Track2
        recordData.commonData.TRACK3 = line.substring(178,203); //Track3
        recordData.varData.VAR02 = line.substring(204,206); //Codigo franquicia
        recordData.varData.VAR03 = line.substring(206,236); //desc_franquicia
        recordData.varData.VAR04 = line.substring(236,237); //Tipo tarjeta
        recordData.varData.VAR05 = line.substring(237,238); //Razon tarjeta
        recordData.varData.VAR06 = line.substring(238,265); //Nombre_comp
        recordData.varData.VAR07 = line.substring(265,284); //Cta_Maestra
        recordData.varData.VAR08 = line.substring(284,286); //Tipo_Dise
        recordData.commonData.DSINCE = line.substring(286,290); //Fecha_desde
        recordData.commonData.ICVV = line.substring(290,293); //ICVV
        recordData.varData.VAR09 = line.substring(293,394); //Producto
        recordData.varData.VAR10 = line.substring(394,428); //Nro_Iban
        recordData.varData.VAR11 = line.substring(428,745); //Separador6
        recordData.commonData.TYPEIF = "PROCECARD VISA"; 
        recordData.commonData.TRIGRAM_TH = "G12C8";
        recordData.commonData.TRIGRAM_NT = "TWR";
        recordData.commonData.MASKPAN = recordData.commonData.PAN.replace(/ /g,'').substring(0,3) + "********" + recordData.commonData.PAN.replace(/ /g,'').substring(12,15);  
        recordData.commonData.SPACEPAN = recordData.commonData.PAN.replace(/ /g,'').substring(0,4) + " " + recordData.commonData.PAN.replace(/ /g,'').substring(4,8) + " " + recordData.commonData.PAN.replace(/ /g,'').substring(8,12) + " " + recordData.commonData.PAN.replace(/ /g,'').substring(12,16);
        recordData.commonData.CUSTOMER = "TOWERBANK";
        recordData.commonData.AID = "A0000000031010";
        recordData.commonData.TAG_57 = recordData.commonData.TRACK2.replace("=","D").substring(0,29)+recordData.commonData.ICVV+"00000F";
        recordData.commonData.TAG_8F = "94";
        recordData.commonData.TAG_5F34 = "00";
        recordData.commonData.TAG_DF34 = "5F340100";
        recordData.commonData.TAG_5A = recordData.commonData.PAN;
        recordData.commonData.TAG_5F30 = false;
        recordData.commonData.TAG_5A = false;
        recordData.commonData.CARDGRAPHICAL = false;
        recordData.commonData.CARDCARRIER = false;

        //showParseTWV(recordData);
        if(isXML){
            return lineInputNTxml(recordData);
        }
        else{
            return lineInputNT(recordData,config.charSplit);
        }
    }
    catch (err) {
        console.log(err);
        log.pushLog("parseBNC:exception:" + err);
    } 
}

function showParseTWV(recordData){
    console.log(
        recordData.varData.VAR01 + ";" +
        recordData.commonData.PAN.replace(/ /g,'') + ";" + 
        recordData.commonData.DTHRU + ";" +
        recordData.commonData.CHNAME + ";" +
        recordData.commonData.CVV2 + ";" +
        recordData.commonData.TRACK1 + ";" +
        recordData.commonData.TRACK2 + ";" +
        recordData.commonData.TRACK3 + ";" +
        recordData.varData.VAR02 + ";" +
        recordData.varData.VAR03 + ";" +
        recordData.varData.VAR04 + ";" +
        recordData.varData.VAR05 + ";" +
        recordData.varData.VAR06 + ";" +
        recordData.varData.VAR07 + ";" +
        recordData.varData.VAR08 + ";" +
        recordData.commonData.DSINCE + ";" +
        recordData.commonData.ICVV + ";" +
        recordData.varData.VAR09 + ";" +
        recordData.varData.VAR10 + ";" +
        recordData.varData.VAR11 + ";");
}

function parseTWM(line,recordData,isXML){
    try {
        recordData.commonData.PAN = line.substring(0,16); //PAN
        recordData.commonData.CHNAME = line.substring(16,42); //Nombre cliente
        recordData.varData.VAR01 = line.substring(43,62); //Nro plastico
        recordData.commonData.DTHRU = line.substring(64,69); //Fecha vencimiento
        recordData.varData.VAR02 = line.substring(70,72); //Logo
        recordData.varData.VAR03 = line.substring(74,100); //Nombre1
        recordData.varData.VAR04 = line.substring(101,127); //Nombre2
        recordData.varData.VAR05 = line.substring(128,132); //Sectarjeta
        recordData.commonData.CVV2 = line.substring(133,136); //CVV2
        recordData.commonData.TRACK1 = line.substring(139,207); //Track1
        recordData.varData.VAR06 = line.substring(207,219); //Separador12
        recordData.commonData.TRACK2 = line.substring(220,257); //Track2
        recordData.varData.VAR07 = line.substring(257,299); //Separador13
        recordData.commonData.ICVV = line.substring(299,302); //ICVV
        recordData.varData.VAR08 = line.substring(303,338); //Tipotarjeta
        recordData.varData.VAR09 = line.substring(339,354); //TLFCasa
        recordData.varData.VAR10 = line.substring(355,370); //TLFOficina
        recordData.varData.VAR11 = line.substring(371,373); //SucusalDST
        recordData.varData.VAR12 = line.substring(374,376); //CausaTarjeta
        recordData.varData.VAR13 = line.substring(376,379); //Afinidad
        recordData.commonData.TYPEIF = "PROCECARD MASTERCARD";
        recordData.commonData.TRIGRAM_TH = "G12C8";
        recordData.commonData.TRIGRAM_NT = "TWR";
        recordData.commonData.MASKPAN = recordData.commonData.PAN.replace(/ /g,'').substring(0,3) + "********" + recordData.commonData.PAN.replace(/ /g,'').substring(12,15);  
        recordData.commonData.SPACEPAN = recordData.commonData.PAN.replace(/ /g,'').substring(0,4) + " " + recordData.commonData.PAN.replace(/ /g,'').substring(4,8) + " " + recordData.commonData.PAN.replace(/ /g,'').substring(8,12) + " " + recordData.commonData.PAN.replace(/ /g,'').substring(12,16);
        recordData.commonData.CUSTOMER = "TOWERBANK";
        recordData.commonData.AID = "A0000000041010";
        recordData.commonData.TAG_57 = recordData.commonData.TRACK2.replace("=","D").substring(0,29)+recordData.commonData.ICVV+"00000F";
        recordData.commonData.TAG_8F = "06";
        recordData.commonData.TAG_5F34 = "00";
        recordData.commonData.TAG_5F30 = "0000";
        recordData.commonData.TAG_5A = recordData.commonData.PAN;
        recordData.commonData.TRACK3 = false;
        recordData.commonData.TAG_DF30 = false;
        recordData.commonData.TAG_5A = false;
        recordData.commonData.CARDGRAPHICAL = false;
        recordData.commonData.CARDCARRIER = false;


        //showParseTWM(recordData);
        if(isXML){
            return lineInputNTxml(recordData);
        }
        else{
            return lineInputNT(recordData,config.charSplit);
        }
    } 
    catch (err) {
        console.log(err);
        log.pushLog("parseBNC:exception:" + err);
    } 
}
function showParseTWM(recordData){
    console.log(
        recordData.commonData.PAN.replace(/ /g,'') + ";" + 
        recordData.commonData.CHNAME + ";" +
        recordData.varData.VAR01 + ";" +
        recordData.commonData.DTHRU + ";" +
        recordData.varData.VAR02 + ";" +
        recordData.varData.VAR03 + ";" +
        recordData.varData.VAR04 + ";" +
        recordData.varData.VAR05 + ";" +
        recordData.commonData.CVV2 + ";" +
        recordData.commonData.TRACK1 + ";" +
        recordData.varData.VAR06 + ";" +
        recordData.commonData.TRACK2 + ";" +
        recordData.varData.VAR07 + ";" +
        recordData.commonData.ICVV + ";" +
        recordData.varData.VAR08 + ";" +
        recordData.varData.VAR09 + ";" +
        recordData.varData.VAR10 + ";" +
        recordData.varData.VAR11 + ";" +
        recordData.varData.VAR12 + ";" +
        recordData.varData.VAR13 + ";");
}

function parseDX_BANDEL(line,recordData,isXML){
    try {
        recordData.commonData.PAN = line.substring(107,123); //Nro. Plastico
        recordData.varData.VAR01 = line.substring(102,104); //A;o
        recordData.varData.VAR02 = "/";
        recordData.varData.VAR03 = line.substring(99,101); //Mes
        recordData.commonData.SERVICE_CODE = line.substring(130,133); //Codigo Servicio
        recordData.varData.VAR04 = "1"; //PCAS Carrier P5
        recordData.varData.VAR05 = paddingEnd(line.substring(33,59),30); //30 caracteres Carrier P2 - Track 1 truncado en 25
        recordData.varData.VAR08 = line.substring(145,146); // TAG_F34 - Para Renewall
        recordData.varData.VAR06 = paddingEnd("0"+ recordData.varData.VAR08,30); //30 caracteres Carrier P3
        recordData.varData.VAR07 = paddingEnd("Data Carrier 2",30); //30 caracteres Carrier P4
    
        if(isXML){
            //return lineInputNTxml(recordData);
        }
        else{
            return lineInputDexxis(recordData,"");
        }
    } 
    catch (err) {
        console.log(err);
        log.pushLog("parseDX_BANDEL:exception:" + err);
    } 
}

function parseBANDEL_XML(line,recordData,isXML){
    try {
        recordData.commonData.PAN =  line.$.CardID;
        recordData.commonData.TRACK1 = line.CardMagnetical[0].$.MagneticalValue;
        recordData.commonData.TRACK2 = line.CardMagnetical[1].$.MagneticalValue;
        recordData.commonData.SERVICE_CODE = line.CardMagnetical[1].$.MagneticalValue.substring(21,24);
        recordData.varData.VAR08 = line.CardCarrier[0].$.CarrierValue; //PIN
        recordData.varData.VAR09 = line.CardGraphical[3].$.GraphValue; //CVV
        recordData.varData.VAR10 = line.CardGraphical[0].$.GraphValue; //GraphPos1
        recordData.varData.VAR11 = line.CardGraphical[1].$.GraphValue; //GraphPos2
        recordData.varData.VAR12 = line.CardGraphical[2].$.GraphValue; //GraphPos3
        recordData.varData.VAR13 = line.CardCarrier[2].$.CarrierValue; //CarrierPos2

        recordData.commonData.TRIGRAM_TH = "G13B6";
        recordData.commonData.TRIGRAM_NT = "BANDEL";
        recordData.commonData.MASKPAN = recordData.commonData.PAN.replace(/ /g,'').substring(0,5) + "****" + recordData.commonData.PAN.replace(/ /g,'').substring(10,15);  
      
        recordData.commonData.CUSTOMER = "BANDEL";
        recordData.commonData.AID = "A0000005360001";

        recordData.commonData.TAG_57 = line.ElectricalData[0].EMVApplication[0].EMVElement[0].$.Value;
        recordData.commonData.TAG_9F1F = line.ElectricalData[0].EMVApplication[0].EMVElement[1].$.Value;
        recordData.commonData.TAG_5A = line.ElectricalData[0].EMVApplication[0].EMVElement[2].$.Value;

        recordData.commonData.TAG_8F = "01";
        recordData.commonData.TAG_5F34 = hex_to_ascii(recordData.varData.VAR13.substring(0,4));
        recordData.commonData.TAG_5F30 = "0" + recordData.commonData.SERVICE_CODE;
        
        recordData.commonData.TAG_5F24 = line.CardMagnetical[1].$.MagneticalValue.substring(17,21)  + getDay(line.CardMagnetical[1].$.MagneticalValue.substring(19,21)); //Por validar todos los escenarios de fecha
      
        recordData.commonData.CARDGRAPHICAL = true;
        recordData.commonData.CARDCARRIER = true; 

        return lineInputNTxml(recordData);

    } 
    catch (err) {
        console.log(err);
        log.pushLog("parseBANDEL:exception:" + err);
    } 
}

function parseBANDEL(line,recordData,isXML){
    try {
        recordData.varData.VAR01 = line.substring(1,2); //Indicador de tipo de impresion 
        recordData.commonData.SPACEPAN = line.substring(5,30).replace(/~,~/g," "); //Nro. Plastico
        recordData.commonData.CHNAME = line.substring(33,59); //Nombre de la entidad
        recordData.varData.VAR03 = line.substring(62,88); //Nombre 2 
        recordData.commonData.DSINCE = line.substring(91,96); //Fecha apertura
        recordData.commonData.DTHRU = line.substring(99,104); //Fecha vencimiento
        recordData.varData.VAR17 = line.substring(99,101); //Primeros 2 numeros de fecha vencimiento
        recordData.varData.VAR18 = line.substring(102,104); //Ultimos 2 numeros de fecha vencimiento
        recordData.commonData.PAN = line.substring(107,123); //Nro. Plastico
        recordData.commonData.SERVICE_CODE = line.substring(130,133); //Informacion
        recordData.varData.VAR04 = line.substring(126,138); //Información completa
        recordData.varData.VAR05 = line.substring(141,142); //Codigo de generación 
        recordData.varData.VAR06 = line.substring(145,146); // FIJO-0
        recordData.varData.VAR07 = line.substring(149,150); // FIJO-A
        recordData.varData.VAR19 = line.substring(153,198); //Track1 1 caracter antes de la fecha
        recordData.varData.VAR20 = line.substring(202,219); //Track1 despues de la fecha hasta el final
        recordData.commonData.TRACK1 = recordData.varData.VAR19 + recordData.varData.VAR18 + recordData.varData.VAR17 + recordData.varData.VAR20; //Track1
        recordData.varData.VAR21 = line.substring(222,239); //Track2 1 caracter antes de la fecha
        recordData.varData.VAR22 = line.substring(243,259); //Track2 despues de la fecha hasta el final
        recordData.commonData.TRACK2 = recordData.varData.VAR21 + recordData.varData.VAR18 + recordData.varData.VAR17 + recordData.varData.VAR22; //Track2
     //   recordData.varData.VAR17 = line.substring(222,239); //Track2 HASTA LA D para el TAG_5F34
        recordData.varData.VAR08 = line.substring(262,269); //PIN
        recordData.varData.VAR09 = line.substring(273,279); //CVV
        recordData.varData.VAR10 = line.substring(282,320); //GraphPos1
        recordData.varData.VAR11 = line.substring(323,333); //GraphPos2
        recordData.varData.VAR12 = line.substring(336,396); //GraphPos3
        recordData.varData.VAR13 = line.substring(399,459); //CarrierPos2
        recordData.varData.VAR14 = line.substring(462,522); //CarrierPos3
        recordData.varData.VAR15 = line.substring(525,585); //CarrierPos4
        recordData.varData.VAR16 = line.substring(588,590); //CarrierPos5

        /* recordData.varData.VAR05 = line.substring(149,152); //Tipo de tarjeta A-Fijo
        recordData.varData.VAR01 = line.substring(0,7); //secuencial
        recordData.commonData.PAN = line.substring(7,26); //Nro. Plastico
        recordData.commonData.DTHRU = line.substring(27,32); //Fecha vencimiento
        recordData.commonData.CHNAME = line.substring(33,54); //Nombre cliente
        recordData.commonData.TRACK1 = line.substring(56,131); //Track1
        recordData.commonData.TRACK2 = line.substring(133,170); //Track2
        recordData.commonData.TRACK3 = line.substring(173,198); //Track3
        recordData.varData.VAR02 = line.substring(200,208); //DCTA_4ULTCI
        recordData.varData.VAR03 = line.substring(209,249); //Nombre cliente 2
        recordData.varData.VAR04 = line.substring(250,290); //Direccion 1
        recordData.varData.VAR05 = line.substring(291,331); //Direccion 2
        recordData.varData.VAR06 = line.substring(332,372); //Direccion 3
        recordData.varData.VAR07 = line.substring(373,398); //Espacios_Blancos
        recordData.varData.VAR08 = line.substring(399,410); //Ceros
        recordData.commonData.CVC2 = line.substring(411,414); //CVC2
        recordData.commonData.DSINCE = line.substring(415,420); //Fecha apertura
        recordData.varData.VAR09 = line.substring(421,432); //Limite credito
        recordData.varData.VAR10 = line.substring(433,437); //4ULTCI
        recordData.varData.VAR11 = line.substring(438,464); //Espacios_Blacos
        recordData.varData.VAR12 = line.substring(465,470); //Codigo_Agencia
        recordData.varData.VAR13 = line.substring(471,483); //Espacios_Blancos
        recordData.commonData.CVC = line.substring(484,487); //Chip CVC
        recordData.varData.VAR14 = line.substring(487,501); //Separador
        recordData.varData.VAR15 = line.substring(501,507); //Nro Asignacion
        recordData.commonData.TYPEIF = "BNC MC ML4 CRED USD";                     
        */  
        recordData.commonData.TRIGRAM_TH = "G13B6";
        recordData.commonData.TRIGRAM_NT = "BANDEL";
        recordData.commonData.MASKPAN = recordData.commonData.PAN.replace(/ /g,'').substring(0,5) + "****" + recordData.commonData.PAN.replace(/ /g,'').substring(10,15);  
        //   recordData.commonData.SPACEPAN = recordData.commonData.PAN.replace(/ /g,'').substring(0,4) + " " + recordData.commonData.PAN.replace(/ /g,'').substring(4,8) + " " + recordData.commonData.PAN.replace(/ /g,'').substring(8,12) + " " + recordData.commonData.PAN.replace(/ /g,'').substring(12,16); 
       
        recordData.commonData.CUSTOMER = "BANDEL";
        recordData.commonData.AID = "A0000005360001";
       // recordData.varData.VAR23 = recordData.commonData.TRACK2.replace("=","D");
       // recordData.varData.TAG_57 = recordData.varData.VAR21.replace("=","D") + recordData.varData.VAR18 + recordData.varData.VAR17 + recordData.varData.VAR22 + "F";
        recordData.commonData.TAG_57 = recordData.commonData.TRACK2.replace("=","D") + "F" + "VALOR PENDIENTE DE CAMBIO";     //Este TAG esta agarradando el ICVV del Track2 , esta pendiente colocar el valor del TAG_57, esta pendiente verificar si el RTDP puede colocarlo directamente o si se va a tomar desde el dexxis. 
        //  recordData.commonData.TAG_57 = recordData.commonData.TRACK2.replace("=","D").substring(0,29)+recordData.commonData.VAR09+"00000F";
        recordData.commonData.TAG_8F = "01";
        recordData.commonData.TAG_5F34 = "0" + recordData.varData.VAR06;
        recordData.commonData.TAG_5F30 = "0" + recordData.commonData.SERVICE_CODE;
        recordData.commonData.TAG_5A = recordData.commonData.PAN;
        recordData.commonData.TAG_5F24 = recordData.varData.VAR18 + recordData.varData.VAR17 + getDay(recordData.varData.VAR17); //YYMMDD Pendiente probar
        // recordData.commonData.TAG_DF34 = false;
        // recordData.commonData.TAG_5A = false;
        recordData.commonData.CARDGRAPHICAL = true;
        recordData.commonData.CARDCARRIER = true; 
        //showParseBNC(recordData);
        showParseBANDEL(recordData); 
        if(isXML){
            return lineInputNTxml(recordData);
        }
        else{
            return lineInputNT(recordData,config.charSplit);
        }
    } 
    catch (err) {
        console.log(err);
        log.pushLog("parseBANDEL:exception:" + err);
    } 
}

function showParseBANDEL(recordData){
    console.log(
        recordData.varData.VAR01 + ";" + 
        recordData.commonData.SPACEPAN + ";" +
        recordData.varData.CHNAME + ";" +
        recordData.varData.VAR03 + ";" +
        recordData.commonData.DSINCE + ";" +
        recordData.commonData.DTHRU + ";" +
        recordData.commonData.PAN + ";" +
        recordData.varData.VAR04 + ";" +
        recordData.varData.VAR05 + ";" +
        recordData.varData.VAR06 + ";" +
        recordData.commonData.TRACK1 + ";" +
        recordData.commonData.TRACK2 + ";" +
        recordData.varData.VAR08 + ";" +
        recordData.varData.VAR09 + ";" +
        recordData.varData.VAR10 + ";" +
        recordData.varData.VAR11 + ";" +
        recordData.varData.VAR12 + ";" +
        recordData.varData.VAR13 + ";" +
        recordData.varData.VAR14 + ";" +
        recordData.varData.VAR15 + ";" +
        recordData.varData.VAR16 + ";" +
        recordData.commonData.TAG_5F24 + ";" +
        recordData.commonData.TAG_57 + ";"
     );
}

function parseDX_COOPED01(line,recordData,isXML){
    try {
        recordData.commonData.PAN = line.substring(107,123); //Nro. Plastico
        recordData.varData.VAR01 = line.substring(102,104); //A;o
        recordData.varData.VAR02 = "/";
        recordData.varData.VAR03 = line.substring(99,101); //Mes
        recordData.commonData.SERVICE_CODE = line.substring(130,133); //Codigo Servicio
        recordData.varData.VAR04 = "1"; //PCAS Carrier P5
        recordData.varData.VAR05 = paddingEnd(line.substring(62,88),30); //30 caracteres Carrier P2 - Track 1 truncado en 25
        recordData.varData.VAR08 = line.substring(145,146); // TAG_F34 - Para Renewall
        recordData.varData.VAR06 = paddingEnd("0"+ recordData.varData.VAR08,30); //30 caracteres Carrier P3
        recordData.varData.VAR07 = paddingEnd("Data Carrier 2",30); //30 caracteres Carrier P4

        if(isXML){
            //return lineInputNTxml(recordData);
        }
        else{
            return lineInputDexxis(recordData,"");
        }
    } 
    catch (err) {
        console.log(err);
        log.pushLog("parseDX_COOPED01:exception:" + err);
    } 
}

function parseCOOPED01_XML(line,recordData,isXML){
    try {

        recordData.commonData.PAN =  line.$.CardID;
        recordData.commonData.TRACK1 = line.CardMagnetical[0].$.MagneticalValue;
        recordData.commonData.TRACK2 = line.CardMagnetical[1].$.MagneticalValue;
        recordData.commonData.SERVICE_CODE = line.CardMagnetical[1].$.MagneticalValue.substring(21,24);
        recordData.varData.VAR08 = line.CardCarrier[0].$.CarrierValue; //PIN
        recordData.varData.VAR09 = line.CardGraphical[3].$.GraphValue; //CVV
        recordData.varData.VAR10 = line.CardGraphical[0].$.GraphValue; //GraphPos1
        recordData.varData.VAR11 = line.CardGraphical[1].$.GraphValue; //GraphPos2
        recordData.varData.VAR12 = line.CardGraphical[2].$.GraphValue; //GraphPos3
        recordData.varData.VAR13 = line.CardCarrier[2].$.CarrierValue; //CarrierPos2

        recordData.commonData.TRIGRAM_TH = "G1397";
        recordData.commonData.TRIGRAM_NT = "COOPED01";
        recordData.commonData.MASKPAN = recordData.commonData.PAN.replace(/ /g,'').substring(0,5) + "****" + recordData.commonData.PAN.replace(/ /g,'').substring(10,15);  

        
        recordData.commonData.CUSTOMER = "COOPED01";
        recordData.commonData.AID = "A0000005360001";

        recordData.commonData.TAG_57 = line.ElectricalData[0].EMVApplication[0].EMVElement[0].$.Value;
        recordData.commonData.TAG_9F1F = line.ElectricalData[0].EMVApplication[0].EMVElement[1].$.Value;
        recordData.commonData.TAG_5A = line.ElectricalData[0].EMVApplication[0].EMVElement[2].$.Value;

        recordData.commonData.TAG_8F = "01";
        recordData.commonData.TAG_5F34 = hex_to_ascii(recordData.varData.VAR13.substring(0,4));
        recordData.commonData.TAG_5F30 = "0" + recordData.commonData.SERVICE_CODE;
        
        //recordData.commonData.TAG_5F24 = line.CardMagnetical[1].$.MagneticalValue.substring(17,21)  + "01"; 
        recordData.commonData.TAG_5F24 = line.CardMagnetical[1].$.MagneticalValue.substring(17,21)  + getDay(line.CardMagnetical[1].$.MagneticalValue.substring(19,21)); //Por validar todos los escenarios de fecha
        recordData.commonData.CARDGRAPHICAL = true;
        recordData.commonData.CARDCARRIER = true; 

        return lineInputNTxml(recordData);
        
       
    } 
    catch (err) {
        console.log(err);
        log.pushLog("parseCOOPED01:exception:" + err);
    } 
}

function parseCOOPED01(line,recordData,isXML){
    try {
        recordData.varData.VAR01 = line.substring(1,2); //Indicador de tipo de impresion 
        recordData.commonData.SPACEPAN = line.substring(5,30).replace(/~,~/g," "); //Nro. Plastico
        recordData.varData.VAR02 = line.substring(33,59); //Nombre de la entidad
        recordData.commonData.CHNAME = line.substring(62,88); //Nombre 2 
        recordData.commonData.DSINCE = line.substring(91,96); //Fecha apertura
        recordData.commonData.DTHRU = line.substring(99,104); //Fecha vencimiento
        recordData.varData.VAR17 = line.substring(99,101); //Primeros 2 numeros de fecha vencimiento
        recordData.varData.VAR18 = line.substring(102,104); //Ultimos 2 numeros de fecha vencimiento
        recordData.commonData.PAN = line.substring(107,123); //Nro. Plastico
        recordData.commonData.SERVICE_CODE = line.substring(130,133); //Informacion
        recordData.varData.VAR04 = line.substring(126,138); //Información completa
        recordData.varData.VAR05 = line.substring(141,142); //Codigo de generación 
        recordData.varData.VAR06 = line.substring(145,146); // TAG_F34 - Para Renewall
        recordData.varData.VAR07 = line.substring(149,150); // FIJO-A        
        /* recordData.varData.VAR05 = line.substring(149,152); //Tipo de tarjeta A-Fijo
        recordData.varData.VAR01 = line.substring(0,7); //secuencial
        recordData.commonData.PAN = line.substring(7,26); //Nro. Plastico
        recordData.commonData.DTHRU = line.substring(27,32); //Fecha vencimiento
        recordData.commonData.CHNAME = line.substring(33,54); //Nombre cliente
        recordData.commonData.TRACK1 = line.substring(56,131); //Track1
        recordData.commonData.TRACK2 = line.substring(133,170); //Track2
        recordData.commonData.TRACK3 = line.substring(173,198); //Track3
        recordData.varData.VAR02 = line.substring(200,208); //DCTA_4ULTCI
        recordData.varData.VAR03 = line.substring(209,249); //Nombre cliente 2
        recordData.varData.VAR04 = line.substring(250,290); //Direccion 1
        recordData.varData.VAR05 = line.substring(291,331); //Direccion 2
        recordData.varData.VAR06 = line.substring(332,372); //Direccion 3
        recordData.varData.VAR07 = line.substring(373,398); //Espacios_Blancos
        recordData.varData.VAR08 = line.substring(399,410); //Ceros
        recordData.commonData.CVC2 = line.substring(411,414); //CVC2
        recordData.commonData.DSINCE = line.substring(415,420); //Fecha apertura
        recordData.varData.VAR09 = line.substring(421,432); //Limite credito
        recordData.varData.VAR10 = line.substring(433,437); //4ULTCI
        recordData.varData.VAR11 = line.substring(438,464); //Espacios_Blacos
        recordData.varData.VAR12 = line.substring(465,470); //Codigo_Agencia
        recordData.varData.VAR13 = line.substring(471,483); //Espacios_Blancos
        recordData.commonData.CVC = line.substring(484,487); //Chip CVC
        recordData.varData.VAR14 = line.substring(487,501); //Separador
        recordData.varData.VAR15 = line.substring(501,507); //Nro Asignacion
        recordData.commonData.TYPEIF = "BNC MC ML4 CRED USD";                     
        */  
        recordData.commonData.TRIGRAM_TH = "G1397";
        recordData.commonData.TRIGRAM_NT = "COOPED01";
        recordData.commonData.MASKPAN = recordData.commonData.PAN.replace(/ /g,'').substring(0,5) + "****" + recordData.commonData.PAN.replace(/ /g,'').substring(10,15);  
        //   recordData.commonData.SPACEPAN = recordData.commonData.PAN.replace(/ /g,'').substring(0,4) + " " + recordData.commonData.PAN.replace(/ /g,'').substring(4,8) + " " + recordData.commonData.PAN.replace(/ /g,'').substring(8,12) + " " + recordData.commonData.PAN.replace(/ /g,'').substring(12,16); 
       
        recordData.commonData.CUSTOMER = "COOPED01";
        recordData.commonData.AID = "A0000005360001";
        //recordData.commonData.TAG_57 = recordData.commonData.TRACK2.replace("=","D") + "F" + "VALOR PENDIENTE DE CAMBIO";     //Este TAG esta agarradando el ICVV del Track2 , esta pendiente colocar el valor del TAG_57, esta pendiente verificar si el RTDP puede colocarlo directamente o si se va a tomar desde el dexxis. 

        //  recordData.commonData.TAG_57 = recordData.commonData.TRACK2.replace("=","D").substring(0,29)+recordData.commonData.VAR09+"00000F";
        recordData.commonData.TAG_8F = "01";
        recordData.commonData.TAG_5F34 = "0" + recordData.varData.VAR06;
        recordData.commonData.TAG_5F30 = "0" + recordData.commonData.SERVICE_CODE;
        //recordData.commonData.TAG_5A = recordData.commonData.PAN;
        recordData.commonData.TAG_5F24 = recordData.varData.VAR18 + recordData.varData.VAR17 + getDay(recordData.varData.VAR17); //YYMMDD por verificar
        // recordData.commonData.TAG_DF34 = false;
        // recordData.commonData.TAG_5A = false;
        recordData.commonData.CARDGRAPHICAL = true;
        recordData.commonData.CARDCARRIER = true; 
        //showParseCOOPED01(recordData); 
        if(isXML){
            return lineInputNTxml(recordData);
        }
        else{
            return lineInputNT(recordData,config.charSplit);
        }
    } 
    catch (err) {
        console.log(err);
        log.pushLog("parseCOOPED01:exception:" + err);
    } 
}

function showParseCOOPED01(recordData){
    console.log(
        recordData.varData.VAR01 + ";" + 
        recordData.commonData.SPACEPAN + ";" +
        recordData.varData.VAR02 + ";" +
        recordData.commonData.CHNAME + ";" +
        recordData.commonData.DSINCE + ";" +
        recordData.commonData.DTHRU + ";" +
        recordData.commonData.PAN + ";" +
        recordData.varData.VAR04 + ";" +
        recordData.varData.VAR05 + ";" +
        recordData.varData.VAR06 + ";" +
        recordData.commonData.TRACK1 + ";" +
        recordData.commonData.TRACK2 + ";" +
        recordData.varData.VAR08 + ";" +
        recordData.varData.VAR09 + ";" +
        recordData.varData.VAR10 + ";" +
        recordData.varData.VAR11 + ";" +
        recordData.varData.VAR12 + ";" +
        recordData.varData.VAR13 + ";" +
        recordData.varData.VAR14 + ";" +
        recordData.varData.VAR15 + ";" +
        recordData.varData.VAR16 + ";" +
        recordData.commonData.TAG_5F24 + ";"
     );
}

function lineInputNT(recordData,charSplit){
    var line = recordData.commonData.PAN.replace(/ /g,'') + charSplit + 
        recordData.commonData.DTHRU + charSplit +
        recordData.commonData.CHNAME.trim() + charSplit +
        recordData.commonData.TRACK1 + charSplit +
        recordData.commonData.TRACK2 + charSplit +
        recordData.commonData.TRACK3 + charSplit +
        recordData.commonData.CVC2 + charSplit +
        recordData.commonData.DSINCE + charSplit +
        recordData.commonData.CVC + charSplit +
        recordData.commonData.ICVV + charSplit +
        recordData.commonData.TYPEIF + charSplit +
        recordData.commonData.TRIGRAM_TH + charSplit +
        recordData.commonData.TRIGRAM_NT + charSplit +
        recordData.commonData.MASKPAN + charSplit +
        recordData.commonData.SPACEPAN + charSplit +
        recordData.commonData.CUSTOMER + charSplit +
        recordData.varData.VAR01 + charSplit +
        recordData.varData.VAR02 + charSplit +
        recordData.varData.VAR03 + charSplit +
        recordData.varData.VAR04 + charSplit +
        recordData.varData.VAR05 + charSplit +
        recordData.varData.VAR06 + charSplit +
        recordData.varData.VAR07 + charSplit +
        recordData.varData.VAR08 + charSplit +
        recordData.varData.VAR09 + charSplit +
        recordData.varData.VAR10 + charSplit +
        recordData.varData.VAR11 + charSplit +
        recordData.varData.VAR12 + charSplit +
        recordData.varData.VAR13 + charSplit +
        recordData.varData.VAR14 + charSplit +
        recordData.varData.VAR15 + charSplit + "\n";

    return line;
}

function lineInputDexxis(recordData,charSplit){

    var line = recordData.commonData.PAN + 
        recordData.varData.VAR01  +
        recordData.varData.VAR02  +
        recordData.varData.VAR03  +
        recordData.commonData.SERVICE_CODE  +
        recordData.varData.VAR04  +
        recordData.varData.VAR05  +
        recordData.varData.VAR06  +
        recordData.varData.VAR07  + "\n";

    return line;
}

function lineInputNTxml(recordData){
    let line = "<Card CardID=\""+recordData.commonData.MASKPAN+"\" PAN=\""+recordData.commonData.PAN.replace(/ /g,'')+
    "\" CardHolderName=\""+recordData.commonData.CHNAME+"\">\n";
    
    /*let line = "<Card CardID=\""+recordData.commonData.MASKPAN+"\" PAN=\""+recordData.commonData.PAN.replace(/ /g,'')+
    "\" CardHolderName=\""+recordData.commonData.CHNAME.trim()+"\" SatelliteUID=\""+recordData.commonData.TRIGRAM_NT+"\">\n";
    /*
    /* if(recordData.commonData.CARDCARRIER){
        line = line + "<CardCarrier CarrierValue=\""+ recordData.varData.VAR08 +"\" CarrierPos=\"1\" />\n";
        line = line + "<CardCarrier CarrierValue=\""+ recordData.varData.VAR13 +"\" CarrierPos=\"2\" />\n";
    
    }
    if(recordData.commonData.CARDGRAPHICAL){
        line = line + "<CardGraphical GraphValue=\""+ recordData.varData.VAR10 +"\" GraphPos=\"1\" />\n";
        line = line + "<CardGraphical GraphValue=\""+ recordData.varData.VAR11 +"\" GraphPos=\"2\" />\n";
    }
    line = line +
    "<CardMagnetical MagneticalValue=\""+recordData.commonData.TRACK1+"\" MagPos=\"1\"/>\n" +
    "<CardMagnetical MagneticalValue=\""+recordData.commonData.TRACK2+"\" MagPos=\"2\"/>\n";
    if(recordData.commonData.TRACK3){
        line = line + "<CardMagnetical MagneticalValue=\""+recordData.commonData.TRACK3+"\" MagPos=\"3\"/>\n";
    }
    */

    line = line +
    "<ElectricalData>\n<EMVApplication AID=\""+recordData.commonData.AID+"\">\n" +
    //"<EMVElement Tag=\"57\" Value=\""+recordData.commonData.TAG_57+"\"/>\n" +
    "<EMVElement Tag=\"8F\" Value=\""+recordData.commonData.TAG_8F +"\"/>\n" +
    "<EMVElement Tag=\"5F34\" Value=\""+recordData.commonData.TAG_5F34 +"\"/>\n" +
    "<EMVElement Tag=\"5F24\" Value=\""+recordData.commonData.TAG_5F24 + "\"/>\n";
    if(recordData.commonData.TAG_DF34){
        line = line + "<EMVElement Tag=\"DF34\" Value=\""+recordData.commonData.TAG_DF34+"\"/>\n";
    }
    if(recordData.commonData.TAG_5F30){
        line = line + "<EMVElement Tag=\"5F30\" Value=\""+recordData.commonData.TAG_5F30 +"\"/>\n";
    }
    
    line = line + "</EMVApplication>\n" +
    "</ElectricalData>\n";

   /* if(recordData.commonData.CARDCARRIER){
        line = line + "<CardCarrier CarrierPos=\"1\" CarrierValue=\""+ recordData.varData.VAR08 +"\"/>\n";
        line = line + "<CardCarrier CarrierPos=\"2\" CarrierValue=\""+ recordData.varData.VAR13 +"\"/>\n";
        line = line + "<CardCarrier CarrierPos=\"3\" CarrierValue=\""+ recordData.varData.VAR14 +"\"/>\n";
        line = line + "<CardCarrier CarrierPos=\"4\" CarrierValue=\""+ recordData.varData.VAR15 +"\"/>\n";
        line = line + "<CardCarrier CarrierPos=\"5\" CarrierValue=\""+ recordData.varData.VAR16 +"\"/>\n";
        line = line + "<CardCarrier CarrierPos=\"1\" CarrierValue=\""+ ascii_to_hex(recordData.commonData.CHNAME) +"\"/>\n";
        line = line + "<CardCarrier CarrierPos=\"2\" CarrierValue=\""+ ascii_to_hex(recordData.commonData.MASKPAN) +"\"/>\n";
    }*/

    line = line + "</Card>\n";


    return line;
}

function ascii_to_hex(str)
{
    var arr1 = [];
    for(var i=0;i<str.length;i++)
    {
        var hex = Number(str.charCodeAt(i)).toString(16).toUpperCase();
        arr1.push(hex);
    }
    return arr1.join('');
}

function paddingEnd(str,num){
    if(str.length>num){
        str = str.substring(0,num);
    }
    else if(str.length<num){
        str = str.padEnd(num," ");
    }
    return str;
}

function getDay(month){
    if(month=="02"){
        return "28"
    }
	else if(month =="01" || month =="03" || month =="05" || month =="07" || month =="08" || month =="10" || month =="12"){
        return "31"
    }
	else{
        return "30"
    }
}

/*function getDay(month){
    if(month=="02"){
        return "28"
    }
	else if(month !=04 && month !=06 && month !=09 && month !=11){
        return "30"
    }
	else{
        return "31"
    }
}*/

/*         //No incluye dia 31
function getDay(month){
    if(month=="02"){
        return "28"
    }
    else {
        return "30"
    }
}
*/
function hex_to_ascii(str1)
 {
	var hex  = str1.toString();
	var str = '';
	for (var n = 0; n < hex.length; n += 2) {
		str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	}
	return str;
 }
module.exports = getRecordLine;
