const parseCodeToSeq = require('./visitor_xml').parseCodeToSeq
const outputResults = require('./parse_SCs').outputResults

const totalFolderNumber = 41
const readDir = "funcs_comments_v11122020"
const seqDir = "contracts_seqs_xml"
const errorDir = "error_contracts"

for(var i=1;i<=totalFolderNumber;i++){
    outputResults("contract"+i,readDir, seqDir, errorDir,parseCodeToSeq)
  }
// outputResults("contract1",readDir, seqDir, errorDir,parseCodeToSeq)