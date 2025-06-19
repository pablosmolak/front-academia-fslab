describe('Tela de Cadastro', () => {
    beforeEach(() => {
        cy.visit('/login');
    });

    const email = Cypress.env('USER_EMAIL');

    it('Deve navegar para tela de esqueci minha senha e validar campos obrigatórios', () => {
        cy.getByData('linkRecuperarSenha').click();

        cy.getByData('bntRecuperarSenha').click();

        cy.contains('Email no formato inválido!').should('exist');
    });
    
    it('Deve navegar para tela de esqueci minha senha e enviar email de recuperação de senha', () => {
        cy.getByData('linkRecuperarSenha').click();

        cy.getByData('inpEmailRecuperarSenha').type(email);
        
        cy.getByData('bntRecuperarSenha').click();

        cy.contains('Email enviado com sucesso!').should('exist');
    });
});
