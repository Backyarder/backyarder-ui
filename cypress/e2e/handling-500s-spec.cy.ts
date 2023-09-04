describe('Handle 500 level errors', () => {
  it('Getting plants for sidebar', () => {
    cy.intercept('GET', `https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/plants`, (req) => {
      req.reply({
        status: 500
      })
    })
    //stub a successful grid fetch
    cy.visit('http://localhost:3000/')
    //await for get to return
    //test that in the side bar the error meesgae is displayed
  })

  it('Getting plants details', () => {
    cy.intercept('GET', `https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/plants/2692`, (req) => {
      req.reply({
        status: 500
      })
    })
    //stub a successful sidebar fetch
    //stub a successful grid fetch
    cy.visit('http://localhost:3000/')
    //await sidebar fetch
    cy.get('[href="/plants/2692"]').click()
    //await details fetch (500)
    //assert that the details page has an error message
    //click on the home button
    //assert the user is taken back to the garden
  })

  it('Getting grid', () => {
    cy.intercept('GET', `https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/garden`, (req) => {
      req.reply({
        status: 500
      })
    })
    //stub successful sidebar fetch
    cy.visit('http://localhost:3000/')
    //await grid fetch
    //assert that the error meesage is displayed
  })

  it.only('Searching plant', () => {
    cy.intercept('GET', `https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/search/apple`, (req) => {
      req.reply({
        status: 500
      })
    })
    //stub successful grid fetch
    //stub successful sidebar fetch
    cy.visit('http://localhost:3000/')
    //await sidebar fetch
    cy.get('.search-bar').type('apple')
    cy.get('.submit-search > .material-symbols-rounded').click()
    //await search fetch
    //assert that the error message is displayed
  })
})

