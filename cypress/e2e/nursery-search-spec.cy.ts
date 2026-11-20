describe('Nursery search covers every category', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/v1/garden', { fixture: 'onload-grid.json' })
    cy.intercept('GET', '**/api/v1/stats', { plant_data: { plants_searchable: 3558 } })
    cy.fixture('onload-plants.json').then(plants => {
      const kitchen = (id: number, name: string) => ({ id: null, type: 'list', attributes: { image: '/images/kitchen/herb.svg', name, hardiness: { min: '2', max: '11' }, type: 'Herb', sunlight: ['full sun'], watering: 'Frequent', plant_id: id, content_type: 'Plant', collection: 'kitchen' } })
      plants.data.push(kitchen(900002, 'basil'), kitchen(900001, 'tomato'))
      cy.intercept('GET', '**/api/v1/plants', plants)
      cy.intercept('GET', '**/api/v1/search/basil', { data: [kitchen(900002, 'basil'), kitchen(900200, 'Thai basil')] }).as('search')
    })
    cy.visit('http://localhost:3000/')
  })

  it('shows built-in results on Nursery with a category tag and leaves other categories intact', () => {
    cy.get('.category-picker').should('contain', 'Nursery').and('not.contain', '30')
    cy.get('.search-bar').should('have.attr', 'placeholder', 'Search all 3,500+ plants... ')
    cy.get('#plants .search-results .card').should('have.length', 30)

    cy.get('.search-bar').type('basil{enter}')
    cy.wait('@search')
    cy.get('#plants .search-results .card').should('have.length', 2)
    cy.get('#plants .search-results .card').first().should('contain', 'BASIL').find('.card-category').should('have.text', 'Kitchen garden')

    cy.chooseCategory('kitchen')
    cy.get('#plants .search-results .card').should('have.length', 2) // basil and tomato: the full list, not the search
    cy.get('.search-bar').should('have.value', '').and('have.attr', 'placeholder', 'Filter kitchen garden... ')
    cy.get('.category-picker').should('contain', '2')

    cy.chooseCategory('plants')
    cy.get('.search-bar').should('have.value', 'basil')
    cy.get('#plants .search-results .card').should('have.length', 2)
    cy.get('.search-bar').clear()
    cy.get('#plants .search-results .card').should('have.length', 30)
  })
})
