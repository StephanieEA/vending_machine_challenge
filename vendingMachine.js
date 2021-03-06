// export default
class VendingMachine {
  constructor() {
    this.state = {
      status: "idle",
      credits: 0,
      change: 0,
      error: null,
      dispensed: [],
      candies: {
        'A1': [{name:'twix', price: 75}, {name: 'twix', price: 75}],
        'A2': [{name: 'snickers', price: 75}],
        'B1': [],
        'B2': [{name:'ring pop', price: 25}, {name:'ring pop', price: 25}]
      }
    }
  }

  insertCredit(person, credit, selection) {
    this.state.status = 'credited'
    this.state.credits = this.state.credits + credit
    if (!this.isValidSelection(selection)) {
      return false
    }
    if (!this.isEnoughMoney(this.state.credits, selection)) {
      return false
    }
    if (!this.isTreatThere(selection)) {
      return false
    }
    return this.dispenseCandy(selection)
  }

  isValidSelection(selection) {
    if (!this.state.candies[selection]) {
      this.state.error = 'Choose a real option'
      return false
    } else {
      return true
    }
  }

  isEnoughMoney(credit, selection) {
    if (this.state.candies[selection][0].price > credit) {
      this.state.error = 'Insert mo money'
      return false
    } else {
      return true
    }
  }

  isTreatThere(selection) {
    if (this.state.candies[selection].length !== 0) {
      return true
    } else {
      this.state.error = `Out of ${selection}`
      return false
    }
  }

  dispenseCandy(selection) {
    this.state.status = 'vending'
    this.state.credits = this.state.credits - this.state.candies[selection][0].price
    this.state.dispensed.push(this.state.candies[selection][0])
    this.state.candies[selection].pop()
    return true
  }

  returnChange() {
    this.state.change = this.state.credits
    this.state.credits = 0
    this.state.status = 'idle'
  }

  reset() {
    this.constructor()
  }
}

if(typeof module !== 'undefined') {
  module.exports.default = VendingMachine
}
