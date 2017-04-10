if(typeof require !== 'undefined') {
 const VendingMachine = require('./vendingMachine');
 const Person = require('./person')
}

const person = new Person()
const vendingMachine = new VendingMachine()
let selection = null
let credits = 0

$(() => {
  renderMachine(vendingMachine)
  renderStore(vendingMachine)
  addEventListeners()
})

const renderMachine = (vendingMachine) => {
  const selectionHolders = Object.keys(vendingMachine.state.candies)
  $('.store').append(`
    <aside class=${selectionHolders[0]}>${selectionHolders[0]}</aside>
    <aside class=${selectionHolders[1]}>${selectionHolders[1]}</aside>
    <br/>
    <aside class=${selectionHolders[2]}>${selectionHolders[2]}</aside>
    <aside class=${selectionHolders[3]}>${selectionHolders[3]}</aside>
    `)
}

const renderStore = (vendingMachine) => {
  const selectionHolders = Object.keys(vendingMachine.state.candies)
  const stock = Object.values(vendingMachine.state.candies)
  $(`.${selectionHolders[0]}`).empty().append(
    `<h2>${selectionHolders[0]}</h2>`,
    `<h3>${vendingMachine.state.candies.A1.length > 0 ?
      vendingMachine.state.candies.A1[0].price :
      0}</h3>`,
    stock[0].map(item => `<p>${item.name}</p>`)
  )
  $(`.${selectionHolders[1]}`).empty().append(
    `<h2>${selectionHolders[1]}</h2>`,
    `<h3>${vendingMachine.state.candies.A2.length > 0 ?
      vendingMachine.state.candies.A2[0].price :
      0}</h3>`,
    stock[1].map(item => `<p>${item.name}</p>`))
  $(`.${selectionHolders[2]}`).empty().append(
    `<h2>${selectionHolders[2]}</h2>`,
    `<h3>${vendingMachine.state.candies.B1.length > 0 ?
      vendingMachine.state.candies.B1[0].price :
      0}</h3>`,
    stock[2].map(item => `<p>${item.name}</p>`))
  $(`.${selectionHolders[3]}`).empty().append(
    `<h2>${selectionHolders[3]}</h2>`,
    `<h3>${vendingMachine.state.candies.B2.length > 0 ?
      vendingMachine.state.candies.B2[0].price :
      0}</h3>`,
    stock[3].map(item => `<p>${item.name}</p>`))
}

const addEventListeners = () => {
  $('.credits').on("change", (e) => {
    credits = parseInt($('.credits').val())
  })

  $('.letter').on("click", (e) => {
    selection = e.target.name
  })

  $('.number').on("click", (e) => {
    selection = selection.concat(e.target.name)
    credits = credits + vendingMachine.state.credits

    if (!vendingMachine.insertCredit(person, credits, selection)) {
      $('.controls').append(`<p>${vendingMachine.state.error}</p>`)
    }
    else {
      credits = vendingMachine.state.credits
      $('.credits').val('')
      renderStore(vendingMachine)
    }

    $('.return-treat').empty().append(
      vendingMachine.state.dispensed.map(treat => `<p>${treat.name}</p>`)
    )
  })

  $('.change').on("click", () => {
    credits = 0
    vendingMachine.returnChange()
    $('.return-change').text(`${vendingMachine.state.change}`)
  })
}
