describe('Grid actions: disable', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/v1/plants', {
        statusCode: 200,
        fixture: 'onload-plants.json'
      }).as('onload-plants')
      
      cy.intercept('GET', '**/api/v1/garden', {
        statusCode: 200,
        fixture: 'onload-grid.json'
      }).as('onload-grid')
      
      cy.intercept('PATCH', '**/api/v1/cell', {
        statusCode: 200,
        fixture: 'disable-cell-response.json'
      }).as('disable-cell')
      
      cy.visit('http://localhost:3000/')
    })

    it('should be able to disable a cell', () => {
        cy.wait(['@onload-plants', '@onload-grid']).then(() => {
            cy.get('#J9').click()
            .wait('@disable-cell').then(() => {
                cy.get('#J9')
                .invoke('attr', 'class').should('contain', 'disabled')
            })
        })
    })
})
