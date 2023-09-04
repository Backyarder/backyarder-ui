describe('Details Page', () => {
  it('Check all details are viewable on the plant details page', () => {
    cy.visit('http://localhost:3000/')
    //stubb plants
    cy.intercept('GET', 'https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/plants', {
      statusCode: 200,
      fixture: 'onload-plants.json'
    })
    //stubb gardens
    cy.intercept('GET', 'https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/garden', {
      statusCode: 200,
      fixture: 'onload-grid.json'
    })
    //stubb plant-details -- need to nake the fixture
    cy.intercept('GET', 'https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/plants/2692', {
      statusCode: 200,
      fixture: 'plant-details.json'
    })

    //click on plant
    cy.get('[href="/plants/2692"]').click()
    cy.url().should('eq', 'http://localhost:3000/plants/2692')

    //check that everything is there
    cy.get('.plant-img').should('be.visible')
      //name
      cy.get('.common').should('have.text', 'CONEFLOWER')
      //scientific name
      cy.get('.scientific').should('have.text', `Echinacea 'Tomato Soup'`)
      //sun req
      cy.get('.sun').should('have.text', 'sunnyFull sun, Part shade')
      // cycle
      cy.get('.cycle').should('have.text', 'calendar_monthHerbaceous Perennial')
      // watering
      cy.get('.water').should('have.text', 'water_dropMinimum')
      //zones
      cy.get('.location').should('have.text', 'location_onZone 3 through 8')
      //plant type
      cy.get('.type').should('have.text', 'psychiatryFlower')
      //colors
      cy.get('.color').should('have.text', 'format_paintGreen, Purple')

      //watering des
      //light des
      //pruning des

      //more info
        //wildlife
          //types
        //flowering
        //pruned
          //months
        //drought tolerant
        //pet safe
        //indoor
        //edible
        //maintenance
        //non-invasive

              //home button
      cy.get('#details-home-button').should('have.text', 'Go back to garden')
      //click on home button
      //check that route is as expected
  })
})