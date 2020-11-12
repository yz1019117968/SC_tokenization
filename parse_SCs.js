const parser = require('solidity-parser-antlr')
const fs = require('fs')


exports.outputResults = function outputResults(contractsFolder,readDir,seqDir, errorDir,parseCodeToSeq){
    
    var readFolderPath = process.cwd()+"/"+readDir+"/"+contractsFolder
    var writeFolderPath = process.cwd()+"/"+seqDir+"/"+contractsFolder
    var files = fs.readdirSync(readFolderPath+"/")
    var count = files.length;
    for(var filename of files){
      var data = fs.readFileSync(readFolderPath+"/"+filename,"UTF-8");
      try {
          console.log(contractsFolder+"/"+filename)
          count = count - 1;
          var seq = parseCodeToSeq(data)
          if (fs.existsSync(writeFolderPath)) {
            fs.writeFileSync(writeFolderPath+"/"+filename, seq)
          }else{
            fs.mkdirSync(writeFolderPath)
            fs.writeFileSync(writeFolderPath+"/"+filename, seq)
          }   
      } catch (e) {
          var errorPath = process.cwd()+"/"+errorDir+"/"+contractsFolder
          if (e instanceof parser.ParserError) {
            if(fs.existsSync(errorPath)){
              fs.writeFileSync(errorPath+"/"+filename,e.errors[0]['message']+e.errors[0]['line'])
              // console.log("Parse Error ",e.errors[0]['message'])
            }else{
              fs.mkdirSync(errorPath)
              fs.writeFileSync(errorPath+"/"+filename,e.errors[0]['message']+e.errors[0]['line'])
              // console.log("Parse Error ",e.errors[0]['message'])
            }
          }
        }
        if (count <= 0) {
          console.log(contractsFolder+ " completed!")
        }
      }
    }


