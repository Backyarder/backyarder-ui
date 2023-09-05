describe('Nav Actions: Remove Unplanted Items', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/plants', {
        statusCode: 200,
        fixture: 'onload-plants.json'
      }).as('onload-plants');
      
      cy.intercept('GET', 'https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/garden', {
        statusCode: 200,
        fixture: 'onload-grid.json'
      }).as('onload-grid');
      
      cy.intercept('DELETE', 'https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/garden', {
        statusCode: 200,
      }).as('remove-unplanted');
      
      cy.visit('http://localhost:3000/');
  });

  it('Should be able to remove unplanted items', () => {
    cy.wait(['@onload-plants', '@onload-grid']).then(() => {
      cy.get('.clear-button').last().click()
      .get('.pop-up-button').last().click()
      .get('.pop-up-button-container').should('not.exist')
      .get('.clear-button').last().click()
      .get('.pop-up-button').first().click()
      .wait('@remove-unplanted').then(() => {
        cy.get('.modal-button').click()
        .get('#grid').children().first().should('have.css', 'background-image', 'url("https://perenual.com/storage/species_image/2692_echinacea_tomato_soup/thumbnail/red-orange-echinacea-echinacea-cone-flower-medicinal.jpg")')
        .get('#grid').children().last().should('have.css', 'background-color', 'rgb(120, 105, 97)');
      });
    });
  });
});