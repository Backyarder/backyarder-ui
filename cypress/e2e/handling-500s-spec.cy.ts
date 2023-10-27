describe('Handle 500 level errors', () => {
  it('Getting plants for sidebar', () => {
    cy.intercept('GET', `https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/plants`, (req) => {
      req.reply({
        status: 500
      })
    })

    cy.intercept('GET', 'https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/garden', {
      statusCode: 200,
      fixture: 'onload-grid.json'
    })

    cy.visit('http://localhost:3000/')
    cy.get('.loading').should('have.text', 'It looks like our nursery is not operating correctly, please try again later')
  })

  it('Getting plants details', () => {
    cy.intercept('GET', `https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/plants/2692`, (req) => {
      req.reply({
        status: 500
      })
    })

    cy.intercept('GET', 'https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/plants', {
      statusCode: 200,
      fixture: 'onload-plants.json'
    })

    cy.intercept('GET', 'https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/garden', {
      statusCode: 200,
      fixture: 'onload-grid.json'
    })

    cy.visit('http://localhost:3000/')
    cy.get('[href="/plants/2692"]').click()
    cy.url().should('include', '/plants/2692')
    cy.get('.error > p').should('have.text', 'Ooops! There are no plants here!')
    cy.get('.home-button').click()
    cy.url().should('eq', 'http://localhost:3000/')
  })

  it('Getting grid', () => {
    cy.intercept('GET', `https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/garden`, (req) => {
      req.reply({
        status: 500
      })
    })

    cy.intercept('GET', 'https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/plants', {
      statusCode: 200,
      fixture: 'onload-plants.json'
    })

    cy.visit('http://localhost:3000/')
    cy.get('.server-error').should('be.visible')
    cy.get('h2').should('have.text', `Oh no! The weather isn't cooperating!`)
    cy.get('.server-error > p').should('have.text', 'There was an error on our end, please try again later')
  })

  it('Searching plant', () => {
    cy.intercept('GET', `https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/search/apple`, (req) => {
      req.reply({
        status: 500
      })
    })

    cy.intercept('GET', 'https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/plants', {
      statusCode: 200,
      fixture: 'onload-plants.json'
    })

    cy.intercept('GET', 'https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/garden', {
      statusCode: 200,
      fixture: 'onload-grid.json'
    })

    cy.visit('http://localhost:3000/')
    cy.get('.search-bar').type('apple')
    cy.get('.submit-search > .material-symbols-rounded').click()
    cy.get('.loading').should('have.text', 'It looks like our nursery is not operating correctly, please try again later')
  })
})

