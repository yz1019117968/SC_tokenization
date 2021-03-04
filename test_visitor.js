/*
    test the parseCodeToSeq function by some instances.
*/
const parseCodeToSeq = require('./visitor_sbt').parseCodeToSeq
const tests = require('./testcode')
seq = parseCodeToSeq(tests.functioncode2)
console.log(seq)
console.log("Total Length: ", seq.split(" ").length)