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
        fixture: 'disable-cell-response.json'
      }).as('disable-cell')
      
      cy.visit('http://localhost:3000/')
    })

    it('should be able to disable a cell', () => {
        cy.wait(['@onload-plants', '@onload-grid']).then(() => {
            cy.get('#J10').click()
            .wait('@disable-cell').then(() => {
                cy.get('#J10')
                .invoke('attr', 'class').should('contain', 'disabled')
            })
        })
    })
})
