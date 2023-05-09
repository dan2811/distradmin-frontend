describe('login', () => {
  it('logs in programatically with email and password', () => {
    cy.clearAllLocalStorage();
    cy.clearAllCookies();
    cy.clearAllSessionStorage();
    cy.login('cypress-test-user-admin@test.com', 'orange-6837-Haemotology');
    cy.visit('http://localhost:3000');
    cy.wait(10000);
    cy.contains('Create');
  });
});
