///////Zone One////////
var http = require('http');
var fs = require('fs');
var log = require('./log-file');
var path = require('./config-files');

var idCH = "";
var intMail = "";
var trigram = "";

///////Zone One////////
///////Zone Two////////
function main(listFiles){
    try{
        var chk = log.pullFileSt("ftpIN");
        if(chk=="false"){
            log.pushFileSt("true","ftpIN");
            respFile(listFiles);
        }
        else{
            log.pushLog("ftpIN:main:the ftpIN is running");
        }
    }
    catch(err){
        console.log(err);
        process.exit(1);
    }
};
///////Zone Two////////
///////Zone Three////////
function respFile(listFiles){
    try{
        log.pushLog("ftpIN:respfile:listFile:"+listFiles);
        var arrayListFiles = listFiles.split(",");
        console.log(arrayListFiles.length);
        for(var j=0;j<arrayListFiles.length;j++){
            //console.log(arrayListFiles[j]);
            listDirFiles(arrayListFiles[j]);
        }
        log.pushFileSt("false","ftpIN");
    }
    catch(err){
        log.pushLog("ftpIN:respfile:exception:" + err);
    }
}

function listDirFiles(fileName){
    var src = path.ftpInputfiles;
    try{
        log.pushLog("ftpIN:listDirFiles:"+src +"/"+ fileName);

            var dateFilesM = [];
            var dateFilesN = [];
            var sizeFiles = [];
            var nameFiles = [];
                
            //log.readLineFile(src+fileName);
            //log.pushLog("ftpIN:listDirFiles:****MetodoSFTPInvoque****:"+src+"/"+fileName);

            if(fileName.indexOf("Report.txt")!=-1){
                log.readTxtFile(fileName);
            }
            if(fileName.indexOf("Report.xml")!=-1){
                log.readXmlFile(fileName);
            }
            if(fileName.indexOf("Report.zip")!=-1){
                log.pushLog("ftpIN:listDirFiles:****Invoque .ZIP file Verificar la carpeta****:"+src+"/"+fileName);
            }
            
            nameFiles.push(fileName); 
            var input = src+"/"+fileName;
            fs.stat(input,(err,stats)=>{
                if(err){
                    log.pushLog("ftpIN:listDirFiles:stat:" + err);
                }
                else{
                    dateFilesM.push(stats.ctime.getFullYear()+"-"+ log.getPadLeft2((stats.ctime.getMonth()+1).toString())+"-"+ 
                                log.getPadLeft2(stats.ctime.getDate().toString()) +" "+ log.getPadLeft2(stats.ctime.getHours().toString()) +
                                ":" + log.getPadLeft2(stats.ctime.getMinutes().toString())+":"+log.getPadLeft2(stats.ctime.getSeconds().toString()));
                    dateFilesN.push(stats.ctime.getFullYear()+log.getPadLeft2((stats.ctime.getMonth()+1).toString())+ 
                                log.getPadLeft2(stats.ctime.getDate().toString()) + log.getPadLeft2(stats.ctime.getHours().toString()) +
                                log.getPadLeft2(stats.ctime.getMinutes().toString())+log.getPadLeft2(stats.ctime.getSeconds().toString()));
                    sizeFiles.push(stats.size.toString());
                    
                }
                moveFile(nameFiles[sizeFiles.length-1],src,path.valOutputfiles,dateFilesN[dateFilesN.length-1]);
                fileDescription(nameFiles[sizeFiles.length-1],sizeFiles[sizeFiles.length-1],dateFilesM[dateFilesM.length-1]);
                //insertDB(nameFiles[sizeFiles.length-1],sizeFiles[sizeFiles.length-1],dateFilesM[dateFilesM.length-1]);
            });
                

    }
    catch(err){
        log.pushLog("ftpIN:listDirFiles:exception:"+err);
    }
}

function moveFile(fileName,src,dest,date){
    try{
        //var chName = trigram+"_"+idCH+"_0_"+date+"_"+fileName;
        var chName = fileName;
        fs.rename(src+"/"+fileName, dest+chName, (err) =>{
            if(err){
                log.pushLog("ftpIN:moveFile:" + err);
            }
            else{
                log.pushLog("ftpIN:moveFile:" + src+"/"+fileName+" moved to "+dest+chName);
            }
        })
    }
    catch(err){
        log.pushLog("ftpIN:moveFile:exception:"+err);
    }
}

function fileDescription(fileName,size,time){
    try{
        var message = "\n" + "CANAL: " + idCH + "\n" +
                      "HORA LLEGADA: " + time + "\n" +
                      "NOMBRE: " + fileName + "\n" +
                      "TRIGRAMA: " + trigram + "\n" +
                      "SIZE(Bytes): " + size + "\n";
        log.pushLog("ftpIN:fileDescription:" + message);
                    
    }
    catch(err){
        log.pushLog("ftpIN:sendMail:exception:"+err);
    }
}



module.exports = main;