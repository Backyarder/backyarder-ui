describe('template spec', () => {
  it('See what a 500 looks like', () => {
    cy.intercept('GET', `https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/plants`, (req) => {
      req.reply({
        status: 500
      })
    })
    cy.visit('http://localhost:3000/')
  })
})