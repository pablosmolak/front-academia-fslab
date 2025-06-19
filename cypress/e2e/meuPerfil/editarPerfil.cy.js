describe('Tela de Login', () => {
    beforeEach(() => {
        cy.logar();
        cy.wait(1000);
        cy.visit('/usuario/meuperfil');
    });

    it('Deve validar o fluxo de login com campos obrigatórios', () => {
        cy.getByData('btnEditarPerfil').click();
        
        cy.getByData('inpFotoPerfil').attachFile('fotoPerfil.jpg');
        
        cy.wait(500);
        
        cy.getByData('bntCropCortar').click();
    });
});
