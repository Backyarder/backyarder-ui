describe('SideBar Actions: Search', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/plants', {
        statusCode: 200,
        fixture: 'onload-plants.json'
      }).as('onload-plants');
      
      cy.intercept('GET', 'https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/garden', {
        statusCode: 200,
        fixture: 'onload-grid.json'
      }).as('onload-grid');
      
      cy.intercept('GET', 'https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/search/pear', {
        statusCode: 200,
        fixture: 'search-pear-response.json'
      }).as('search-pear');

      cy.intercept('GET', 'https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/search/asdfjkl', {
        statusCode: 200,
        fixture: 'search-asdfjkl-response.json'
      }).as('search-asdfjkl');
      
      cy.visit('http://localhost:3000/');
  });

  it('Should search for plants', () => {
    cy.wait(['@onload-plants', '@onload-grid']).then(() => {
      cy.get('.search').find('input').type('pear')
      .get('.submit-search').click()
      .wait('@search-pear').then(() => {
        cy.get('.card').should('have.length', 10);
      });
    });
  });

  it('Should not be case sensitive', () => {
    cy.wait(['@onload-plants', '@onload-grid']).then(() => {
      cy.get('.search').find('input').type('pEaR')
      .get('.search-bar').type('{enter}')
      .wait('@search-pear').then(() => {
        cy.get('.card').should('have.length', 10);
      });
    });
  });

  it('Should display a message when no results match search criteria', () => {
    cy.wait(['@onload-plants', '@onload-grid']).then(() => {
      cy.get('.search').find('input').type('asdfjkl')
      .get('.submit-search').click()
      .wait('@search-asdfjkl').then(() => {
        cy.get('.loading').should('have.text', 'There are no plants in our nursery matching your search');
      });
    });
  });
});