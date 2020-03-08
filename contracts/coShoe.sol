pragma solidity >=0.5.0;


contract coShoe {

 struct Shoe {
     address owner;
     bool sold;
     string name;
     string image;
 }
uint price = 0.5 ether;
uint public shoesSold = 0;
address private minter;
mapping (address => uint) public balances;

Shoe[] public shoes;

function mintCoShoeToken(address receiver, uint amount) public {
    require(msg.sender == minter, "Function can only be called by minter.");
    require(amount <= 100, "Amount is too high.");
    balances[receiver] = amount;
    for (uint i = 0; i < amount; i++) {
        Shoe memory shoe = Shoe(msg.sender,false,"","");
        shoes.push(shoe);
    }
}

constructor() public {
    minter = msg.sender;
    mintCoShoeToken(msg.sender,100);
}

function buyShoe(string memory _name, string memory _image) public payable {
    require(shoesSold < 100, "No shoes left");
    require(msg.value == price, "amount paid not equal to price of shoe");
    Shoe storage shoe = shoes[shoesSold];
    shoe.name = _name;
    shoe.image = _image;
    shoe.owner = msg.sender;
    shoe.sold = true;
    shoesSold++;
}

function checkPurchases() external view returns(bool[] memory) {
    bool[] memory purchases = new bool[](100);
    for (uint i = 0; i < 100; i++) {
        if (shoes[i].owner == msg.sender) {
            purchases[i] = true;
        } else {
            purchases[i] = false;
        }
    }
    return purchases;
}

}