/// <reference types="cypress" />

describe('Tela de Login', () => {
    beforeEach(() => {
        cy.visit('/login');
    });

    const email = Cypress.env('USER_EMAIL');
    const senha = Cypress.env('USER_PASSWORD');

    it('Deve validar o fluxo de login com campos obrigatórios', () => {
        cy.getByData('bntEntrar').click();

        cy.contains('Email no formato inválido!').should('exist');
        cy.contains('Mínimo 8 caracteres, com 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial.').should('exist');
    });

    it('Deve validar usuário ou senhas incorretas', () => {
        cy.getByData('inpEmail').type("teste@gmail.com");
        cy.getByData('inpSenha').type("Dev@12345");

        cy.getByData('bntEntrar').click();

        cy.contains("E-mail ou senha incorretos!").should('exist');
    })

    it('Deve Realizar login corretamente', () => {
        cy.getByData('inpEmail').type(email);
        cy.getByData('inpSenha').type(senha);

        cy.getByData('bntEntrar').click();

        cy.contains("E-mail ou senha incorretos!").should('not.exist');
        cy.url().should('not.include', '/login');
    })
});
