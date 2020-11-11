const parser = require('solidity-parser-antlr') 

/*
    Parse smart contracts code to sequence, modified from SBT traversal.
*/
exports.parseCodeToSeq = function parseCodeToSeq(textcode){
  var ast = parser.parse(textcode, { loc: true })
  var seq = ""
  parser.visit(ast, 
  {
    ModifierDefinition:function(node) {
        seq += "ModifierBegin ModifierName#"+node['name']+" "
    },
    "ModifierDefinition:exit":function(node){
        seq += "ModifierEnd "
    },
    ModifierInvocation:function(node) {
        seq += "ModifierInvocBegin " 
        seq += "ModifierName#"+node['name']+" "
    },
    "ModifierInvocation:exit":function(node){
        seq += "ModifierInvocEnd "
    },
    Block:function(node) {
        seq += "BlockBegin "
    },
    "Block:exit":function(node) {
        seq += "BlockEnd "
    },
    // FunctionTypeName:function(node){
    //     console.log(node)
    // },

    // Needn't care returns variables for those only consist type
    FunctionDefinition:function(node) {
        seq += "FunctionBegin "
        seq += "FunctionName#" + node['name'] + " "
        // 'public' | 'private' | 'external' | 'internal'
        if(node['visibility']){
            seq += "Visibility#" + node['visibility'] + " "
        }
        // 'pure' | 'constant' | 'view' | 'payable'
        if(node['stateMutability']){
            seq += "StateMutability#" + node['stateMutability'] + " "
        }
        if(node['returnParameters']){
            seq += "ReturnParametersBegin "
            for(i = 0; i < Object.keys(node['returnParameters']).length; i++){
                seq += "VariableDeclarationBegin "
                if(node['returnParameters'][i]['storageLocation']){
                    seq += "StorageLocation#"+node['returnParameters'][i]['storageLocation']+" "
                }
                if(node['returnParameters'][i]['name']){
                    seq += "VariableName#"+node['returnParameters'][i]['name']+" "
                }
                node['returnParameters'][i]['visited'] = true
                if(node['returnParameters'][i]['typeName']['type'] == "ElementaryTypeName"){
                    seq += "ElementaryTypeName#"+node['returnParameters'][i]['typeName']['name']+" "
                    node['returnParameters'][i]['typeName']['visited'] = true
                }
                else if(node['returnParameters'][i]['typeName']['type'] == "UserDefinedTypeName"){
                    seq += "ElementaryTypeName#"+node['returnParameters'][i]['typeName']['namePath']+" "
                    node['returnParameters'][i]['typeName']['visited'] = true
                }
                
                seq += "VariableDeclarationEnd "
            }
            seq += "ReturnParametersEnd "

        }
    },
    "FunctionDefinition:exit":function(node){
        seq += "FunctionEnd "
    },
    ElementaryTypeName:function(node){
        if(!node["visited"]){
            seq += "ElementaryTypeName#"+node['name']+" "
        }
    },
    UserDefinedTypeName:function(node){
        if(!node["visited"]){
            seq += "ElementaryTypeName#"+node['namePath']+" "
        }
    },
    VariableDeclaration:function(node){
        if(!node['visited']){
            seq += "VariableDeclarationBegin "
            // only state variables have constant
            // only state variables have visibility
            // indexed only exits in events.
            // 'memory' | 'storage' | 'calldata'
            if(node['storageLocation']){
                seq += "StorageLocation#"+node['storageLocation']+" "
            }
            if(node['name']){
                seq += "VariableName#"+node['name']+" "
            }
        }
    },
    "VariableDeclaration:exit":function(node){
        if(!node['visited']){
            seq += "VariableDeclarationEnd "
        }
    },
    Mapping:function(node){
        seq += "MappingBegin "
    },
    "Mapping:exit":function(node){
        seq += "MappingEnd "
      },
    //   may never seen
    EnumValue:function(node) {
        console.log(node)
        seq += "VariableName#"+node['name']+" "
        node['visited'] = true
    },
    ArrayTypeName:function(node) {
        seq += "ArrayTypeBegin "
    },
    "ArrayTypeName:exit":function(node){
        seq += "ArrayTypeEnd "
    },
    ExpressionStatement:function(node) {
        seq += "ExpressionStatementBegin "
    },
    "ExpressionStatement:exit":function(node) {
        seq += "ExpressionStatementEnd "
    },
    IfStatement:function(node) {
        seq += "IfStatementBegin "
    },
    "IfStatement:exit":function(node) {
        seq += "IfStatementEnd "
    },
    WhileStatement:function(node) {
        seq += "WhileStatementBegin "
    },
    "WhileStatement:exit":function(node){
        seq += "WhileStatementEnd "
    },
    ForStatement:function(node) {
        seq += "ForStatementBegin "
    },
    "ForStatement:exit":function(node){
        seq += "ForStatementEnd "
    },
    DoWhileStatement:function(node) {
        seq += "DoWhileStatementBegin "
    },
    "DoWhileStatement:exit":function(node){
        seq += "DoWhileStatementEnd "
    },
    ContinueStatement:function(node) {
        seq += "ContinueStatement#continue "
    },
    BreakStatement:function(node) {
        seq += "BreakStatement#break "
    },
    ThrowStatement:function(node) {
        seq += "ThrowStatement#Throw "
    },
    ReturnStatement:function(node){
        seq += "ReturnStatementBegin "
    },
    "ReturnStatement:exit":function(node){
        seq += "ReturnStatementEnd "
    },
    EmitStatement:function(node) {
        seq += "EmitStatementBegin "
    },
    "EmitStatement:exit":function(node){
        seq += "EmitStatementEnd "
    },
    // placementholder "_" will also be treated as a variable in modifier
    Identifier:function(node){
        if(!node['visited']){
            seq += "VariableName#"+node['name']+" "
        }
    },
    // haven't seen
    IdentifierList:function(node){
        console.log(node)
        seq += "IdentifierListBegin "
    },
    "IdentifierList:exit":function(node){
        seq += "IdentifierListEnd "
    },
    // Notice: functioName may be classified into Identifier/ElementaryTypeName domain in FunctionCall.
    FunctionCall:function(node){
        seq += "FunctionInvocBegin "
        // function directly called
        if(node['expression']['type'] == "Identifier"){
            seq += "FunctionName#"+ node['expression']['name']+" "
            node['expression']['visited'] = true
        }
        // new
        else if(node['expression']['type'] == "NewExpression"){
            seq += "FunctionName#new "
        }
        // variable -> function
        else if(node['expression']['type'] == "ElementaryTypeNameExpression"){
            seq += "FunctionName#"+ node['expression']['typeName']['name']+" "
            node['expression']['typeName']['visited'] = true
        }
        // arguments name, if has. If do not have, is [] instead of null!
        if(Object.keys(node['names']).length != 0){
            for(i = 0; i< Object.keys(node['names']).length; i++){
                seq += "ArgumentName#"+node['names'][i] +" "
            }
        }
    },
    "FunctionCall:exit":function(node){
        seq += "FunctionInvocEnd "
    },
    // ElementaryTypeNameExpression:function(node){
    //     seq += "ElementaryTypeNameExpressionBegin "

    // },
    // "ElementaryTypeNameExpression:exit":function(node){
    //     seq += "ElementaryTypeNameExpressionEnd "
    // },


    // For assign value or self-statemented
    VariableDeclarationStatement:function(node){
        seq += "VariableDeclarationStatementBegin "
        if(node['initialValue']){
            seq += "BinaryOperation#= "
        }
    },
    "VariableDeclarationStatement:exit":function(node){
        seq += "VariableDeclarationStatementEnd "
    },
    TupleExpression:function(node) {
        seq += "TupleExpressionBegin "
    },
    "TupleExpression:exit":function(node){
        seq += "TupleExpressionEnd "
    },
    // only appear in assembly
    NumberLiteral:function(node) {
        seq += "NumberLiteral#Number "
    },
    // only appear in assembly
    BooleanLiteral:function(node) {
        seq += "BooleanLiteral#boolean "
    },
    StringLiteral:function(node){
        seq += "StringLiteral#String "
    },
    UnaryOperation:function(node){
        seq += "UnaryOperation#"+node['operator']+" "
    },
    BinaryOperation:function(node) {
        seq += "BinaryOperation#"+node['operator']+" "
    },
    Conditional:function(node) {
        seq += "ConditionalBegin "
    },
    "Conditional:exit":function(node){
        seq += "ConditionalEnd "
    },
    IndexAccess:function(node) {
        seq += "IndexAccessBegin "
    },
    "IndexAccess:exit":function(node){
        seq += "IndexAccessEnd "
    },
    MemberAccess:function(node) { 
        seq += "MemberAccessBegin "   
    },
    "MemberAccess:exit":function(node) {
        seq += "MemberName#" + node['memberName']+" "
        seq += "MemberAccessEnd "
    },
    HexNumber:function(node) {
        seq += "NumberLiteral#Number "
    },
    DecimalNumber:function(node) {
        seq += "NumberLiteral#Number "
    },
    InlineAssemblyStatement:function(node) {
        seq += "InlineAssemblyStatementBegin "
    },
    "InlineAssemblyStatement:exit":function(node){
        seq += "InlineAssemblyStatementEnd "
    },
    AssemblyFunctionDefinition:function(node) {
        seq += "AssemblyFunctionBegin FunctionName#"+node['name']+" "
        if(Object.keys(node['returnArguments']).length != 0){
            seq += "ReturnParametersBegin "
            for(i = 0; i < Object.keys(node['returnArguments']).length; i++){
                seq += "VariableName#"+node['returnArguments'][i]['name']+" "
                node['returnArguments'][i]['visited'] = true
            }
            seq += "ReturnParametersEnd "
        }
    },
    "AssemblyFunctionDefinition:exit":function(node){
        seq += "AssemblyFunctionEnd "
    },
    AssemblyBlock:function(node){
        seq += "AssemblyBlockBegin "
    },
    "AssemblyBlock:exit":function(node){
        seq += "AssemblyBlockEnd "
    },
    AssemblyCall:function(node) {
        if(Object.keys(node['arguments']).length != 0){
            seq += "AssemblyFunctionInvocBegin FunctionName#"+node['functionName']+" " 
        }
        else{
            seq += "VariableName#"+node['functionName']+" "
        }   
    },
    "AssemblyCall:exit":function(node){
        if(Object.keys(node['arguments']).length != 0){
            seq += "AssemblyFunctionInvocEnd "
        }
    },
    AssemblyLocalDefinition:function(node) {
        seq += "AssemblyLocalBegin "
    },
    "AssemblyLocalDefinition:exit":function(node){
        seq += "AssemblyLocalEnd "
    },
    AssemblyAssignment:function(node) {
        seq += "AssemblyAssignmentBegin "
    },
    "AssemblyAssignment:exit":function(node){
        seq += "AssemblyAssignmentEnd "
    },
    AssemblyStackAssignment:function(node) {
        seq += "AssemblyAssignmentBegin UnaryOperation#=: VariableName#"+node['name']+" AssemblyAssignmentEnd "
    },
    LabelDefinition:function(node) {
        seq += "LabelName#"+ node['name']+" "
      },
    AssemblySwitch:function(node) {
        // console.log(node)
        seq += "AssemblySwitchBegin "
    },
    "AssemblySwitch:exit":function(node){
        seq += "AssemblySwitchEnd "
    },
    AssemblyCase:function(node) {
        seq += "AssemblyCaseBegin "
    },
    "AssemblyCase:exit":function(node){
        seq += "AssemblyCaseEnd "
    },
    AssemblyFor:function(node) {
        seq += "AssemblyForBegin "
    },
    "AssemblyFor:exit":function(node) {
        seq += "AssemblyForEnd "
    },
    AssemblyIf:function(node) {
        seq += "AssemblyIfBegin "
    },
    "AssemblyIf:exit":function(node){
        seq += "AssemblyIfEnd "
    },
    // haven't seen 
    AssemblyLiteral:function(node) {
        console.log(node)
        seq += "AssemblyLiteral#"+node['name']+" "
    },
    AssemblyFunctionReturns:function(node) {
        console.log(node)
        seq += "AssemblyFunctionReturnsBegin "
    },
    "AssemblyFunctionReturns:exit":function(node) {
        seq += "AssemblyFunctionReturnsEnd "
    },
    SubAssembly:function(node) {
        console.log(node)
    },
    AssemblyItem:function(node){
        console.log(node)
    }
  }
  )

  return seq 
}