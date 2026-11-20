describe('Hardiness zone fit', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/v1/garden', { fixture: 'onload-grid.json' })
    cy.fixture('onload-plants.json').then(plants => {
      const make = (id: number, name: string, min: string, max: string, collection?: string) => ({
        id: null, type: 'list',
        attributes: { image: '/images/kitchen/tree.svg', name, hardiness: { min, max }, type: 'Tree', sunlight: ['full sun'], watering: 'Average', plant_id: id, content_type: 'Plant', collection }
      })
      plants.data.push(make(900300, 'mango', '10', '11', 'trees'), make(900301, 'red maple', '3', '9', 'trees'), make(900302, 'tamarack', '2', '6', 'trees'))
      cy.intercept('GET', '**/api/v1/plants', plants)
    })
    cy.clearLocalStorage()
    cy.visit('http://localhost:3000/')
  })

  it('marks each card against the zone and can hide the ones that will not survive', () => {
    cy.chooseCategory('trees')
    cy.get('.card').should('have.length', 3)
    cy.contains('.card', 'RED MAPLE').find('.zone-fits').should('exist')
    cy.contains('.card', 'MANGO').find('.zone-too-cold').should('exist')
    cy.contains('.card', 'TAMARACK').find('.zone-too-warm').should('exist')

    cy.get('.zone-toggle').should('contain', 'Only plants for zone 8a').find('input').should('not.be.checked').check()
    cy.get('.card').should('have.length', 1).and('contain', 'RED MAPLE')
    cy.get('.zone-hidden').should('contain', '2 hidden')

    cy.reload()
    cy.chooseCategory('trees')
    cy.get('.zone-toggle input').should('be.checked')
    cy.get('.card').should('have.length', 1)
    cy.get('.zone-toggle input').uncheck()
    cy.get('.card').should('have.length', 3)
  })

  it('shows no zone toggle on the INDOOR tab', () => {
    cy.chooseCategory('indoor')
    cy.get('.zone-toggle').should('not.exist')
  })
})
