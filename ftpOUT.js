///////Zone One////////
var http = require('http');
var fs = require('fs');
var log = require('./log-file');
var path = require('./config-files');
var mongojs = require('mongojs');
var db = mongojs(path.mongoDB);

///////Zone One////////
///////Zone Two////////
function main(listFiles){
    try{
        var chk = log.pullFileSt("ftpOUT");
        if(chk=="false"){
            log.pushFileSt("true","ftpOUT");
            ftpFile(listFiles);
        }
        else{
            log.pushLog("ftpOUT:main:the ftpOUT is running");
        }
    }
    catch(err){
        console.log(err);
        process.exit(1);
    }
};
///////Zone Two////////
///////Zone Three////////
function ftpFile(listFiles){
    try{
        log.pushLog("ftpOUT:ftpfile:listFile:"+listFiles);
        var arrayListFiles = listFiles.split(",");
        console.log(arrayListFiles.length);
        for(var j=0;j<arrayListFiles.length;j++){
            //console.log(arrayListFiles[j]);
            listDirFiles(arrayListFiles[j]);
        }
        log.pushFileSt("false","ftpOUT");
    }
    catch(err){
        log.pushLog("ftpOUT:ftpfile:exception:" + err);
    }
}

function listDirFiles(fileName){
    var src = path.ntOutputfiles;
    try{
            log.pushLog("ftpOUT:listDirFiles:"+src +"/"+ fileName);

            var dateFilesM = [];
            var dateFilesN = [];
            var sizeFiles = [];
            var nameFiles = [];
        
            //var chk = metodosftp;
            log.pushLog("ftpOUT:listDirFiles:****MetodoSFTPInvoque****:"+src+"/"+fileName);
            
            nameFiles.push(fileName); 
            var input = src+"/"+fileName;
            fs.stat(input,(err,stats)=>{
                if(err){
                    log.pushLog("ftpOUT:listDirFiles:stat:" + err);
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
                moveFile(nameFiles[sizeFiles.length-1],src,path.ftpOutputfiles,dateFilesN[dateFilesN.length-1]);
                fileDescription(nameFiles[sizeFiles.length-1],sizeFiles[sizeFiles.length-1],dateFilesM[dateFilesM.length-1]);
                insertDB(nameFiles[sizeFiles.length-1],sizeFiles[sizeFiles.length-1],dateFilesM[dateFilesM.length-1]);
            });
                

    }
    catch(err){
        log.pushLog("ftpOUT:listDirFiles:exception:"+err);
    }
}

function moveFile(fileName,src,dest,date){
    try{
        //var chName = trigram+"_"+idCH+"_0_"+date+"_"+fileName;
        var chName = fileName;
        fs.rename(src+"/"+fileName, dest+chName, (err) =>{
            if(err){
                log.pushLog("ftpOUT:moveFile:" + err);
            }
            else{
                log.pushLog("ftpOUT:moveFile:" + src+"/"+fileName+" moved to "+dest+chName);
            }
        })
    }
    catch(err){
        log.pushLog("ftpOUT:moveFile:exception:"+err);
    }
}

function fileDescription(fileName,size,time){
    try{
        var message = "\n" + "CANAL: " + fileName.substring(6,11) + "\n" +
                      "HORA LLEGADA: " + time + "\n" +
                      "NOMBRE: " + fileName + "\n" +
                      "TRIGRAMA: " + fileName.substring(0,5) + "\n" +
                      "SIZE(Bytes): " + size + "\n";
        log.pushLog("ftpOUT:fileDescription:" + message);
                    
    }
    catch(err){
        log.pushLog("ftpOUT:sendMail:exception:"+err);
    }
}
function insertDB(fileName,size,time){
    try{
        var inDataFile = {
            channel: String,
            time: String,
            name: String,
            trigram: String,
            size: Number,
            response: Number,
            countRes: Number,
        };
        inDataFile.channel = fileName.substring(6,11);
        inDataFile.time = time;
        inDataFile.name = fileName;
        inDataFile.trigram = fileName.substring(0,5);
        inDataFile.size = size;
        inDataFile.response = 0;
        inDataFile.countRes = 0;
        db.ftpOUT.insert(inDataFile);
    }
    catch(err){
        log.pushLog("ftpOUT:insertDB:exception:"+err);
    }
}


module.exports = main;