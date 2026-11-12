describe('Companion planting hints', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/v1/plants', { fixture: 'onload-plants.json' })
    cy.intercept('PATCH', '**/api/v1/cell', { statusCode: 200, body: { data: { status: 'placed' } } })
    cy.fixture('onload-grid.json').then(grid => {
      const set = (loc: string, name: string, status: string) => {
        const cell = grid.data.find((c: any) => c.attributes.location_id === loc)
        Object.assign(cell.attributes, { name, status, plant_id: 9000 + loc.charCodeAt(1), content_type: 'Plant', image: '/images/plants/274.jpg', watering: 'Average' })
      }
      grid.data.forEach((c: any) => Object.assign(c.attributes, { name: null, status: 'empty', plant_id: null, image: null }))
      set('B2', 'cherry tomato', 'locked')
      set('A1', 'sweet basil', 'locked')
      set('A2', 'fennel', 'placed')
      set('C3', 'peppermint', 'placed')   // not a pepper: no hint
      set('E5', 'basil', 'placed')        // not a neighbour of B2
      cy.intercept('GET', '**/api/v1/garden', grid)
    })
    cy.visit('http://localhost:3000/')
  })

  it('tints the neighbours of an open cell and lists its companions', () => {
    cy.get('#B2').click()
    cy.get('#A1').should('have.class', 'companion-good')
    cy.get('#A2').should('have.class', 'companion-bad')
    cy.get('#C3').should('not.have.class', 'companion-good').and('not.have.class', 'companion-bad')
    cy.get('#E5').should('not.have.class', 'companion-good')
    cy.get('.companion-hint .likes').should('contain', 'Likes basil')
    cy.get('.companion-hint .avoid').should('contain', 'Avoid').and('contain', 'fennel')
    cy.get('.close-modal').click()
    cy.get('#A1').should('not.have.class', 'companion-good')
  })

  it('shows nothing for plants outside the table', () => {
    cy.get('#C3').click()
    cy.get('.companion-hint').should('not.exist')
    cy.get('#B2').should('not.have.class', 'companion-good').and('not.have.class', 'companion-bad')
  })

  it('lists companions on the details page', () => {
    cy.intercept('GET', '**/api/v1/plants/2692', { fixture: 'plant-details.json' }).as('details')
    cy.fixture('plant-details.json').then(details => {
      details.data.attributes.name = 'tomato'
      cy.intercept('GET', '**/api/v1/plants/2692', details)
    })
    cy.visit('http://localhost:3000/plants/2692')
    cy.get('.companions-section .companions-likes').should('contain', 'basil')
    cy.get('.companions-section .companions-avoid').should('contain', 'fennel')
  })
})
