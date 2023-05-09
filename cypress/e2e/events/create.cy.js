describe('Create Event', () => {
  it('can create an event', () => {
    cy.login('cypress-test-user-admin@test.com', 'orange-6837-Haemotology');
    cy.visit('http://localhost:3000');
    cy.wait(10000);
    cy.get('table').should('be.visible');
    cy.contains('Create').click();
    cy.wait(10000);
    cy.get('dataTestId').should('contain.text', 'client');
  });
});
