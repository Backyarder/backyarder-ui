describe('Grid actions: disable', () => {
    beforeEach(() => {
      cy.intercept('GET', 'https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/plants', {
        statusCode: 200,
        fixture: 'onload-plants.json'
      }).as('onload-plants')
      
      cy.intercept('GET', 'https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/garden', {
        statusCode: 200,
        fixture: 'onload-grid.json'
      }).as('onload-grid')
      
      cy.intercept('PATCH', 'https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/cell', {
        statusCode: 200,
        fixture: 'plant-cell-response.json'
      }).as('plant-cell')
      
      cy.visit('http://localhost:3000/')
    })

    it('should be able to disable a cell', () => {
        cy.wait(['@onload-plants', '@onload-grid']).then(() => {
            cy.get('#A1').click()
            .get('.cell-button.plant-button').click()
            .wait('@plant-cell').then(() => {
              cy.get('#A1').should('have.css', 'border', '3px solid rgb(158, 201, 36)')
            })
        })
    })
})
