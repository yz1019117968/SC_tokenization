const parser = require('solidity-parser-antlr')
const fs = require('fs')
const parseCodeToSeq = require('./visitor').parseCodeToSeq


function outputResults(seqDir,locDir,errorDir,parseCodeToSeq){
    fs.readdir(process.cwd()+"/ContractSourceCode/", function (err, files) {
        if (err) {
          console.log(err);
          return;
        }
        var count = files.length;
        console.log(count)
        files.forEach(function (filename) {
          var data = fs.readFileSync(process.cwd()+"/uniqueContractSourceCode/"+filename,"UTF-8");
        //   console.log(data)
            try {
  
                count = count - 1;
                console.log("The "+count+"th file: "+filename)
                returnValue = parseCodeToSeq(data)
                struct_seq = returnValue['struct_seq']
                struct_loc = returnValue['struct_loc']
                // console.log(struct_seq)
                // console.log(struct_loc)
                // console.log(struct_seq.split(" ").length)
                // console.log(struct_loc.split(" ").length)
                // console.log(output)
                if(struct_seq.split(" ").length == struct_loc.split(" ").length){
                fs.writeFileSync(process.cwd()+"/"+seqDir+"/"+filename,struct_seq)
                fs.writeFileSync(process.cwd()+"/"+locDir+"/"+filename,struct_loc)
                }else{
                  fs.writeFileSync(process.cwd()+"/"+errorDir+"/"+filename,"length not match")
                }
            } catch (e) {
                if (e instanceof parser.ParserError) {
                  fs.writeFileSync(process.cwd()+"/"+errorDir+"/"+filename,e.errors[0]['message']+e.errors[0]['line'])
                    console.log("Parse Error",e.errors[0]['message'])
                }
            }
            if (count <= 0) {
              console.log("all files completed!")
            }
        });
      });
    }