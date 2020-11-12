/*
    test the parseCodeToSeq function by some instances.
*/
const parseCodeToSeq = require('./visitor').parseCodeToSeq
const tests = require('./testcode')
seq = parseCodeToSeq(tests.assemblyfunc)
console.log(seq)
console.log("Total Length: ", seq.split(" ").length)