/// <reference types="cypress" />

describe('Tela de Login', () => {
    beforeEach(() => {
        cy.logar();
        cy.wait(2000);
        cy.visit('/usuario/meuperfil');
    });

    const senha = Cypress.env('USER_PASSWORD');

    it('Deve validar o fluxo de editar perfil com campos obrigatórios', () => {
        cy.getByData('btnEditarPerfil').click();

        cy.getByData('inpNomePerfil').clear();
        cy.getByData('inpEmailPerfil').clear();
        cy.getByData('inpAlterarSenhaPerfil').click();

        cy.getByData('btnAtualizarPerfil').click();

        cy.contains('Deve ter no mínimo 3 caracteres').should('exist');
        cy.contains('Email no formato inválido!').should('exist');
        cy.contains('A senha é obrigatória.').should('exist');
        cy.contains('A confirmação da senha é obrigatória.').should('exist');
    });

    it('Deve alterar informações do perfil', () => {
        cy.getByData('btnEditarPerfil').click();

        cy.getByData('inpNomePerfil').clear().type('Administrador');

        cy.getByData('inpAlterarSenhaPerfil').click();

        cy.getByData('inpSenhaPerfil').type(senha);
        cy.getByData('inpConfirmaSenhaPerfil').type(senha);

        cy.getByData('btnAtualizarPerfil').click();

        cy.contains('Usuário atualizado com sucesso!').should('exist');
    });

    it('Deve validar limitador do tamanho da foto do perfil', () => {
        cy.getByData('btnEditarPerfil').click();

        cy.getByData('inpFotoPerfil').attachFile('fotoGrande.jpg');

        cy.wait(500);

        cy.getByData('bntCropCortar').click();

        const raw = Number(Cypress.env('LIMITE_UPLOAD_ARQUIVOS'));
        const limite = isNaN(raw) ? 0 : raw;
        cy.contains(`O tamanho da imagem recortada ultrapassa o limite de ${limite}MB. Tente escolher uma imagem menor ou ajustar o recorte.`).should('exist');
    })

    it('Deve alterar a foto do perfil', () => {
        cy.getByData('btnEditarPerfil').click();

        cy.getByData('inpFotoPerfil').attachFile('fotoPerfil.jpg');

        cy.wait(500);

        cy.getByData('bntCropCortar').click();
    }); 
});
