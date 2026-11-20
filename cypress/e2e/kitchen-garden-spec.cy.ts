describe('Kitchen garden tab', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/v1/garden', { fixture: 'onload-grid.json' })
    cy.fixture('onload-plants.json').then(plants => {
      const kitchen = (id: number, name: string, type: string, icon: string) => ({
        id: null, type: 'list',
        attributes: { image: `/images/kitchen/${icon}.svg`, name, hardiness: { min: '2', max: '11' }, type, sunlight: ['full sun'], watering: 'Frequent', plant_id: id, content_type: 'Plant', collection: 'kitchen' }
      })
      plants.data.push(kitchen(900001, 'tomato', 'Vegetable', 'tomato'), kitchen(900002, 'basil', 'Herb', 'herb'))
      plants.data.push({ ...kitchen(900080, 'zinnia', 'Flower', 'flower'), attributes: { ...kitchen(900080, 'zinnia', 'Flower', 'flower').attributes, collection: 'flowers' } })
      plants.data.push({ ...kitchen(900110, 'white oak', 'Tree', 'tree'), attributes: { ...kitchen(900110, 'white oak', 'Tree', 'tree').attributes, collection: 'trees' } })
      plants.data.push({ ...kitchen(900130, 'hens and chicks', 'Succulent', 'succulent'), attributes: { ...kitchen(900130, 'hens and chicks', 'Succulent', 'succulent').attributes, collection: 'succulents' } })
      plants.data.push({ ...kitchen(900200, 'snake plant', 'Houseplant', 'houseplant'), attributes: { ...kitchen(900200, 'snake plant', 'Houseplant', 'houseplant').attributes, collection: 'indoor' } })
      cy.intercept('GET', '**/api/v1/plants', plants)
    })
    cy.visit('http://localhost:3000/')
  })

  it('keeps the kitchen plants off the PLANTS tab and shows them on KITCHEN', () => {
    cy.get('#plants .search-results').children().should('have.length', 30)
    cy.get('.kitchen-tab').click()
    cy.get('.search-bar').should('have.attr', 'placeholder').and('contain', 'Filter kitchen')
    cy.get('.card').should('have.length', 2)
    cy.get('.search-bar').type('bas')
    cy.get('.card').should('have.length', 1).and('contain', 'BASIL')
    cy.get('.search-bar').clear()
    cy.get('.card').first().should('contain', 'TOMATO')
    cy.get('.card').first().find('img').should('have.attr', 'src', '/images/kitchen/tomato.svg')
    cy.get('.flowers-tab').click()
    cy.get('.card').should('have.length', 1).and('contain', 'ZINNIA')
    cy.get('.trees-tab').click()
    cy.get('.card').should('have.length', 1).and('contain', 'WHITE OAK')
    cy.get('.search-bar').should('have.attr', 'placeholder').and('contain', 'Filter trees')
    cy.get('.succulents-tab').click()
    cy.get('.card').should('have.length', 1).and('contain', 'HENS AND CHICKS')
    cy.get('.indoor-tab').click()
    cy.get('.card').should('have.length', 1).and('contain', 'SNAKE PLANT')
    cy.get('.plants-tab').click()
    cy.get('.card').should('have.length', 30)
  })
})
