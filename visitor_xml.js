const parser = require('solidity-parser-antlr') 

/*
    Parse smart contracts code to xml.
*/
exports.parseCodeToSeq = function parseCodeToSeq(textcode){
  var ast = parser.parse(textcode)
  var seq = ""
  parser.visit(ast, 
  {
    ModifierDefinition:function(node) {
        seq += "<ModifierDefinition><SimpleName>"+node['name']+"</SimpleName>"
    },
    "ModifierDefinition:exit":function(node){
        seq += "</ModifierDefinition>"
    },
    ModifierInvocation:function(node) {
        seq += "<ModifierInvocation>" 
        seq += "<SimpleName>"+node['name']+"</SimpleName>"
    },
    "ModifierInvocation:exit":function(node){
        seq += "</ModifierInvocation>"
    },
    Block:function(node) {
        seq += "<Block>"
    },
    "Block:exit":function(node) {
        seq += "</Block>"
    },

    // Needn't care returns variables for those only consist type
    FunctionDefinition:function(node) {
        seq += "<FunctionDefinition>"
        seq += "<SimpleName>" + node['name'] + "</SimpleName>"
        // 'public' | 'private' | 'external' | 'internal'
        if(node['visibility']){
            seq += "<Visibility>" + node['visibility'] + "</Visibility>"
        }
        // 'pure' | 'constant' | 'view' | 'payable'
        if(node['stateMutability']){
            seq += "<StateMutability>" + node['stateMutability'] + "</StateMutability>"
        }
        if(node['returnParameters']){
            seq += "<ReturnParameters>"
            for(i = 0; i < Object.keys(node['returnParameters']).length; i++){
                seq += "<VariableDeclaration>"
                if(node['returnParameters'][i]['storageLocation']){
                    seq += "<StorageLocation>"+node['returnParameters'][i]['storageLocation']+"</StorageLocation>"
                }
                if(node['returnParameters'][i]['name']){
                    seq += "<SimpleName>"+node['returnParameters'][i]['name']+"</SimpleName>"
                }
                node['returnParameters'][i]['visited'] = true
                if(node['returnParameters'][i]['typeName']['type'] == "ElementaryTypeName"){
                    seq += "<SimpleType><SimpleName>"+node['returnParameters'][i]['typeName']['name']+"</SimpleName></SimpleType>"
                    node['returnParameters'][i]['typeName']['visited'] = true
                }
                else if(node['returnParameters'][i]['typeName']['type'] == "UserDefinedTypeName"){
                    seq += "<SimpleType><SimpleName>"+node['returnParameters'][i]['typeName']['namePath']+"</SimpleName></SimpleType>"
                    node['returnParameters'][i]['typeName']['visited'] = true
                }
                
                seq += "</VariableDeclaration>"
            }
            seq += "</ReturnParameters>"
        }
    },
    "FunctionDefinition:exit":function(node){
        seq += "</FunctionDefinition>"
    },
    ElementaryTypeName:function(node){
        if(!node["visited"]){
            seq += "<SimpleType><SimpleName>"+node['name']+"</SimpleName></SimpleType>"
        }
    },
    UserDefinedTypeName:function(node){
        if(!node["visited"]){
            seq += "<SimpleType><SimpleName>"+node['namePath']+"</SimpleName></SimpleType>"
        }
    },
    VariableDeclaration:function(node){
        if(!node['visited']){
            seq += "<VariableDeclaration>"
            // only state variables have constant
            // only state variables have visibility
            // indexed only exits in events.
            // 'memory' | 'storage' | 'calldata'
            if(node['storageLocation']){
                seq += "<StorageLocation>"+node['storageLocation']+"</StorageLocation>"
            }
            if(node['name']){
                seq += "<SimpleName>"+node['name']+"</SimpleName>"
            }
        }
    },
    "VariableDeclaration:exit":function(node){
        if(!node['visited']){
            seq += "</VariableDeclaration>"
        }
    },
    Mapping:function(node){
        seq += "<Mapping>"
    },
    "Mapping:exit":function(node){
        seq += "</Mapping>"
    },
    ArrayTypeName:function(node) {
        seq += "<Array>"
    },
    "ArrayTypeName:exit":function(node){
        seq += "</Array>"
    },
    ExpressionStatement:function(node) {
        seq += "<ExpressionStatement>"
    },
    "ExpressionStatement:exit":function(node) {
        seq += "</ExpressionStatement>"
    },
    IfStatement:function(node) {
        seq += "<IfStatement>"
    },
    "IfStatement:exit":function(node) {
        seq += "</IfStatement>"
    },
    WhileStatement:function(node) {
        seq += "<WhileStatement>"
    },
    "WhileStatement:exit":function(node){
        seq += "</WhileStatement>"
    },
    ForStatement:function(node) {
        seq += "<ForStatement>"
    },
    "ForStatement:exit":function(node){
        seq += "</ForStatement>"
    },
    DoWhileStatement:function(node) {
        seq += "<DoWhileStatement>"
    },
    "DoWhileStatement:exit":function(node){
        seq += "</DoWhileStatement>"
    },
    ContinueStatement:function(node) {
        seq += "<ContinueStatement>continue</ContinueStatement>"
    },
    BreakStatement:function(node) {
        seq += "<BreakStatement>break</BreakStatement>"
    },
    ThrowStatement:function(node) {
        seq += "<ThrowStatement>Throw</ThrowStatement>"
    },
    ReturnStatement:function(node){
        seq += "<ReturnStatement>"
    },
    "ReturnStatement:exit":function(node){
        seq += "</ReturnStatement>"
    },
    EmitStatement:function(node) {
        seq += "<EmitStatement>"
    },
    "EmitStatement:exit":function(node){
        seq += "</EmitStatement>"
    },
    // placementholder "_" will also be treated as a variable in modifier
    Identifier:function(node){
        if(!node['visited']){
            seq += "<SimpleName>"+node['name']+"</SimpleName>"
        }
    },
    // Notice: functioName may be classified into Identifier/ElementaryTypeName domain in FunctionCall.
    FunctionCall:function(node){
        seq += "<FunctionCall>"
        // function directly called
        if(node['expression']['type'] == "Identifier"){
            seq += "<SimpleName>"+ node['expression']['name']+"</SimpleName>"
            node['expression']['visited'] = true
        }
        // new
        else if(node['expression']['type'] == "NewExpression"){
            seq += "<SimpleName>new</SimpleName>"
        }
        // // variable -> function
        // else if(node['expression']['type'] == "ElementaryTypeNameExpression"){
        //     seq += "FunctionName#"+ node['expression']['typeName']['name']+" "
        //     node['expression']["visited"] = true
        //     node['expression']['typeName']['visited'] = true
        // }
        // arguments name, if has. If do not have, is [] instead of null!
        if(Object.keys(node['names']).length != 0){
            for(i = 0; i< Object.keys(node['names']).length; i++){
                seq += "<SimpleName>"+node['names'][i] +"</SimpleName>"
            }
        }
    },
    "FunctionCall:exit":function(node){
        seq += "</FunctionCall>"
    },
    ElementaryTypeNameExpression:function(node){      
        seq += "<SimpleTypeExpression>"

    },
    "ElementaryTypeNameExpression:exit":function(node){
        seq += "</SimpleTypeExpression>"
    },


    // For assign value or self-statemented
    VariableDeclarationStatement:function(node){
        seq += "<VariableDeclarationStatement>"
        if(node['initialValue']){
            seq += "<BinaryOperation>=</BinaryOperation>"
        }
    },
    "VariableDeclarationStatement:exit":function(node){
        seq += "</VariableDeclarationStatement>"
    },
    TupleExpression:function(node) {
        seq += "<TupleExpression>"
    },
    "TupleExpression:exit":function(node){
        seq += "</TupleExpression>"
    },
    // only appear in assembly
    NumberLiteral:function(node) {
        if(/^0x[a-fA-F0-9]{40}/.exec(node['number'])==null){
            seq += "<NumberLiteral>$NUM$</NumberLiteral>"
        }else{
            seq += "<AddrLiteral>$ADDR$</AddrLiteral>"
        }
    },
    // only appear in assembly
    BooleanLiteral:function(node) {
        seq += "<BooleanLiteral>" + node['value'] + "</BooleanLiteral>"
    },
    StringLiteral:function(node){
        seq += "<StringLiteral>$STR$</StringLiteral>"
    },
    UnaryOperation:function(node){
        seq += "<UnaryOperation>"+node['operator']+"</UnaryOperation>"
    },
    BinaryOperation:function(node) {
        seq += "<BinaryOperation>"+node['operator']+"</BinaryOperation>"
    },
    Conditional:function(node) {
        seq += "<Conditional>"
    },
    "Conditional:exit":function(node){
        seq += "</Conditional>"
    },
    IndexAccess:function(node) {
        seq += "<IndexAccess>"
    },
    "IndexAccess:exit":function(node){
        seq += "</IndexAccess>"
    },
    MemberAccess:function(node) { 
        seq += "<MemberAccess>"   
    },
    "MemberAccess:exit":function(node) {
        seq += "<SimpleName>" + node['memberName']+"</SimpleName>"
        seq += "</MemberAccess>"
    },
    HexNumber:function(node) {
        seq += "<NumberLiteral>$NUM$</NumberLiteral>"
    },
    DecimalNumber:function(node) {
        seq += "<NumberLiteral>$NUM$</NumberLiteral>"
    },
    InlineAssemblyStatement:function(node) {
        seq += "<InlineAssemblyStatement>"
    },
    "InlineAssemblyStatement:exit":function(node){
        seq += "</InlineAssemblyStatement>"
    },
    AssemblyFunctionDefinition:function(node) {
        seq += "<AssemblyFunctionDefinition><SimpleName>"+node['name']+"</SimpleName>"
        if(Object.keys(node['returnArguments']).length != 0){
            seq += "<ReturnParameters>"
            for(i = 0; i < Object.keys(node['returnArguments']).length; i++){
                seq += "<SimpleName>"+node['returnArguments'][i]['name']+"</SimpleName>"
                node['returnArguments'][i]['visited'] = true
            }
            seq += "</ReturnParameters>"
        }
    },
    "AssemblyFunctionDefinition:exit":function(node){
        seq += "</AssemblyFunctionDefinition>"
    },
    AssemblyBlock:function(node){
        seq += "<AssemblyBlock>"
    },
    "AssemblyBlock:exit":function(node){
        seq += "</AssemblyBlock>"
    },
    AssemblyCall:function(node) {
        if(Object.keys(node['arguments']).length != 0){
            seq += "<AssemblyCall><SimpleName>"+node['functionName']+"</SimpleName>"
        }
        else{
            seq += "<SimpleName>"+node['functionName']+"</SimpleName>"
        }   
    },
    "AssemblyCall:exit":function(node){
        if(Object.keys(node['arguments']).length != 0){
            seq += "</AssemblyCall>"
        }
    },
    AssemblyLocalDefinition:function(node) {
        seq += "<AssemblyLocalDefinition>"
    },
    "AssemblyLocalDefinition:exit":function(node){
        seq += "</AssemblyLocalDefinition>"
    },
    AssemblyAssignment:function(node) {
        seq += "<AssemblyAssignment>"
    },
    "AssemblyAssignment:exit":function(node){
        seq += "</AssemblyAssignment>"
    },
    AssemblyStackAssignment:function(node) {
        seq += "<AssemblyStackAssignment><SimpleName>"+node['name']+"</SimpleName></AssemblyStackAssignment>"
    },
    LabelDefinition:function(node) {
        seq += "<LabelDefination><SimpleName>"+ node['name']+"</SimpleName></LabelDefination>"
    },
    AssemblySwitch:function(node) {
        seq += "<AssemblySwitch>"
    },
    "AssemblySwitch:exit":function(node){
        seq += "</AssemblySwitch>"
    },
    AssemblyCase:function(node) {
        seq += "<AssemblyCase>"
    },
    "AssemblyCase:exit":function(node){
        seq += "</AssemblyCase>"
    },
    AssemblyFor:function(node) {
        seq += "<AssemblyFor>"
    },
    "AssemblyFor:exit":function(node) {
        seq += "</AssemblyFor>"
    },
    AssemblyIf:function(node) {
        seq += "<AssemblyIf>"
    },
    "AssemblyIf:exit":function(node){
        seq += "</AssemblyIf>"
    }
  }
  )
  return seq 
}