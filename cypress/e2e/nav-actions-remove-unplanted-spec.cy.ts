describe('Nav Actions: Remove Unplanted Items', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/v1/plants', {
        statusCode: 200,
        fixture: 'onload-plants.json'
      }).as('onload-plants');
      
      cy.intercept('GET', '**/api/v1/garden', {
        statusCode: 200,
        fixture: 'onload-grid.json'
      }).as('onload-grid');
      
      cy.intercept('DELETE', '**/api/v1/garden', {
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
        .get('#grid').children().first().should('have.css', 'background-image', 'url("http://localhost:3000/images/plants/274.jpg")')
        .get('#grid').children().last().should('have.css', 'background-color', 'rgb(120, 105, 97)');
      });
    });
  });
});