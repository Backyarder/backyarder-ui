describe('Onload', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/plants', {
      statusCode: 200,
      fixture: 'onload-plants.json'
    }).as('onload-plants')
    
    cy.intercept('GET', 'https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/garden', {
      statusCode: 200,
      fixture: 'onload-grid.json'
    }).as('onload-grid')
    
    cy.visit('http://localhost:3000/')
  })
  
  it('should display all required content', () => {
    cy.wait(['@onload-plants', '@onload-grid']).then(() => {
      cy.get('.header-logo').should('exist')
      .get('#plants > :nth-child(3)').children().should('have.length', '30')
      .get('#grid').children().should('have.length', 100)
      .get('#A1').should('have.css', 'background-image', 'url("https://perenual.com/storage/species_image/2692_echinacea_tomato_soup/thumbnail/red-orange-echinacea-echinacea-cone-flower-medicinal.jpg")')
      .get('nav').children().should('have.length', 5)
    })
  })
})
