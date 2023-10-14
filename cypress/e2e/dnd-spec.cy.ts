describe('Drag and Drop', () => {
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
        fixture: 'dnd-plant-response.json'
      }).as('dnd-card-on-cell')

      cy.visit('http://localhost:3000/')
    })

    it('should be able to drag a Card over to a Cell', () => {
        const dataTransfer = new DataTransfer()
        
        cy.wait(['@onload-plants', '@onload-grid']).then(() => {
          cy.get('[href="/plants/2692"]').first().trigger("dragstart", { dataTransfer })
          .get('#J9').trigger("drop", { dataTransfer })
          .should('have.css', 'background-image', 'url("https://perenual.com/storage/species_image/2692_echinacea_tomato_soup/thumbnail/red-orange-echinacea-echinacea-cone-flower-medicinal.jpg")')
        })

        cy.get('#J9').click()
        .get('.cell-info').children().should('have.length', 3)
        .get('.cell-info > .card-image').should('have.attr', 'src', 'https://perenual.com/storage/species_image/2692_echinacea_tomato_soup/thumbnail/red-orange-echinacea-echinacea-cone-flower-medicinal.jpg')
        .get('.cell-info > .plant-name').should('contain', 'CONEFLOWER')
    })
})
