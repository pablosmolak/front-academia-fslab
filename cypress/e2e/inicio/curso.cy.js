describe('Tela de Cadastro', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    function navegarAteFinal() {
        cy.log('Verificando botões...');

        cy.wait(1000)

        cy.get('body').then(($body) => {
            const temProximo = $body.find('[data-test="btnProximoConteudo"]').length > 0;
            const temFinalizar = $body.find('[data-test="btnfinalizarConteudo"]').length > 0;

            if (temFinalizar) {
                cy.get('[data-test="btnfinalizarConteudo"]')
                    .should('be.visible')
                    .click()

                // Espera carregar o próximo conteúdo
                cy.wait(500);
                cy.log('Navegando para o próximo conteúdo...');
                navegarAteFinal();

            } else if (temProximo) {
                cy.get('[data-test="btnProximoConteudo"]')
                    .should('be.visible')
                    .click();
            } else {
                cy.log('Nenhum botão encontrado. Curso possivelmente finalizado.');
            }
        });
    }

    it('Sem logar deve navegar para segunda tela de curso e escolher o 3 curso', () => {
        cy.getByData('button-proxima-pagina').click();
        cy.getByData('linkCurso2').click();

        cy.url().should('match', /\/curso\/[0-9a-fA-F-]{36}$/);

        cy.getByData("btnAcessarCurso").should('exist');
        cy.getByData("dropOutrasAcoes").should('not.exist');
    });

    it('Logado deve navegar para segunda tela de curso e escolher o 3 curso', () => {
        cy.logar()
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

        cy.getByData("btnAcessarCurso").click()
        cy.location('pathname').should('eq', '/login');
    });

    it('Sem estar logado previamente deve se inscrever no curso', () => {
        cy.getByData('button-proxima-pagina').click();
        cy.getByData('linkCurso2').click();

        cy.url().should('match', /\/curso\/[0-9a-fA-F-]{36}$/);

        cy.getByData("btnAcessarCurso").click()
        cy.location('pathname').should('eq', '/login');

        cy.logar()

        cy.wait(2000)

        cy.url().should('match', /\/curso\/[0-9a-fA-F-]{36}\/player$/);
    });

    it('Deve logar e se desiscrever do curso', () => {
        cy.logar()

        cy.getByData('button-proxima-pagina').click();
        cy.getByData('linkCurso2').click();

        cy.url().should('match', /\/curso\/[0-9a-fA-F-]{36}$/);

        cy.getByData('dropOutrasAcoes').click();
        cy.getByData('dropItemDesiscreverDoCurso').click();


        cy.contains('Inscrição cancelada com sucesso!').should('exist');
    })

    it('Deve logar e se acessar um curso', () => {
        cy.logar()

        cy.getByData('button-proxima-pagina').click();
        cy.getByData('linkCurso3').click();

        cy.url().should('match', /\/curso\/[0-9a-fA-F-]{36}$/);

        cy.getByData("btnAcessarCurso").click()

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
        cy.logar()

        cy.getByData('button-proxima-pagina').click();
        cy.getByData('linkCurso3').click();

        cy.url().should('match', /\/curso\/[0-9a-fA-F-]{36}$/);

        cy.getByData("btnAcessarCurso").click()

        cy.url().should('match', /\/curso\/[0-9a-fA-F-]{36}\/player$/);

        navegarConteudo();

        cy.getByData('linkSidebarCertificado').should('exist');
    })

    it('deve acessar o certificado do curso', () => {
        cy.logar()

        cy.getByData('button-proxima-pagina').click();
        cy.getByData('linkCurso3').click();

        cy.url().should('match', /\/curso\/[0-9a-fA-F-]{36}$/);

        cy.getByData('dropOutrasAcoes').click();
        cy.getByData('dropItemCertificado').click();

        cy.contains('CERTIFICADO DE CONCLUSÃO').should('exist');
        cy.url().should('match', /\/usuario\/certificado\/[0-9a-fA-F\-]{36}$/);


    })


    // it('Deve validar o cadastro com e-mail já existente', () => {
    //     cy.getByData('btnCriarConta').click();

    //     cy.getByData('inpNovoNome').type('Novo Usuário');
    //     cy.getByData('inpNovoEmail').type(email);
    //     cy.getByData('inpNovaSenha').type('Dev@1234');

    //     cy.getByData('btnCadastrar').click();

    //     cy.contains('Erro ao cadastrar o usuário, verifique o formulário!').should('exist');
    //     cy.contains('O endereço de e-mail informado já está em uso!').should('exist');
    // })

    // it('Deve cadastrar um novo usuário com sucesso', () => {
    //     cy.getByData('btnCriarConta').click();

    //     cy.getByData('inpNovoNome').type('Novo Usuário');
    //     cy.getByData('inpNovoEmail').type(newEmail);
    //     cy.getByData('inpNovaSenha').type(senha);

    //     cy.getByData('btnCadastrar').click();

    //     cy.contains('Cadastro realizado com sucesso!').should('exist');

    //     cy.excluirUsuario()
    // })
});
