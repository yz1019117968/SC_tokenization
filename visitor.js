const parser = require('solidity-parser-antlr') 

// exports.parseCodeToSeq =
function parseCodeToSeq(textcode){
  var ast = parser.parse(textcode, { loc: true })
  
  var seq = ""
  var addition_locs = ""
  // user defined variables or identifiers are given a type of ID
  // solidity's original specifiers(e.g. contract, modifier, is, etc.) are given a type of **Specifier
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
    FunctionDefinition:function(node) {
        
        seq += "FunctionBegin "
        seq += "FunctionName#" + node['name'] + " "
        if(node['visibility'] != null){
            seq += "Visibility#" + node['visibility'] + " "
        }
        if(node['stateMutability'] != null){
            seq += "StateMutability#" + node['stateMutability'] + " "
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
    VariableDeclaration:function(node){
        seq += "VariableDeclarationBegin "
        if(node['isDeclaredConst']){
            seq += "IsConstant#true "
        }
        if(node['visibility']){
            seq += "Visibility#"+node['visibility']+" "
        }
        if(node["isIndexed"]){
            seq += "IsIndex#true "
        }
        if(node['name']){
            seq += "VariableName#"+node['name']+" "
        }
    },
    "VariableDeclaration:exit":function(node){
        seq += "VariableDeclarationEnd "
    },
    Mapping:function(node){
        seq += "MappingBegin "
    },
    "Mapping:exit":function(node){
        seq += "MappingEnd "
      },
    //   need further test
    EnumValue:function(node) {
        // console.log(node)
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
//     InlineAssemblyStatement:function(node) {
//       if(node["ifVisited"] != true){
//       struct_seq += "(InlineAssemblyStatement "
//       line_each = node['loc']['start']['line']+" "
//       struct_loc += line_each
//       }
//     },
//     "InlineAssemblyStatement:exit":function(node){
//       if(node["ifVisited"] != true){
//         struct_seq += "InlineAssemblyStatement) "
//         line_each = node['loc']['end']['line']+" "
//       struct_loc += line_each
//       }
//     },
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
    Identifier:function(node){
        if(!node['visited']){
            seq += "VariableName#"+node['name']+" "
        }
    },
    // Notice: functioName may be classified into Identifier/ElementaryTypeName domain in FunctionCall.
    FunctionCall:function(node){
        console.log(node)
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
        
    },
    "FunctionCall:exit":function(node){
        seq += "FunctionInvocEnd "

    },
    // need further tested
    ThrowStatement:function(node) {
        seq += "ThrowStatementBegin "
    },
    "ThrowStatement:exit":function(node){
        seq += "ThrowStatementEnd "
    },
    // For assign
    VariableDeclarationStatement:function(node){
        seq += "VariableDeclarationStatementBegin "
        if(node['initialValue']){
            seq += "BinaryOperation#= "
        }
    },
    "VariableDeclarationStatement:exit":function(node){
        seq += "VariableDeclarationStatementEnd "
    },
//     AssemblyCall:function(node) {
//       if(node["ifVisited"] != true){
//       struct_seq += "(AssemblyCall FunctionName-"+node['functionName']+" "
//       line_each = node['loc']['start']['line']+" "
//       struct_loc += line_each+line_each
//       if(Object.keys(node['arguments']).length != 0){
//           struct_seq +="(Arguments "
//           line_each = node['loc']['start']['line']+" "
//           struct_loc += line_each
//       }
//     }
//     },
//     "AssemblyCall:exit":function(node){
//       if(node["ifVisited"] != true){
//       if(Object.keys(node['arguments']).length != 0){
//           struct_seq +="Arguments) "
//           line_each = node['loc']['end']['line']+" "
//           struct_loc += line_each
//       }
//         struct_seq += "AssemblyCall) "
//         line_each = node['loc']['end']['line']+" "
//         struct_loc += line_each
//     }
//     },
//     AssemblyLocalDefinition:function(node) {
//       if(node["ifVisited"] != true){
//       struct_seq += "(AssemblyLocalDef "
//       line_each = node['loc']['start']['line']+" "
//       struct_loc += line_each
//       }
//     },
//     "AssemblyLocalDefinition:exit":function(node){
//       if(node["ifVisited"] != true){
//       struct_seq += "AssemblyLocalDef) "
//       line_each = node['loc']['end']['line']+" "
//       struct_loc += line_each
//       }
//     },
//     AssemblyAssignment:function(node) {
//       // console.log("assemblyassign",node)
//       if(node["ifVisited"] != true){
//       struct_seq += "(AssemblyAssignment "
//       line_each = node['loc']['start']['line']+" "
//       struct_loc += line_each
//       }
//     },
//     "AssemblyAssignment:exit":function(node){
//       if(node["ifVisited"] != true){
//       struct_seq += "AssemblyAssignment) "
//       line_each = node['loc']['end']['line']+" "
//       struct_loc += line_each
//       }
//     },
//     AssemblyStackAssignment:function(node) {
//       if(node["ifVisited"] != true){
//       struct_seq += "(AssemblyStackAssignment VariableName-"+node['name']+" AssemblyStackAssignment) "
//       line_each = node['loc']['start']['line']+" "
//       struct_loc += line_each +line_each+line_each
//       }
//     },
    // need further test
    LabelDefinition:function(node) {
      if(node["ifVisited"] != true){
      struct_seq += "(LabelDef LabelName#"+ node['name']+" LabelDef) "
      line_each = node['loc']['start']['line']+" "
      struct_loc += line_each+line_each+line_each
      }
    },
//     AssemblySwitch:function(node) {
//       if(node["ifVisited"] != true){
//       // console.log(node)
//       struct_seq += "(AssemblySwitch "
//       line_each = node['loc']['start']['line']+" "
//       struct_loc += line_each
//       }
//     },
//     "AssemblySwitch:exit":function(node){
//       if(node["ifVisited"] != true){
//       struct_seq += "AssemblySwitch) "
//       line_each = node['loc']['end']['line']+" "
//       struct_loc += line_each
//       }
//     },
//     AssemblyCase:function(node) {
//       if(node["ifVisited"] != true){
//       struct_seq += "(AssemblyCase "
//       line_each = node['loc']['start']['line']+" "
//       struct_loc += line_each
//       }
//     },
//     "AssemblyCase:exit":function(node){
//       if(node["ifVisited"] != true){
//       if(node['default']){
//           struct_seq += "defaultCase-true "
//           line_each = node['loc']['end']['line']+" "
//           struct_loc += line_each
//       }
//       struct_seq += "AssemblyCase) "
//       line_each = node['loc']['end']['line']+" "
//       struct_loc += line_each
//     }
//     },
//     AssemblyFunctionDefinition:function(node) {
//       if(node["ifVisited"] != true){
//       struct_seq += "(AssemblyFunctionDef FunctionName-"+node['name']+" "
//       line_each = node['loc']['start']['line']+" "
//       struct_loc += line_each+line_each
//       }
//     },
//     "AssemblyFunctionDefinition:exit":function(node){
//       if(node["ifVisited"] != true){
//       struct_seq += "AssemblyFunctionDef) "
//       line_each = node['loc']['end']['line']+" "
//       struct_loc += line_each
//       }
//     },
//     AssemblyFunctionReturns:function(node) {
//       if(node["ifVisited"] != true){
//       struct_seq += "(AssemblyFunctionReturns "
//       line_each = node['loc']['start']['line']+" "
//       struct_loc += line_each
//       }
//     },
//     "AssemblyFunctionReturns:exit":function(node) {
//       if(node["ifVisited"] != true){
//       struct_seq += "AssemblyFunctionReturns) "
//       line_each = node['loc']['end']['line']+" "
//       struct_loc += line_each
//       }
//     },
//     AssemblyFor:function(node) {
//       if(node["ifVisited"] != true){
//       struct_seq += "(AssemblyFor "
//       line_each = node['loc']['start']['line']+" "
//       struct_loc += line_each
//       }
//     },
//     "AssemblyFor:exit":function(node) {
//       if(node["ifVisited"] != true){
//       struct_seq += "AssemblyFor) "
//       line_each = node['loc']['end']['line']+" "
//       struct_loc += line_each
//       }
//     },
//     AssemblyIf:function(node) {
//       if(node["ifVisited"] != true){
//       struct_seq += "(AssemblyIf "
//       line_each = node['loc']['start']['line']+" "
//       struct_loc += line_each
//       }
//     },
//     "AssemblyIf:exit":function(node){
//       if(node["ifVisited"] != true){
//       struct_seq += "AssemblyIf) "
//       line_each = node['loc']['end']['line']+" "
//       struct_loc += line_each
//       }
//     },
//     AssemblyLiteral:function(node) {
//       if(node["ifVisited"] != true){
//       struct_seq += "AssemblyLiteral-"+node['name']+" "
//       line_each = node['loc']['start']['line']+" "
//       struct_loc += line_each
//       }
//     },
// need further test
    TupleExpression:function(node) {
        seq += "TupleExpressionBegin "
    },
    "TupleExpression:exit":function(node){
        seq += "TupleExpressionEnd "
    },
    // need test for hex or decimal.
    NumberLiteral:function(node) {
        seq += "NumberLiteral#Number "
    },
    BooleanLiteral:function(node) {
      //   console.log(node)
        seq += "BooleanLiteral#boolean "
    },
    // need further test
    UnaryOperation:function(node){
        seq += "UnaryOperation#"+node['operator']+" "
    },
    BinaryOperation:function(node) {
        // console.log(node)
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
        seq += "Number#HexNumber "
    },
    DecimalNumber:function(node) {
        console.log(node)
        seq += "Number#DecimalNumber "
    },

  }
  )

  returnValue = {"seq":seq,"addition_loc":addition_locs}
  return returnValue 
}
modifiercode = `
contract c7172{
    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
      require(msg.sender == owner);
      _;
    }
  }`
functioncode1 = `contract c7053{ 
    function Ownable(uint a) public {
        owner = msg.sender;
        stateVar = new uint[](2);
        stateVar[0] = 1;
        a>1 ? a=2 : a=1;
    }
}`
functioncode = `contract c7053{
    function transferOwnership(address newOwner) internal onlyOwner(5) {
        uint[] stateVar;
        uint b = 0x123456789ffaa;
        b = 6;
        revert();
        require(newOwner != address(this));
        uint d = testd(b);
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
        for (uint i=0; i<5; i++) {
                if(i==5){
                   break;
                }
                else{
                    continue;
                }
        }
        do{
            newOwner--;
        } while(newOwner>0);
      }
}`

returnValue = parseCodeToSeq(functioncode1)
seq = returnValue['seq']
loc = returnValue['addition_loc']
console.log(seq)
console.log(loc)
console.log(seq.split(" ").length)
console.log(loc.split(" ").length)