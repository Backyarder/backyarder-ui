describe('List Actions', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/plants', {
      statusCode: 200,
      fixture: 'onload-plants.json'
    }).as('onload-plants');
    
    cy.intercept('GET', 'https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/garden', {
      statusCode: 200,
      fixture: 'onload-grid.json'
    }).as('onload-grid');
    
    cy.intercept('PATCH', 'https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/cell', {
      statusCode: 200,
      fixture: 'plant-cell-response.json'
    }).as('plant-cell');
    
    cy.visit('http://localhost:3000/');
  })

  it('Should update quantities of new and existing plants', () => {
    cy.wait(['@onload-plants', '@onload-grid']).then(() => {
      cy.get('#A2').click()
      .get('.cell-button.plant-button').click()
      .wait('@plant-cell').then(() => {
        cy.get('.nav-button').first().click()
        .get('.plant-info-container').contains('p', 'CONEFLOWER x2')
        .get('.nav-button').last().click()
        .get('#D2').click()
        .get('.cell-button.plant-button').click()
        .wait('@plant-cell').then(() => {
          cy.get('.nav-button').first().click()
          .get('.plant-info-container').last().contains('p', 'SMALL GLOBE THISTLE x1')
          .intercept('PATCH', 'https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/cell', {
            statusCode: 200,
            fixture: 'delete-cell-response.json'
          }).as('delete-cell')
          .get('.nav-button').last().click()
          .get('#A1').click()
          .get('.cell-button.remove-button').click()
          .wait('@delete-cell').then(() => {
            cy.get('#A2').click()
            .get('.cell-button.remove-button').click()
            .wait('@delete-cell').then(() => {
              cy.get('#D2').click()
              .get('.cell-button.remove-button').click()
              .wait('@delete-cell').then(() => {
                cy.get('.nav-button').first().click()
                .get('.empty-list-text').should('have.text', 'Your garden is empty!');
              });
            });
          });
        });
      });
    });
  });
})
