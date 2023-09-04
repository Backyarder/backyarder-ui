describe('Handle 500 level errors', () => {
  it('Getting plants for sidebar', () => {
    cy.intercept('GET', `https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/plants`, (req) => {
      req.reply({
        status: 500
      })
    })
    cy.visit('http://localhost:3000/')
  })

  it('Getting plants details', () => {
    cy.intercept('GET', `https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/plants/2692`, (req) => {
      req.reply({
        status: 500
      })
    })
    cy.visit('http://localhost:3000/')
    cy.get('[href="/plants/2692"]').click()
  })

  it('Getting grid', () => {
    cy.intercept('GET', `https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/garden`, (req) => {
      req.reply({
        status: 500
      })
    })
    cy.visit('http://localhost:3000/')
  })

  it('Searching plant', () => {
    cy.intercept('GET', `https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/search/apple`, (req) => {
      req.reply({
        status: 500
      })
    })
    cy.visit('http://localhost:3000/')
    cy.get('.search-bar').type('apple')
    cy.get('.submit-search > .material-symbols-rounded').click()
  })

  //   it('Adding plant to grid', () => {
  //     cy.intercept('PATCH', `https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/cell`, (req) => {
  //       req.reply({
  //         status: 500
  //       })
  //     })
  //     cy.visit('http://localhost:3000/')
  //     cy.get('[href="/plants/2692"]').first().trigger("dragstart", { dataTransfer })
  //       .get('#J9').trigger("drop", { dataTransfer })
  // })

  //   it('Disabling a cell', () => {
  //     cy.intercept('PATCH', `https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/cell`, (req) => {
  //       req.reply({
  //         status: 500
  //       })
  //     })
  //     cy.visit('http://localhost:3000/')
  //   })

  //   it('Deleting cell contents', () => {
  //     cy.intercept('DELETE', `https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/${path}`, (req) => {
  //       req.reply({
  //         status: 500
  //       })
  //     })
  //     cy.visit('http://localhost:3000/')
  //   })
})

