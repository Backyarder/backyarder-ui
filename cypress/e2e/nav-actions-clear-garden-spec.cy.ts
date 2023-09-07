describe('Nav Actions: Clear Garden', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/plants', {
        statusCode: 200,
        fixture: 'onload-plants.json'
      }).as('onload-plants');
      
      cy.intercept('GET', 'https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/garden', {
        statusCode: 200,
        fixture: 'onload-grid.json'
      }).as('onload-grid');
      
      cy.intercept('DELETE', 'https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/all', {
        statusCode: 200,
      }).as('clear-garden');
      
      cy.visit('http://localhost:3000/');
  });

  it('Should be able to clear the garden', () => {
    cy.wait(['@onload-plants', '@onload-grid']).then(() => {
      cy.get('.clear-button').first().click()
      .get('.pop-up-button').last().click()
      .get('.pop-up-button-container').should('not.exist')
      .get('.clear-button').first().click()
      .get('.pop-up-button').first().click()
      .wait('@clear-garden').then(() => {
        cy.get('.modal-button').click()
        .get('#grid').children().each(cell => {
          cy.wrap(cell).should('have.css', 'background-image', 'url("http://localhost:3000/undefined")')
        });
      });
    });
  });
});