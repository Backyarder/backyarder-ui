describe('Onload', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/plants', {
      statusCode: 200,
      fixture: 'onload-plants.json'
    }).as('onload-plants');
    
    cy.intercept('GET', 'https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/garden', {
      statusCode: 200,
      fixture: 'onload-grid.json'
    }).as('onload-grid');
    
    cy.visit('http://localhost:3000/');
  })
  
  it('should display all required content', () => {
    cy.wait(['@onload-plants', '@onload-grid']).then(() => {
      cy.get('.header-logo').should('exist')
      .get('#plants > :nth-child(3)').children().should('have.length', '30')
      .get('#grid').children().should('have.length', 100)
      .get('#A1').should('have.css', 'background-image', 'url("https://perenual.com/storage/species_image/2692_echinacea_tomato_soup/thumbnail/red-orange-echinacea-echinacea-cone-flower-medicinal.jpg")')
      .get('nav').children().should('have.length', 6)
      .get('.nav-button').first().should('have.text', 'list_altLIST OF GARDEN PLANTS')
      .get('.nav-button').last().should('have.text', 'grid_viewGARDEN VIEW')
      .get('.key').children().should('have.length', 3)
      .get('.key-symbol-container').first().find('.empty-symbol')
      .get('.key-symbol-container').first().contains('p', 'EMPTY')
      .get('.key-symbol-container').eq(1).find('.ready-symbol')
      .get('.key-symbol-container').eq(1).contains('p', 'PLACED')
      .get('.key-symbol-container').eq(2).find('.planted-symbol')
      .get('.key-symbol-container').eq(2).contains('p', 'PLANTED')
      .get('.key-symbol-container').last().find('.unavailable-symbol')
      .get('.key-symbol-container').last().contains('p', 'UNAVAILABLE')
      .get('.clear-button').first().should('have.text', 'bombCLEAR GARDEN')
      .get('.clear-button').last().should('have.text', 'agricultureREMOVE PLACED ITEMS')
      .get('.clear-button').first().click()
      .get('.confirm-modal').contains('p', 'Are you sure you wish to clear your garden? This action cannot be undone.')
      .get('.pop-up-button-container').children().should('have.length', 2)
      .get('.pop-up-button').first().should('have.text', 'YES')
      .get('.pop-up-button').last().should('have.text', 'NO').click()
      .get('.clear-button').last().click()
      .get('.confirm-modal').contains('p', 'Are you sure you wish to remove your unplanted items? This action cannot be undone.')
      .get('.pop-up-button').last().click()
      .get('.nav-button').first().click()
      .get('.plant-element').children().should('have.length', 2)
      .get('.plant-info-container').find('.plant-image')
      .get('.plant-info-container').contains('p', 'CONEFLOWER x1')
      .get('.detail-button').should('have.text', 'VIEW PLANT DETAILS');
    });
  });
});
