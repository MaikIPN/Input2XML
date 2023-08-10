const gpg = require("gpg");
var http = require('http');
var fs = require('fs');
var log = require('./log-file');
var path = require('./config-files');

var idCH = "";
var intMail = "";
var trigram = "";
var fileEncrypted = "";
var fileDecrypted = "";


const privateKey = `-----BEGIN PGP PRIVATE KEY BLOCK-----

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
7Df6mIi2jLjTvhIznpbre2uKd2JFAGFzvUwzxQ==
=bQOJ
-----END PGP PRIVATE KEY BLOCK-----`;

function main(listFiles){
    try{
        var chk = log.pullFileSt("gpgFile");
        if(chk=="false"){
            log.pushFileSt("true","gpgFile");
            processFile(listFiles);
        }
        else{
            log.pushLog("gpgfile:main:the processfile is running");
        }
    }
    catch(err){
        console.log(err);
        process.exit(1);
    }
};

function processFile(listFiles){
    try{
        log.pushLog("gpgfile:processfile:listFile:"+listFiles);
        var arrayListFiles = listFiles.split(",");
        console.log(arrayListFiles.length);
        for(var j=0;j<arrayListFiles.length;j++){
            //console.log(arrayListFiles[j]);
            listDirFiles(arrayListFiles[j]);
        }
        log.pushFileSt("false","gpgfile");
    }
    catch(err){
        log.pushLog("gpgfile:processfile:exception:" + err);
    }
}

function listDirFiles(fileName){
    var src = path.gpgfiles;
    try{
        log.pushLog("gpgfile:listDirFiles:"+src +"/"+ fileName);

            var dateFilesM = [];
            var dateFilesN = [];
            var sizeFiles = [];
            var nameFiles = [];
    
            log.pushLog("gpgfile:listDirFiles:"+src+"/"+fileName);
            log.readLineFile(src+fileName);
            nameFiles.push(fileName); 
            var input = src+"/"+fileName;
            fs.stat(input,(err,stats)=>{
                if(err){
                    log.pushLog("gpgfile:listDirFiles:stat:" + err);
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
                //log.pushLog("MOVE FILE "+ nameFiles[sizeFiles.length-1]+" OTRO "+src+" OTRO "+path.inputfiles+" OTRO "+dateFilesN[dateFilesN.length-1]);
                filedecrypt(nameFiles[sizeFiles.length-1],src,path.inputfiles);
                //moveFile(nameFiles[sizeFiles.length-1],src,path.outputfiles,dateFilesN[dateFilesN.length-1]);
                //fileDescription(nameFiles[sizeFiles.length-1],sizeFiles[sizeFiles.length-1],dateFilesM[dateFilesM.length-1]);
                //insertDB(nameFiles[sizeFiles.length-1],sizeFiles[sizeFiles.length-1],dateFilesM[dateFilesM.length-1]);
            });
                

    }
    catch(err){
        log.pushLog("gpgfile:listDirFiles:exception:"+err);
    }
}
function filedecrypt(fileName,src,dest){
    try{

        
        fileEncrypted = src + "/" + fileName;
        fileDecrypted = dest+"/"+fileName+".txt";
        
        gpg.importKey(privateKey, [], (success, err) => {
          gpg.decryptFile(fileEncrypted,
            (err, success) => {
                if(err){
                    log.pushLog("gpgfile:filedecrypt:error: "+err);
                    moveFile(fileName,src,path.gpgfileserror);
                }else{
                    if(success){
                        log.pushLog("Decrypt procces: decripting ")
                        gpg.decryptToFile(
                            {
                            source: fileEncrypted,
                            dest: fileDecrypted,
                            },
                            (err, success) => {
                            if(err){
                                log.pushLog("gpgfile:filedecrypt:error: "+err);
                                moveFile(fileName,src,path.gpgfileserror);
                            }else{
                                log.pushLog("Decrypt procces: success ")
                                moveFile(fileName,src,path.gpgfilesbackup);
                            }
                            }
                        )
                    }
                    else{
                        log.pushLog("Decrypt procces: else "+ success + " error " + err)
                        moveFile(fileName,src,path.gpgfileserror);
                    }
                }
            }
          )
        })

    }
    catch(err){
        log.pushLog("processfile:moveFile:exception:"+err);
    }
}

function moveFile(fileName,src,dest){
    try{
        //var chName = trigram+"_"+idCH+"_0_"+date+"_"+fileName;
        var chName = fileName;
        fs.rename(src+"/"+fileName, dest+chName, (err) =>{
            if(err){
                log.pushLog("gpgfile:moveFile:" + err);
            }
            else{
                log.pushLog("gpgfile:moveFile:" + src+"/"+fileName+" moved to "+dest+chName);
            }
        })
    }
    catch(err){
        log.pushLog("gpgfile:moveFile:exception:"+err);
    }
}
/*
*/

module.exports = main;
