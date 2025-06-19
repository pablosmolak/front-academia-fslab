describe('Tela de Cadastro', () => {
    beforeEach(() => {
        cy.visit('/login');
    });

    const email = Cypress.env('USER_EMAIL');
     const senha = Cypress.env('USER_PASSWORD');
    const newEmail = Cypress.env('NEW_USER');

    it('Deve navegar para tela de cadastro e validar campos obrigatórios', () => {
        cy.getByData('btnCriarConta').click();

        cy.getByData('btnCadastrar').click();

        cy.contains('Deve ter no mínimo 3 caracteres').should('exist');
        cy.contains('Este campo é obrigatório').should('exist');
        cy.contains('Este campo é obrigatório').should('exist');
    });

    it('Deve validar o cadastro com e-mail já existente', () => {
        cy.getByData('btnCriarConta').click();

        cy.getByData('inpNovoNome').type('Novo Usuário');
        cy.getByData('inpNovoEmail').type(email);
        cy.getByData('inpNovaSenha').type('Dev@1234');

        cy.getByData('btnCadastrar').click();

        cy.contains('Erro ao cadastrar o usuário, verifique o formulário!').should('exist');
        cy.contains('O endereço de e-mail informado já está em uso!').should('exist');
    })

    it('Deve cadastrar um novo usuário com sucesso', () => {
        cy.getByData('btnCriarConta').click();

        cy.getByData('inpNovoNome').type('Novo Usuário');
        cy.getByData('inpNovoEmail').type(newEmail);
        cy.getByData('inpNovaSenha').type(senha);

        cy.getByData('btnCadastrar').click();

        cy.contains('Cadastro realizado com sucesso!').should('exist');

        cy.excluirUsuario()
    })
});
