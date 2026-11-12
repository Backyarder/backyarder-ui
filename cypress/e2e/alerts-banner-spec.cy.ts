describe('Alerts banner', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/v1/plants', { fixture: 'onload-plants.json' })
  })

  it('stays hidden when nothing needs attention', () => {
    cy.intercept('GET', '**/api/v1/garden', { fixture: 'onload-grid.json' })
    cy.visit('http://localhost:3000/')
    cy.get('#grid').should('exist')
    cy.get('#alert-banner').should('not.exist')
  })

  it('lists plants due for water, recent rain and a frost warning, and can be dismissed', () => {
    cy.fixture('onload-grid.json').then(grid => {
      const planted = grid.data.find((c: any) => c.attributes.status === 'locked' && c.attributes.name)
      planted.attributes.needs_water = true
      cy.intercept('GET', '**/api/v1/garden', grid)
      cy.intercept('GET', '**/api/v1/alerts', { fixture: 'alerts-frost-rain.json' })
      cy.visit('http://localhost:3000/')
      cy.get('#alert-banner').should('be.visible')
      cy.get('#alert-banner .alert-water').should('contain', '1 plant needs water').and('contain', `${planted.attributes.name} (${planted.attributes.location_id})`).and('contain', 'rained 0.6 in')
      cy.get('#alert-banner .alert-frost').should('contain', 'Frost warning').and('contain', '31.5°F').and('contain', 'Saturday')
      cy.get('#alert-banner .alert-dismiss').click()
      cy.get('#alert-banner').should('not.exist')
    })
  })

  it('shows a badge in the plant list for plants due for water', () => {
    cy.fixture('onload-grid.json').then(grid => {
      const planted = grid.data.find((c: any) => c.attributes.status === 'locked' && c.attributes.name)
      planted.attributes.needs_water = true
      cy.intercept('GET', '**/api/v1/garden', grid)
      cy.visit('http://localhost:3000/')
      cy.contains('LIST OF GARDEN PLANTS').click()
      cy.get('.needs-water-badge').should('have.length', 1).and('contain', 'needs water')
    })
  })

  it('asks for a zip code when the account has none', () => {
    cy.intercept('GET', '**/api/v1/garden', { fixture: 'onload-grid.json' })
    cy.intercept('GET', '**/api/v1/alerts', { date: '2026-11-12', needs_water: [], recent_rain_in: 0, rain_covers_watering: false, frost: null, weather_available: false, zip_code: null })
    cy.visit('http://localhost:3000/')
    cy.get('#alert-banner .alert-hint a').should('have.attr', 'href', '/settings')
  })
})
