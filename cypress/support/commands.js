import 'cypress-file-upload';

Cypress.Commands.add("getByData", (seletor) => {
  return cy.get(`[data-test=${seletor}]`);
});

Cypress.Commands.add("logar", () => {
  const email = Cypress.env('USER_EMAIL');
  const senha = Cypress.env('USER_PASSWORD');

  cy.visit('/login');
  cy.getByData('inpEmail').type(email);
  cy.getByData('inpSenha').type(senha);

  cy.getByData('bntEntrar').click();
})

Cypress.Commands.add("excluirUsuario", () => {
  cy.wait(1000)
  cy.getByData('dropMenu').click({ force: true });
  cy.getByData('dropMenuPerfil').click({ force: true });
  cy.getByData('btnEditarPerfil').click();
  cy.getByData('btnDeletarPerfil').click();
  cy.getByData('btnExcluirConta').click();

  cy.contains('Conta excluída com sucesso!').should('exist');
})