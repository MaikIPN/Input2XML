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
                return parseBANDEL(line,this.recordData,isXML);
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
            let customer = fileName.substring(6,11);
            let trigram = fileName.substring(0,5);
            let customerID = fileName.substring(14,28);
            let nCards = nLine-1;
            let batchID = trigram+fileName.substring(22,28);

            let lineOut = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n" + 
                       "<Customer Name=\""+customer+"\" Trigram=\""+trigram+"\">\n" +
                       "<InputFile CustomerRequestUID=\""+customerID+"\" Name=\""+fileName+".xml"+"\" DateTimeOfReception=\""+customerID+"\" CardQuantity=\""+nCards+"\">\n" +
                       "<Batch BatchID=\""+batchID+"\" CardQuantity=\""+nCards+"\" CardType=\"OE_TEST\" ArtWork=\"4121\" GraphRef=\"\" ElecRef=\"\">\n";
                

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

function parseBANDEL(line,recordData,isXML){
    try {
        recordData.varData.VAR01 = line.substring(1,2); //Indicador de tipo de impresion 
        recordData.commonData.SPACEPAN = line.substring(5,30).replace(/~,~/g," "); //Nro. Plastico
        recordData.varData.VAR02 = line.substring(33,59); //Nombre de la entidad
        recordData.varData.VAR03 = line.substring(62,88); //Nombre 2 
        recordData.commonData.DSINCE = line.substring(91,96); //Fecha apertura
        recordData.commonData.DTHRU = line.substring(99,104); //Fecha vencimiento
        recordData.commonData.PAN = line.substring(107,123); //Nro. Plastico
        recordData.commonData.SERVICE_CODE = line.substring(130,133); //Información
        recordData.varData.VAR04 = line.substring(126,138); //Información completa
        recordData.varData.VAR05 = line.substring(141,142); //Codigo de generación 
        recordData.varData.VAR06 = line.substring(145,146); // FIJO-0
        recordData.varData.VAR06 = line.substring(149,150); // FIJO-A
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
     /* recordData.commonData.MASKPAN = recordData.commonData.PAN.replace(/ /g,'').substring(0,5) + "****" + recordData.commonData.PAN.replace(/ /g,'').substring(10,15);  
        recordData.commonData.SPACEPAN = recordData.commonData.PAN.replace(/ /g,'').substring(0,4) + " " + recordData.commonData.PAN.replace(/ /g,'').substring(4,8) + " " + recordData.commonData.PAN.replace(/ /g,'').substring(8,12) + " " + recordData.commonData.PAN.replace(/ /g,'').substring(12,16); 
     */  
        recordData.commonData.CUSTOMER = "BANDEL";
        recordData.commonData.AID = "A000000536"; 
     /* recordData.commonData.TAG_57 = recordData.commonData.TRACK2.replace("=","D").substring(0,29)+recordData.commonData.CVC+"00000F";
        recordData.commonData.TAG_8F = "EF";
        recordData.commonData.TAG_5F34 = "01";
        recordData.commonData.TAG_5F30 = recordData.commonData.SERVICE_CODE;
        recordData.commonData.TAG_5A = recordData.commonData.PAN;
        recordData.commonData.TAG_DF34 = false;
        recordData.commonData.TAG_5A = false;
        recordData.commonData.CARDGRAPHICAL = true;
        recordData.commonData.CARDCARRIER = true; 
     */
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
        log.pushLog("parseBNC:exception:" + err);
    } 
}

function showParseBANDEL(recordData){
    console.log(
        recordData.varData.VAR01 + ";" + 
        recordData.commonData.SPACEPAN + ";" +
        recordData.varData.VAR02 + ";" +
        recordData.varData.VAR03 + ";" +
        recordData.commonData.DSINCE + ";" +
        recordData.commonData.DTHRU + ";" +
        recordData.commonData.PAN + ";" +
        recordData.varData.VAR04 + ";" +
        recordData.varData.VAR05 + ";" +
        recordData.varData.VAR06 + ";" 
     );
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

function lineInputNTxml(recordData){
    let line = "<Card CardID=\""+recordData.commonData.MASKPAN+"\" PAN=\""+recordData.commonData.PAN.replace(/ /g,'')+
    "\" CardHolderName=\""+recordData.commonData.CHNAME.trim()+"\" SatelliteUID=\""+recordData.commonData.TRIGRAM_NT+"\">\n" + 
    "<CardMagnetical MagneticalValue=\""+recordData.commonData.TRACK1+"\" MagPos=\"1\"/>\n" +
    "<CardMagnetical MagneticalValue=\""+recordData.commonData.TRACK2+"\" MagPos=\"2\"/>\n";
    if(recordData.commonData.TRACK3){
        line = line + "<CardMagnetical MagneticalValue=\""+recordData.commonData.TRACK3+"\" MagPos=\"3\"/>\n";

    }
    line = line +
    "<ElectricalData>\n<EMVApplication AID=\""+recordData.commonData.AID+"\">\n" +
    "<EMVElement Tag=\"57\" Value=\""+recordData.commonData.TAG_57+"\"/>\n" +
    "<EMVElement Tag=\"8F\" Value=\""+recordData.commonData.TAG_8F +"\"/>\n" +
    "<EMVElement Tag=\"5F34\" Value=\""+recordData.commonData.TAG_5F34 +"\"/>\n";
    if(recordData.commonData.TAG_DF34){
        line = line + "<EMVElement Tag=\"DF34\" Value=\""+recordData.commonData.TAG_DF34+"\"/>\n";
    }
    if(recordData.commonData.TAG_5F30){
        line = line + "<EMVElement Tag=\"5F30\" Value=\""+recordData.commonData.TAG_5F30 +"\"/>\n";
    }
    
    line = line + "</EMVApplication>\n" +
    "</ElectricalData>\n";

    if(recordData.commonData.CARDGRAPHICAL){
        line = line + "<CardGraphical GraphPos=\"1\" GraphValue=\""+ ascii_to_hex(recordData.commonData.SPACEPAN) +"\"/>\n";
        line = line + "<CardGraphical GraphPos=\"2\" GraphValue=\""+ ascii_to_hex(recordData.commonData.CHNAME) +"\"/>\n";
    }
    if(recordData.commonData.CARDCARRIER){
        line = line + "<CardCarrier CarrierPos=\"1\" CarrierValue=\""+ ascii_to_hex(recordData.commonData.CHNAME) +"\"/>\n";
        line = line + "<CardCarrier CarrierPos=\"2\" CarrierValue=\""+ ascii_to_hex(recordData.commonData.MASKPAN) +"\"/>\n";
    }

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

module.exports = getRecordLine;