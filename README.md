### Smart Contract Tokenization Tool-kit
#### General Introduction for the Whole Framework
- visitor.js: A kind of structural-based traversal method similar to [SBT](https://ieeexplore.ieee.org/abstract/document/8973050). 
- visitor_sbt.js: A kind of SBT method adapted to smart contracts.
- visitor_sbt_struct.js: A kind of SBT method with only "type" to represent only structure semantic of code, which is also applicable to smart contract, adapted from [Hu et al.](https://link.springer.com/article/10.1007/s10664-019-09730-9).
- visitor_xml.js: Transform a piece of smart contract code snippet to xml format Abstract Sybtax Tree(AST).
- tokenizer.py: Tokenize source code for smart contracts.
- testcode.js: Some sample code for testing above methods.
- test_visitor.js: If you want to run a sample code by above visitor_* method, use this function.
- parse_SCs.js: Run above visitor_* methods in batch.
- main.js: Main function.
  