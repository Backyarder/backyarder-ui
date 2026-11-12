// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')
// Every spec runs as a signed-in user unless it overrides these.
beforeEach(() => {
  cy.intercept('GET', '**/api/v1/auth/me', { fixture: 'me.json' }).as('me')
  cy.intercept('GET', '**/api/v1/wishlist', { data: [] }).as('wishlist')
  cy.intercept('GET', '**/api/v1/alerts', { fixture: 'alerts-quiet.json' }).as('alerts')
})
