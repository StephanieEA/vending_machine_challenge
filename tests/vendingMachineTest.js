require('babel-core/register')({
  ignore: /node_modules\/(?!ProjectB)/
});

const assert = require('chai').assert
const VendingMachine = require('../vendingMachine').default
const Person = require('../person').default

describe('Complete Interaction Tests', function() {
  const vendingMachine = new VendingMachine()
  const alex = new Person("Alex", 100)

  afterEach(function() {
    vendingMachine.reset();
  });

  it('if a person inserts 100 credits and selects a treat and asks for their change, they should receive 25 cents change and a treat and the vending machine should be back at in an idle state with 0 credits', () => {
    assert.equal(vendingMachine.state.status, 'idle')
    assert.equal(vendingMachine.state.credits, 0)
    assert.equal(vendingMachine.state.change, 0)

    assert.deepEqual(vendingMachine.insertCredit(alex, 100, 'A1'), {
      'selection': {name:'twix', price: 75}
     })
     assert.equal(vendingMachine.state.change, 0)
     assert.equal(vendingMachine.state.credits, 25)
     assert.equal(vendingMachine.state.status, 'vending')

    vendingMachine.returnChange()

    assert.equal(vendingMachine.state.change, 25)
    assert.equal(vendingMachine.state.credits, 0)
    assert.equal(vendingMachine.state.status, 'idle')
    assert.equal(vendingMachine.state.candies.A1.length , 1)
  });

  it('if a person inserts 50 credits and selects a treat, they should receive an error message, the vending machine should be credited, there should be no change', () => {
    assert.equal(vendingMachine.state.status, 'idle')

    vendingMachine.insertCredit(alex, 50, 'A1')
    assert.equal(vendingMachine.state.status, 'credited')
    assert.equal(vendingMachine.state.credits, 50)
    assert.equal(vendingMachine.state.change, 0)
    assert.equal(vendingMachine.state.error, 'Insert mo money')
  });

  it('if a person inserts 200 credits and selects two treats they can afford and then their change, they should receive two treats and their change', () => {
    assert.equal(vendingMachine.state.status, 'idle')

    vendingMachine.insertCredit(alex, 200, 'A1')
    assert.equal(vendingMachine.state.status, 'vending')
    assert.equal(vendingMachine.state.credits, 125)
    assert.equal(vendingMachine.state.change, 0)

    vendingMachine.insertCredit(alex, 0, 'A1')
    assert.equal(vendingMachine.state.status, 'vending')
    assert.equal(vendingMachine.state.credits, 50)
    assert.equal(vendingMachine.state.change, 0)

    vendingMachine.returnChange()
    assert.equal(vendingMachine.state.change, 50)
    assert.equal(vendingMachine.state.credits, 0)
    assert.equal(vendingMachine.state.status, 'idle')
    assert.equal(vendingMachine.state.candies.A1.length , 0)

  });

});

describe('insertCredit method', function() {
  const vendingMachine = new VendingMachine()

  afterEach(function() {
    vendingMachine.reset();
  });

  it('insertCredit should reassign the state of credits and status regardless and the status appropriately if the selection is available and the person entered enough money', () => {
    const alex = new Person("Alex", 100)

    assert.equal(vendingMachine.state.status, 'idle')
    assert.equal(vendingMachine.state.credits, 0)

    vendingMachine.insertCredit(alex, 100, 'A1')

    assert.equal(vendingMachine.state.candies.A1.length , 1)
    assert.equal(vendingMachine.state.status, 'vending')
    assert.equal(vendingMachine.state.error, null)
  });

  it('insertCredit should reassign the state of credits and status regardless and the status accordingly if the selection is not valid', () => {
    const jason = new Person("Jason", 50)

    assert.equal(vendingMachine.state.status, 'idle')
    assert.equal(vendingMachine.state.credits, 0)

    vendingMachine.insertCredit(jason, 50, 'A5')

    assert.equal(vendingMachine.state.status, 'credited')
    assert.equal(vendingMachine.state.error, 'Choose a real option')
  });

  it('insertCredit should reassign the state of credits and status regardless and the status accordingly if the money for the selection is not sufficient', () => {
    const jason = new Person("Jason", 50)

    assert.equal(vendingMachine.state.status, 'idle')
    assert.equal(vendingMachine.state.credits, 0)

    vendingMachine.insertCredit(jason, 50, 'A1')

    assert.equal(vendingMachine.state.candies.A1.length , 2)
    assert.equal(vendingMachine.state.status, 'credited')
    assert.equal(vendingMachine.state.error, 'Insert mo money')
  });

  it('insertCredit method should reassign the state of credits and status regardless and the status accordingly if the selection is not available', () => {
    const lynn = new Person("Lynn", 50)

    assert.equal(vendingMachine.state.status, 'idle')
    assert.equal(vendingMachine.state.credits, 0)
    assert.equal(vendingMachine.state.change, 0)

    vendingMachine.insertCredit(lynn, 50, 'A3')

    assert.equal(vendingMachine.state.change, 0)
    assert.equal(vendingMachine.state.candies.A1.length , 2)
    assert.equal(vendingMachine.state.status, 'credited')
  });
});

describe('isValidSelection method', function() {
  const vendingMachine = new VendingMachine()
  const alex = new Person("Alex", 100)

  afterEach(function() {
    vendingMachine.reset();
  });

  it('isValidSelection should assign an error state and return false if there\'s not a selection with the enterred key', () => {

    assert.equal(vendingMachine.isValidSelection('A9'), false)
    assert.equal(vendingMachine.state.error,
    'Choose a real option')
  });

  it('isValidSelection should return true if it is given a real option', () => {

    assert.equal(vendingMachine.isValidSelection('A1'), true)
    assert.equal(vendingMachine.state.error,
    null)
  });
});

describe('isEnoughMoney method', function() {
  const vendingMachine = new VendingMachine()
  const alex = new Person("Alex", 100)

  afterEach(function() {
    vendingMachine.reset();
  });

  it('isEnoughMoney should assign an error state and return false if there\'s not enough money to purchase the selection', () => {

    assert.equal(vendingMachine.isEnoughMoney(10, 'A1'), false)
    assert.equal(vendingMachine.state.error,
    'Insert mo money')
  });

  it('isEnoughMoney should return true if it there is enough money', () => {

    assert.equal(vendingMachine.isEnoughMoney(100, 'A1'), true)
    assert.equal(vendingMachine.state.error,
    null)
  });
});

describe('isTreatThere method', function() {
  const vendingMachine = new VendingMachine()
  const alex = new Person("Alex", 100)

  afterEach(function() {
    vendingMachine.reset()
  })

  it('isTreatThere should assign an error state and return false if there\'s not enough money to purchase the selection', () => {
    assert.equal(vendingMachine.isTreatThere( 'B1'), false)
    assert.equal(vendingMachine.state.error,
    'Out of B1')
  })

  it('isTreatThere should return true if it there is enough money', () => {
    assert.equal(vendingMachine.isTreatThere('A1'), true)
    assert.equal(vendingMachine.state.error, null)
  })
})


describe('dispenseCandy method', function() {
  const vendingMachine = new VendingMachine()
  const alex = new Person("Alex", 100)

  afterEach(function() {
    vendingMachine.reset()
  });

  it('dispenseCandy should assign a status of vending, change the state of change to the state of credits minus the price of the slection, pop an object from the selection array, and return an object with the selection', () => {
    assert.equal(vendingMachine.state.candies.A1.length, 2)
    assert.equal(vendingMachine.state.status, 'idle')

    assert.deepEqual(vendingMachine.dispenseCandy('A1'), {
      selection : {name: 'twix', price: 75}
    })

    assert.equal(vendingMachine.state.status, 'vending')
    assert.equal(vendingMachine.state.candies.A1.length, 1)
  })
})

describe('dispenseCandy method', function() {
  const vendingMachine = new VendingMachine()
  const alex = new Person("Alex", 100)

  afterEach(function() {
    vendingMachine.reset()
  });

  it('return change should assign a status of idle, change the state of change to the state of credits to 0, assign the state of change to the state of credits and return a change object with the correct change', () => {
    assert.equal(vendingMachine.state.status, 'idle')
    assert.equal(vendingMachine.state.credits, 0)
    assert.equal(vendingMachine.state.change, 0)

    vendingMachine.insertCredit(alex, 100, 'A1')
    assert.equal(vendingMachine.state.status, 'vending')
    assert.equal(vendingMachine.state.credits, 25)
    assert.equal(vendingMachine.state.change, 0)

    vendingMachine.returnChange()
    assert.equal(vendingMachine.state.status, 'idle')
    assert.equal(vendingMachine.state.credits, 0)
    assert.equal(vendingMachine.state.change, 25)    
  })
})
