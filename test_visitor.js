/*
    test the parseCodeToSeq function by some instances.
*/
const parseCodeToSeq = require('./visitor_sbt_struct').parseCodeToSeq
const tests = require('./testcode')
seq = parseCodeToSeq(tests.assemblyfunc1)
console.log(seq)
console.log("Total Length: ", seq.split(" ").length)