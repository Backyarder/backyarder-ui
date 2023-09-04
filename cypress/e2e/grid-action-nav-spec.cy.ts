describe('Grid actions: plant', () => {
    beforeEach(() => {
      cy.intercept('GET', 'https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/plants', {
        statusCode: 200,
        fixture: 'onload-plants.json'
      }).as('onload-plants')
      
      cy.intercept('GET', 'https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/garden', {
        statusCode: 200,
        fixture: 'onload-grid.json'
      }).as('onload-grid')

      cy.intercept('GET', 'https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/plants/2692', {
        statusCode: 200,
        fixture: 'plant-details.json'
      }).as('plant-details')
      
      cy.visit('http://localhost:3000/')
    })

    it('should be able to disable a cell', () => {
        cy.wait(['@onload-plants', '@onload-grid']).then(() => {
            cy.get('#A1').click()
            .get('a.cell-button').click()
        })

        cy.wait('@plant-details').then(() => {
            cy.url().should('eql', 'http://localhost:3000/plants/2692')
        })
    })
})
