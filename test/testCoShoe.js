const coShoe = artifacts.require('./coShoe.sol');
const truffleAssert = require('truffle-assertions');

contract('coShoe', function (accounts) {
  let coShoeInstance

beforeEach(async function () {
    coShoeInstance = await coShoe.new()
  })

  //First Test:Check is 100 tokens are created
  it('should mint 100 coins if sent from account 0', async function () {
    await coShoeInstance.mintCoShoeToken(accounts[0], 100, { 'from': accounts[0] })
    let balance = await coShoeInstance.balances(accounts[0])
    assert.equal(balance.toNumber(), 100, "100 tokens weren't in account 0")
  })

  //Second Test: BuyShoe function (owner, sold, name, url, shoesSold)
  it('should transfer ownership, set name and image, set sold to true and increase shoesSold', async function () {
    await coShoeInstance.buyShoe("Danae", "example.com", { 'from': accounts[1],'value' : 500000000000000000 })
    let shoe = await coShoeInstance.shoes(0)
    let soldShoes = await coShoeInstance.shoesSold()
    assert.equal(shoe.owner, accounts[1], "ownership was not correctly tranferred")
    assert.equal(shoe.sold, true, "sold was not set to true")
    assert.equal(shoe.name, "Danae", "Name was not set to the buyer specification")
    assert.equal(shoe.image, "example.com", "url was not set to buyer specification")
    assert.equal(soldShoes, 1, "amount of sold shoes was not increased by 1")
  })
  
  //Third test: BuyShoe function revert if price is not right
  it('should insure a shoe is not purchased if the price paid is not eqaul to price of shoe', async function () {
    await truffleAssert.reverts(coShoeInstance.buyShoe("Danae", "example.com", { 'from': accounts[1], 'value' : 1 } ))
  })

  //Fourth test: checkPurchases returns the correct number of trues
  it('should insure that the correct number of trues are return for a specific account calling the function', async function () {
    await coShoeInstance.buyShoe("Danae", "example.com", { 'from': accounts[1], 'value' : 500000000000000000 })
    await coShoeInstance.buyShoe("Simone", "example2.com", { 'from': accounts[1], 'value' : 500000000000000000 })
    let purchase = await coShoeInstance.checkPurchases({ 'from': accounts[1]})
    let count = 0
    for (i = 0; i < 100; i++) {
      if (purchase[i] == true) {
        count++
      }
    }
    assert.equal(count, 2, "did not return the correct number of trues")
  })

})