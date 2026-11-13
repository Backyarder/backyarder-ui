describe('Details Page', () => {
  it('Check all details are viewable on the plant details page', () => {

    cy.intercept('GET', '**/api/v1/plants', {
      statusCode: 200,
      fixture: 'onload-plants.json'
    })

    cy.intercept('GET', '**/api/v1/garden', {
      statusCode: 200,
      fixture: 'onload-grid.json'
    })

    cy.intercept('GET', '**/api/v1/plants/2692', {
      statusCode: 200,
      fixture: 'plant-details.json'
    })

    cy.visit('http://localhost:3000/')

    cy.get('[href="/plants/2692"]').click()
    cy.url().should('eq', 'http://localhost:3000/plants/2692')

    cy.get('.plant-img').should('be.visible')
    cy.get('.common').should('have.text', 'CONEFLOWER')
    cy.get('.scientific').should('have.text', `Echinacea 'Tomato Soup'`)
    cy.get('.sun').should('have.text', 'sunnyFull sun, Part shade')
    cy.get('.cycle').should('have.text', 'calendar_monthHerbaceous Perennial')
    cy.get('.water').should('have.text', 'water_dropMinimum')
    cy.get('.location').should('have.text', 'location_onZone 3 through 8')
    cy.get('.type').should('have.text', 'psychiatryFlower')
    cy.get('.color').should('have.text', 'format_paintGreen, Purple')


    cy.get('.descriptions > :nth-child(1) > .header').should('have.text', 'Watering Description')

    cy.get('.descriptions > :nth-child(2) > .header').should('have.text', 'Sunlight Description')

    cy.get('.descriptions > :nth-child(3) > .header').should('have.text', 'Pruning Description')
    // Each section shows its own text (not the sunlight text three times).
    cy.fixture('plant-details.json').then(details => {
      const sections = details.data.attributes.section
      cy.get('.descriptions > :nth-child(1) > .description').should('have.text', sections[0].description)
      cy.get('.descriptions > :nth-child(2) > .description').should('have.text', sections[1].description)
      cy.get('.descriptions > :nth-child(3) > .description').should('have.text', sections[2].description)
    })

    cy.get('.more-info-section > .header').should('have.text', 'More Information')


    cy.get(':nth-child(2) > .checkbox').should('have.attr', 'src').should('include', 'checked_backyarder')
    cy.get('.more-info-section > :nth-child(2) > div > h3').should('have.text', 'Attracts Wildlife')
    cy.get('.more-info-section > :nth-child(2) > div > p').should('have.text', 'Birds, Butterflies')

    cy.get(':nth-child(3) > .checkbox').should('have.attr', 'src').should('include', 'checked_backyarder')
    cy.get('.more-info-section > :nth-child(3) > div > h3').should('have.text', 'Flowering')

    cy.get(':nth-child(4) > .checkbox').should('have.attr', 'src').should('include', 'checked_backyarder')
    cy.get('.more-info-section > :nth-child(4) > div > h3').should('have.text', 'Needs to be Pruned')
    cy.get('.more-info-section > :nth-child(4) > div > p').should('have.text', 'April')

    cy.get(':nth-child(5) > .checkbox').should('have.attr', 'src').should('include', 'checked_backyarder')
    cy.get('.more-info-section > :nth-child(5) > div > h3').should('have.text', 'Drought Tolerant')

    cy.get(':nth-child(6) > .checkbox').should('have.attr', 'src').should('include', 'checked_backyarder')
    cy.get('.more-info-section > :nth-child(6) > div > h3').should('have.text', 'Pet Safe')

    cy.get(':nth-child(7) > .checkbox').should('have.attr', 'src').should('include', 'unchecked_backyarder')
    cy.get('.more-info-section > :nth-child(7) > div > h3').should('have.text', 'Grown Indoors')

    cy.get(':nth-child(8) > .checkbox').should('have.attr', 'src').should('include', 'unchecked_backyarder')
    cy.get('.more-info-section > :nth-child(8) > div > h3').should('have.text', 'Edible')

    cy.get(':nth-child(9) > .checkbox').should('have.attr', 'src').should('include', 'checked_backyarder')
    cy.get('.more-info-section > :nth-child(9) > div > h3').should('have.text', 'Low Maintenance')

    cy.get(':nth-child(10) > .checkbox').should('have.attr', 'src').should('include', 'checked_backyarder')
    cy.get('.more-info-section > :nth-child(10) > div > h3').should('have.text', 'Non-Invasive Species')

    cy.get('#details-home-button').should('have.text', 'Go back to garden').click()
    cy.url().should('eq', 'http://localhost:3000/')
  })
})