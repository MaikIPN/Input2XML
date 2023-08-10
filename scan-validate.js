var http = require('http');
var fs = require('fs');
var log = require('./log-file');
var path = require('./config-files');
var mongojs = require('mongojs');
var db = mongojs(path.mongoDB);

var idInter = null;
var inter = 0;
var numInter = 0;
var timeInter = 0;

function main(arg){
    try{
        
        log.pushLog("scan-validate:main:"+arg);
        var chk = log.pullFileSt("scanValidate");
        if(chk=="false"){
            log.pushFileSt("true","scanValidate");
            inter = 0;
            numInter = path.nIntScanValidate;
            timeInter = path.tIntScanValidate;
            idInter = setInterval(respFile,timeInter);
            log.pushLog("scan-validate:interval:"+timeInter+" ms "+numInter+" time(s)");
        }
        else{
            log.pushLog("scan-validate:main:the validate is running");
        }
    }
    catch(err){
        console.log(err);
        process.exit(1);
    }
};

function respFile(){
    try{
        log.pushLog("scan-validate:resp-dir:ftpFiles:"+path.ftpInputfiles);
        var forceStop = log.pullFileSt("scanValidate");
        if(forceStop=="false"){
            log.pushLog("scan-validate:resp-dir:stop_interval_idleStart:"+idInter._idleStart + " repeat:" + idInter._repeat);
            log.pushFileSt("false","scanValidate");
            clearInterval(idInter);
        }
        else{
            listDirFiles();
            inter++;
        }
        
    }
    catch(err){
        log.pushLog("scan-validate:resp-dir:exception:" + err);
    }
}

function listDirFiles(){
    var src = path.valOutputfiles;
    try{
        log.pushLog("scan-validate:listDirFiles:"+src);

        fs.readdir(src,(err,list)=>{
            if(err){
                log.pushLog("scan-validate:listDirFiles:fs:"+err);
            }
            if(list!=null){
                if(list.length>0){
                    log.pushLog("scan-validate:listDirFiles:there are " + list.length + " files");
                    
                    
                    var inData = {
                        validate: Number,
                    };
                    inData.validate = 0;

                    var inQuery = {
                        name: Number,
                        status: Number,
                        message: Number,
                        record_ok: Number,
                        record_nok: Number,
                        validate: Number,
                        time: Number,
                    };
                    inQuery.name = 1;
                    inQuery.status = 1;
                    inQuery.message = 1;
                    inQuery.record_ok = 1;
                    inQuery.record_nok = 1;
                    inQuery.validate = 1;
                    inQuery.time = 1;
                    
                    db.txtFiles.find(inData,inQuery).toArray(function(err, result){
                        if(err){
                            log.pushLog("scan-validate:CountFTPout:exception:"+err);
                        }
                        else{
                            
                            console.log(result);
                            
                            if(result.length>0)
                            {
                                for(var j=0;j<result.length;j++){
                                    log.pushLog("scan-validate:ValidateFiles: "+ result[j].name + " status = "+ result[j].status);
                                
                                    if(result[j].status=="Failed"){
                                        log.pushLog("scan-validate:Validate:Move to Backup Process");
                                        log.pushLog("scan-validate:Validate:Move to Channel Output");
                                    }
                                    else{
                                        log.pushLog("scan-validate:Validate:Move to Backup Error");
                                    }

                                    var auxName = result[j].name;
                                    
                                    console.log(auxName);

                                    db.ftpOUT.update({name: auxName },{$inc: {response: 1}},function(){});

                                    log.pushLog("scan-validate:ValidateFileMail:*****Notification Mail*****");
                                    var message = "\n" + "CANAL: " + result[j].name.substring(14,19) + "\n" +
                                                    "HORA LLEGADA: " + result[j].time + "\n" +
                                                    "NOMBRE: " + result[j].name + "\n" +
                                                    "STATUS: " + result[j].status + "\n" +
                                                    "TRIGRAMA: " + result[j].name.substring(8,13) + "\n" +
                                                    "REGISTROS OK: " + result[j].record_ok + "\n" +
                                                    "REGISTROS NOK: " + result[j].record_nok + "\n" +
                                                    "ERROR: " + result[j].message + "\n";
                                    log.pushLog("scan-validate:ValidateFileMail:" + message);
                                    log.pushLog("scan-validate:ValidateFileMail:*****Notification Mail*****"); 
                                }

                                db.txtFiles.update(inData,{$inc: {validate: 1}}, {multi: true},function(){});
                            }
                            else{
                                log.pushLog("scan-validate:listDirFiles:*****No pending files*****");
                            }
                        }
                    });
                }
                else{
                    log.pushLog("scan-validate:listDirFiles:No file found");
                }
            }
            else{
                log.pushLog("scan-validate:listDirFiles:No Dir found");
            }
        });
    }
    catch(err){
        log.pushLog("scan-validate:listDirFiles:exception:"+err);
    }
}

function getClassRespFile(listFiles){
    try{
        log.pushLog("scan-validate:getClassFTPFile:execute:listFiles:" + listFiles);
        var params = {
            hostname: path.server,
            port: path.port,
            path: '/ftpin/'+listFiles
        }
        http.get(params, function(response){
            if(response.statusCode == 200){
                response.on('data',function(data){
                    inData = JSON.parse(data);
                    log.pushLog("scan-validate:getFTPProcessFile:execute:" + inData.execute);
                })
            }
            else{
                log.pushLog("scan-validate:getClassFTPFile:statusCode:" + response.statusCode);
            }
        });
    }
    catch(err){
        log.pushLog("scan-validate:getClassFTPFile:exception:"+err);
    }
}



module.exports = main;