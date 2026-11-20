const area = (id: number, name: string, indoor = false, due = 0) => ({
  id: String(id), type: 'garden',
  attributes: { name, indoor, position: id - 1, plant_count: 0, needs_water_count: due }
})

describe('Garden areas', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.intercept('GET', '**/api/v1/plants', { fixture: 'onload-plants.json' })
    cy.intercept('GET', '**/api/v1/gardens', { data: [area(1, 'Front yard'), area(2, 'Sunroom', true, 2)] }).as('areas')
    cy.fixture('onload-grid.json').then(grid => {
      cy.intercept({ method: 'GET', pathname: '/api/v1/garden', query: { garden_id: '1' } }, grid).as('area-1')
      const empty = { data: grid.data.map((c: any) => ({ ...c, attributes: { ...c.attributes, name: null, image: null, plant_id: null, content_type: null, status: 'empty' } })) }
      cy.intercept({ method: 'GET', pathname: '/api/v1/garden', query: { garden_id: '2' } }, empty).as('area-2')
    })
    cy.intercept('PATCH', '**/api/v1/cell', { fixture: 'dnd-plant-response.json' }).as('cell')
    cy.visit('http://localhost:3000/')
    cy.wait(['@areas', '@area-1'])
  })

  it('switches between areas, remembers the last one, and sends the area with cell changes', () => {
    cy.get('.area-tab').should('have.length', 2)
    cy.get('.area-tab.active').should('contain', 'Front yard')
    cy.contains('.area-tab', 'Sunroom').find('.area-due').should('contain', '2')
    cy.get('#alert-banner').should('contain', 'Also due').and('contain', '2 in Sunroom')

    cy.contains('.area-tab', 'Sunroom').click()
    cy.wait('@area-2')
    cy.get('.area-tab.active').should('contain', 'Sunroom')
    cy.get('.area-kind [aria-checked="true"]').should('contain', 'Indoor')

    const dataTransfer = new DataTransfer()
    cy.get('[href="/plants/2692"]').first().trigger('dragstart', { dataTransfer })
    cy.get('#J9').trigger('drop', { dataTransfer })
    cy.wait('@cell').its('request.body').should('include', { garden_id: 2, location_id: 'J9' })

    cy.reload()
    cy.wait('@area-2')
    cy.get('.area-tab.active').should('contain', 'Sunroom')
  })

  it('renames the active area, flips it indoor, adds and deletes areas', () => {
    cy.intercept('PATCH', '**/api/v1/gardens/1', req => {
      const b = req.body
      req.reply({ data: [area(1, b.name ?? 'Front yard', b.indoor ?? false), area(2, 'Sunroom', true, 2)] })
    }).as('patch-area')
    cy.intercept('POST', '**/api/v1/gardens', { data: area(3, 'New area') }).as('add-area')
    cy.intercept({ method: 'GET', pathname: '/api/v1/garden', query: { garden_id: '3' } }, { fixture: 'onload-grid.json' }).as('area-3')
    cy.intercept('DELETE', '**/api/v1/gardens/3', { data: [area(1, 'Front yard'), area(2, 'Sunroom', true, 2)] }).as('delete-area')

    cy.get('.area-tab.active').click()
    cy.get('.area-name-input').should('have.value', 'Front yard').clear().type('Veggie beds{enter}')
    cy.wait('@patch-area').its('request.body').should('deep.equal', { name: 'Veggie beds' })
    cy.get('.area-tab.active').should('contain', 'Veggie beds')

    cy.contains('.area-kind button', 'Indoor').click()
    cy.wait('@patch-area').its('request.body').should('deep.equal', { indoor: true })
    cy.get('.area-kind [aria-checked="true"]').should('contain', 'Indoor')

    cy.get('.area-add').click()
    cy.wait(['@add-area', '@area-3'])
    cy.get('.area-name-input').should('have.value', 'New area').type('{esc}')
    cy.get('.area-tab').should('have.length', 3)

    cy.get('.area-delete').click()
    cy.get('.confirm-message').should('contain', 'Delete "New area"')
    cy.contains('.pop-up-button', 'YES').click()
    cy.wait('@delete-area')
    cy.get('.area-tab').should('have.length', 2)
    cy.get('.area-tab.active').should('contain', 'Front yard')
  })
})
