/*
    Some test code instances.
 */
exports.assemblyfunc1 = `contract c1 { 
    function addAssembly(uint x, uint y) public pure returns (uint) {
        assembly {
            let c, d := obj

            let y := add(x, 3)
            let z := add(keccak256(0x0, 0x20), div(slength, 32))
            let n            // an initial empty 0 value is assigned
        }
}}`
exports.assemblyfunc = `contract c1 {
    function at(address _addr) {
        assembly  {
            function power(base, exponent) -> result {
                switch exponent
                case 0 { result := 1 }
                case 1 { result := base }
                default {
                    result := power(mul(base, base), div(exponent, 2))
                    switch mod(exponent, 2)
                        case 1 { result := mul(base, result) }
                }
                return(res, 0x20)
            }

                let x := 0
                for { let i := 0 } lt(i, 0x100) { i := add(i, 0x20) } {
                        x := add(x, mload(i))
                }
                // retrieve the size of the code, this needs assembly
                let size := extcodesize(_addr)
                =: abcde
                ab :
                if slt(x, 0) { x := sub(0, x) }   
                     
        }
    }
}`
exports.modifiercode = `
contract c7172{
    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
      uint _;
      require(msg.sender == owner);
      _;
    }
  }`
exports.functioncode1 = `contract c7053{
    function Ownable(uint a) public returns (FreshJuiceSize memory size, uint a) {
        landsPurchased();
        uint x;
        // Person memory person = Person({age:18,stuID:101,name:"liyuechun"});
        require(newOwner != address(this),'Something bad happened');
        mapping (address => uint32) lands;
        abc x;
        string data = "test";
        owner = msg.sender;
        stateVar = new uint[](2);
        stateVar[0] = 1;
        a>1 ? a=2 : a=1;
        return (7, true, 2);
    }
}`

exports.functioncode = `contract c7053{
    function transferOwnership(address newOwner) internal view onlyOwner(5) {
        proposals[proposal].voteCount += sender.weight;
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