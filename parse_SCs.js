const parser = require('solidity-parser-antlr')
const fs = require('fs')
const parseCodeToSeq = require('./visitor').parseCodeToSeq


function outputResults(contract_folder,errorDir,parseCodeToSeq){
    fs.readdir(process.cwd()+"/funcs_comments_v11112020/"+contract_folder+"/", function (err, files) {
        if (err) {
          console.log(err);
          return;
        }
        var count = files.length;
        console.log(count)
        files.forEach(function (filename) {
          var data = fs.readFileSync(process.cwd()+"/funcs_comments_v11112020/"+contract_folder+"/"+filename,"UTF-8");
            try {
                count = count - 1;
                console.log("The "+count+"th file: "+filename)
                seq = parseCodeToSeq(data)
                console.log(seq)
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