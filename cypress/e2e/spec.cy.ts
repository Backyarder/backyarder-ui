describe('Getting plants for sidebar', () => {
  it('See what a 500 looks like', () => {
    cy.intercept('GET', `https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/plants`, (req) => {
      req.reply({
        status: 500
      })
    })
    cy.visit('http://localhost:3000/')
  })
})

describe('Getting plant details for details page', () => {
  it('See what a 500 looks like', () => {
    cy.intercept('GET', `https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/plants/2692`, (req) => {
      req.reply({
        status: 500
      })
    })
    cy.visit('http://localhost:3000/')
    cy.get('[href="/plants/2692"]').click()
  })
})