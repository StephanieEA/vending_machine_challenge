export default class VendingMachine {
  constructor() {
    // status can be ["idle", "credited", "vending"]
    this.state = { status: "idle", credits: 0, change: 0, selection: null }
  }

  insertCredit(person, credit) {

    if (credit < 75) {
      return `You entered ${credit} + Mo money required!`
    } else {
      this.state.credits = this.state.credits + credit
      this.state.status = 'credited'
    }
  }

  reset() {
    this.constructor()
  }
}

// treats should be a large object with arrays that correspond to selectors { A1: [],} then you can get the price like B2[0].price
