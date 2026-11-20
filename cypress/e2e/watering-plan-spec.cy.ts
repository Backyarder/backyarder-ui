describe('Watering plan for a planted cell', () => {
  const plan = {
    watering: 'Minimum', planted_at: '2026-01-01T12:00:00Z', last_watered_at: '2026-11-10T12:00:00Z',
    next_water_at: '2026-12-08T12:00:00Z', needs_water: false,
    watering_days: 28, watering_reason: 'Established and drought tolerant: only during long dry spells',
    watering_source: 'auto', watering_auto_days: 28, watering_rain_resets: true, watering_override_days: null
  }

  beforeEach(() => {
    cy.intercept('GET', '**/api/v1/plants', { fixture: 'onload-plants.json' })
    cy.fixture('onload-grid.json').then(grid => {
      grid.data.forEach((c: any) => Object.assign(c.attributes, { name: null, status: 'empty', plant_id: null, image: null }))
      const cell = grid.data.find((c: any) => c.attributes.location_id === 'B2')
      Object.assign(cell.attributes, { name: 'butterfly bush', status: 'locked', plant_id: 900483, content_type: 'Plant', image: '/images/plants/274.jpg' }, plan)
      cy.intercept('GET', '**/api/v1/garden', grid)
    })
    cy.visit('http://localhost:3000/')
  })

  it('shows the plan in plain words and sends a custom schedule', () => {
    cy.intercept('PATCH', '**/api/v1/cell', req => {
      const days = req.body.days
      req.reply({ statusCode: 200, body: { data: { id: '12', type: 'cell', attributes: {
        ...plan, location_id: 'B2', status: 'locked', name: 'butterfly bush', plant_id: 900483, content_type: 'Plant',
        watering_override_days: days, watering_source: days === null ? 'auto' : 'custom',
        watering_days: days === null ? 28 : (days === 0 ? null : days),
        watering_reason: days === null ? plan.watering_reason : (days === 0 ? 'Reminders turned off for this plant' : 'Your own schedule'),
        next_water_at: days === 0 ? null : plan.next_water_at
      } } } })
    }).as('set-watering')

    cy.get('#B2').click()
    cy.get('.watering-plan').should('contain', 'Water every 28 days')
      .and('contain', 'Established and drought tolerant: only during long dry spells, rain resets this')
    cy.get('.watering-override select').should('have.value', 'auto')
      .find('option:selected').should('have.text', 'Auto (every 28 days)')

    cy.get('.watering-override select').select('Every 14 days')
    cy.wait('@set-watering').its('request.body').should('deep.include', { action: 'set_watering', location_id: 'B2', days: 14 })
    cy.get('.watering-plan').should('contain', 'Water every 14 days').and('contain', 'Your own schedule')
    cy.get('.cell-info').should('exist') // the panel stays open

    cy.get('.watering-override select').select('Never')
    cy.wait('@set-watering').its('request.body.days').should('eq', 0)
    cy.get('.watering-plan').should('contain', 'No watering reminders')

    cy.get('.watering-override select').select('Auto (every 28 days)')
    cy.wait('@set-watering').its('request.body.days').should('eq', null)
    cy.get('.watering-plan').should('contain', 'Water every 28 days')
  })
})
