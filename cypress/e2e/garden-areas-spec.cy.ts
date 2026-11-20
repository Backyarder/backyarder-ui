const area = (id: number, name: string, indoor = false, due = 0, rows = 10, cols = 10) => ({
  id: String(id), type: 'garden',
  attributes: { name, indoor, position: id - 1, rows, cols, plant_count: 0, needs_water_count: due }
})

describe('Garden plots', () => {
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
    cy.get('.area-tab.active').should('contain', 'Sunroom').click()
    cy.get('.area-kind-option[aria-checked="true"]').should('contain', 'Indoors')
    cy.get('body').type('{esc}')
    cy.get('.area-menu').should('not.exist')

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
    cy.intercept('POST', '**/api/v1/gardens', { delay: 600, body: { data: area(3, 'Raised bed', false, 0, 4, 8) } }).as('add-area')
    cy.intercept({ method: 'GET', pathname: '/api/v1/garden', query: { garden_id: '3' } }, { fixture: 'onload-grid.json' }).as('area-3')
    cy.intercept('DELETE', '**/api/v1/gardens/3', { delay: 600, body: { data: [area(1, 'Front yard'), area(2, 'Sunroom', true, 2)] } }).as('delete-area')

    cy.get('.area-menu').should('not.exist')
    cy.get('.area-tab.active').click()
    cy.get('.area-menu').should('be.visible')
    cy.contains('.area-menu-item', 'Rename').click()
    cy.get('.area-name-input').should('have.value', 'Front yard').clear().type('Veggie beds{enter}')
    cy.wait('@patch-area').its('request.body').should('deep.equal', { name: 'Veggie beds' })
    cy.get('.area-tab.active').should('contain', 'Veggie beds')

    cy.get('.area-tab.active').click()
    cy.get('.area-kind-option[aria-checked="true"]').should('contain', 'Outdoors')
    cy.contains('.area-kind-option', 'Indoors').click()
    cy.wait('@patch-area').its('request.body').should('deep.equal', { indoor: true })
    cy.get('.area-menu').should('not.exist')
    cy.get('.area-tab.active .area-icon').should('have.text', 'home')
    cy.get('.area-tab.active').click()
    cy.get('.area-kind-option[aria-checked="true"]').should('contain', 'Indoors')
    cy.get('body').type('{esc}')

    cy.get('#grid > .cell').should('have.length', 100)
    cy.get('.area-add').should('contain', 'Add plot').click()
    cy.get('.plot-form').should('be.visible')
    cy.focused().should('have.attr', 'placeholder').and('contain', 'Raised bed')
    cy.focused().type('Raised bed')
    cy.get('.plot-size').select('4x8')
    cy.get('.plot-preview-grid span').should('have.length', 32)
    cy.get('.plot-preview-caption').should('contain', '4 rows × 8 across')
    cy.contains('.plot-create', 'Create plot').click()
    cy.get('.plot-create').should('be.disabled').and('contain', 'Creating').find('.area-spinner').should('exist')
    cy.wait('@add-area').its('request.body').should('deep.equal', { name: 'Raised bed', indoor: false, rows: 4, cols: 8 })
    cy.wait('@area-3')
    cy.get('.plot-form').should('not.exist')
    cy.get('.area-tab').should('have.length', 3)
    cy.get('.area-tab.active').should('contain', 'Raised bed')
    cy.get('#grid > .cell').should('have.length', 32)
    cy.get('#D8').should('exist')
    cy.get('#E1').should('not.exist')

    cy.get('.area-tab.active').click()
    cy.contains('.area-menu-item', 'Delete plot').click()
    cy.get('.confirm-message').should('contain', 'Delete the plot "Raised bed"')
    cy.contains('.pop-up-button', 'YES').click()
    cy.get('.area-tab.deleting').should('contain', 'Deleting Raised bed').find('.area-spinner').should('exist')
    cy.wait('@delete-area')
    cy.get('.area-tab.deleting').should('not.exist')
    cy.get('.area-tab').should('have.length', 2)
    cy.get('.area-tab.active').should('contain', 'Front yard')
  })

  it('builds a custom-size indoor plot and can cancel the form', () => {
    cy.intercept('POST', '**/api/v1/gardens', { data: area(3, 'Windowsill', true, 0, 1, 5) }).as('add-area')
    cy.fixture('onload-grid.json').then(grid => {
      cy.intercept({ method: 'GET', pathname: '/api/v1/garden', query: { garden_id: '3' } }, grid).as('area-3')
    })

    cy.get('.area-add').click()
    cy.get('body').type('{esc}')
    cy.get('.plot-form').should('not.exist')

    cy.get('.area-add').click()
    cy.focused().type('Windowsill')
    cy.get('.plot-size').select('custom')
    cy.get('input[aria-label="Rows"]').clear().type('1')
    cy.get('input[aria-label="Columns"]').clear().type('5')
    cy.get('input[aria-label="Rows"]').clear().type('40').blur().should('have.value', '15')
    cy.get('input[aria-label="Rows"]').clear().type('1')
    cy.get('.plot-preview-caption').should('contain', '1 row × 5 across')
    cy.contains('.plot-where button', 'Indoors').click()
    cy.get('.plot-hint').should('contain', 'No rain credit')
    cy.contains('.plot-create', 'Create plot').click()
    cy.wait('@add-area').its('request.body').should('deep.equal', { name: 'Windowsill', indoor: true, rows: 1, cols: 5 })
    cy.wait('@area-3')
    cy.get('#grid > .cell').should('have.length', 5)
    cy.get('.area-tab.active .area-icon').should('have.text', 'home')
  })
})
