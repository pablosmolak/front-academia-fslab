/// <reference types="cypress" />

describe('Navegação de cursos', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('Sem logar deve navegar para segunda tela de curso e escolher o 3 curso', () => {
        cy.getByData('button-proxima-pagina').click();
        cy.getByData('linkCurso2').click();

        cy.url().should('match', /\/curso\/[0-9a-fA-F-]{36}$/);

        cy.getByData("btnAcessarCurso").should('exist');
        cy.getByData("dropOutrasAcoes").should('not.exist');
    });

    it('Logado deve navegar para segunda tela de curso e escolher o 3 curso', () => {
        cy.logar();
        cy.getByData('button-proxima-pagina').click();
        cy.getByData('linkCurso2').click();

        cy.url().should('match', /\/curso\/[0-9a-fA-F-]{36}$/);

        cy.getByData("btnAcessarCurso").should('exist');
        cy.getByData("dropOutrasAcoes").should('exist');
    });

    it('Sem logar deve tentar se inscrever no curso', () => {
        cy.getByData('button-proxima-pagina').click();
        cy.getByData('linkCurso2').click();

        cy.url().should('match', /\/curso\/[0-9a-fA-F-]{36}$/);

        cy.getByData("btnAcessarCurso").click();
        cy.location('pathname').should('eq', '/login');
    });

    it('Sem estar logado previamente deve se inscrever no curso', () => {
        cy.getByData('button-proxima-pagina').click();
        cy.getByData('linkCurso2').click();

        cy.url().should('match', /\/curso\/[0-9a-fA-F-]{36}$/);

        cy.getByData("btnAcessarCurso").click();
        cy.location('pathname').should('eq', '/login');

        cy.logar();

        cy.wait(5000);

        cy.url().should('match', /\/curso\/[0-9a-fA-F-]{36}\/player$/);
    });

    it('Deve logar e se desiscrever do curso', () => {
        cy.logar();

        cy.getByData('button-proxima-pagina').click();
        cy.getByData('linkCurso2').click();

        cy.url().should('match', /\/curso\/[0-9a-fA-F-]{36}$/);

        cy.getByData('dropOutrasAcoes').click();
        cy.getByData('dropItemDesiscreverDoCurso').click();

        cy.contains('Inscrição cancelada com sucesso!').should('exist');
    })

    it('Deve logar e se acessar um curso', () => {
        cy.logar();

        cy.getByData('button-proxima-pagina').click();
        cy.getByData('linkCurso3').click();

        cy.url().should('match', /\/curso\/[0-9a-fA-F-]{36}$/);

        cy.getByData("btnAcessarCurso").click();

        cy.url().should('match', /\/curso\/[0-9a-fA-F-]{36}\/player$/);
    });

    function navegarConteudo() {
        cy.wait(500);

        cy.get('body').then(($body) => {
            const temProximo = $body.find('[data-test="btnProximoConteudo"]').length > 0;
            const temFinalizar = $body.find('[data-test="btnfinalizarConteudo"]').length > 0;

            if (temFinalizar) {
                cy.getByData('btnfinalizarConteudo')
                    .should('be.visible')
                    .click()
                    .then(() => {
                        navegarConteudo();
                    });
            } else if (temProximo) {
                cy.getByData('btnProximoConteudo')
                    .should('be.visible')
                    .click()
                    .then(() => {
                        navegarConteudo();
                    });
            }
        });
    }

    it('deve navegar para o player do curso e finalizar o curso', () => {
        cy.logar();

        cy.getByData('button-proxima-pagina').click();
        cy.getByData('linkCurso3').click();

        cy.url().should('match', /\/curso\/[0-9a-fA-F-]{36}$/);

        cy.getByData("btnAcessarCurso").click();

        cy.url().should('match', /\/curso\/[0-9a-fA-F-]{36}\/player$/);

        navegarConteudo();

        cy.getByData('linkSidebarCertificado').should('exist');
    })

    it('deve acessar o certificado do curso', () => {
        cy.logar();

        cy.getByData('button-proxima-pagina').click();
        cy.getByData('linkCurso3').click();

        cy.url().should('match', /\/curso\/[0-9a-fA-F-]{36}$/);

        cy.getByData('dropOutrasAcoes').click();
        cy.getByData('dropItemCertificado').click();

        cy.contains('CERTIFICADO DE CONCLUSÃO').should('exist');
        cy.url().should('match', /\/usuario\/certificado\/[0-9a-fA-F\-]{36}$/);
    });
});
