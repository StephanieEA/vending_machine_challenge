export default class Person {
  constructor() {
    this.state = {
      credits: 500,
      treat: []
    }
  }

  recieveTreat(treat) {
    this.state.treat = this.state.treat.push(treat)
  }

  spendMoney (price) {
    this.state.credits = this.state.credits - price
  }

  getPaid (check) {
    this.state.credits = this.state.credits + check
  }

  reset() {
    this.constructor()
  }
}
