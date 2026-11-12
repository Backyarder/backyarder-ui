describe('Login', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/v1/auth/me', { statusCode: 401, body: { error: 'Please log in.' } }).as('me')
    cy.intercept('GET', '**/api/v1/plants', { fixture: 'onload-plants.json' })
    cy.intercept('GET', '**/api/v1/garden', { fixture: 'onload-grid.json' })
  })

  it('sends a signed-out visitor to the login page and in after logging in', () => {
    cy.intercept('POST', '**/api/v1/auth/login', { fixture: 'me.json' }).as('login')
    cy.visit('http://localhost:3000/')
    cy.location('pathname').should('eq', '/login')
    cy.get('#userIcon').should('not.exist')

    cy.get('#login-email').type('gardener@example.com')
    cy.get('#login-password').type('gardening1')
    cy.get('#login-submit').click()
    cy.wait('@login').its('request.body').should('deep.equal', { email: 'gardener@example.com', password: 'gardening1' })
    cy.location('pathname').should('eq', '/')
    cy.get('#grid').should('exist')
  })

  it('shows the server message when the password is wrong', () => {
    cy.intercept('POST', '**/api/v1/auth/login', { statusCode: 401, body: { error: 'Email or password is incorrect.' } })
    cy.visit('http://localhost:3000/login')
    cy.get('#login-email').type('gardener@example.com')
    cy.get('#login-password').type('nope')
    cy.get('#login-submit').click()
    cy.get('.login-error').should('contain', 'Email or password is incorrect.')
    cy.location('pathname').should('eq', '/login')
  })

  it('signs up with an optional zip code', () => {
    cy.intercept('POST', '**/api/v1/auth/signup', { statusCode: 201, fixture: 'me.json' }).as('signup')
    cy.visit('http://localhost:3000/login')
    cy.contains('Create an account').click()
    cy.get('#login-email').type('new@example.com')
    cy.get('#login-password').type('gardening1')
    cy.get('#login-zip').type('30501')
    cy.get('#login-submit').click()
    cy.wait('@signup').its('request.body').should('deep.equal', { email: 'new@example.com', password: 'gardening1', zip_code: '30501' })
    cy.location('pathname').should('eq', '/')
  })

  it('logs out from the header menu', () => {
    cy.intercept('GET', '**/api/v1/auth/me', { fixture: 'me.json' })
    cy.intercept('DELETE', '**/api/v1/auth/logout', { statusCode: 204, body: '' }).as('logout')
    cy.visit('http://localhost:3000/')
    cy.get('#userIcon').click()
    cy.get('#logout').click()
    cy.wait('@logout')
    cy.location('pathname').should('eq', '/login')
  })
})
