describe('Blog app', function () {
    beforeEach(function () {
        cy.visit('http://localhost:3000');
    });

    it('front page can be opened', function () {
        cy.visit('http://localhost:3000');
        cy.contains('Bloglist Application');
    });

    describe('when valid useraccount exists ', function () {
        beforeEach(function () {
            cy.request('POST', 'http://localhost:3003/api/testing/reset');
            cy.addUser({
                name: 'Guybrush Threepwood',
                username: 'gbrush',
                password: 'kalainen'
            });
        });

        it('user can log in with valid userid and password', function () {
            cy.contains('Login').click();
            cy.get('#username').type('gbrush');
            cy.get('#password').type('kalainen');
            cy.get('#loginButton').click();

            cy.contains('Guybrush Threepwood is logged in.');
        });

        it('login fails with invalid password', function () {
            cy.contains('Login').click();
            cy.get('#username').type('gbrush');
            cy.get('#password').type('valainen');
            cy.get('#loginButton').click();

            cy.get('.error')
                .should('contain', 'wrong username/password')
                .and('have.css', 'color', 'rgb(255, 0, 0)')
                .and('have.css', 'border-style', 'solid');
        });

        describe('when logged in ', function () {
            beforeEach(function () {
                cy.login({ username: 'gbrush', password: 'kalainen' });
            });

            it('A blog can be created ', function () {
                cy.contains('Add new').click();
                cy.get('#titlefield').type('New Blog Title');
                cy.get('#authorfield').type('Newblog Author');
                cy.get('#urlfield').type('http://bloginosoite.fi/blogi');
                cy.get('#createBlog').click();

                cy.contains('New Blog Title');
            });

            describe('and blog already exist', function () {
                beforeEach(function () {
                    cy.addBlog({
                        title: 'Already Existing Blog',
                        author: 'U.N Nown',
                        url: 'http://alreadythere.com/blog'
                    });
                });

                it('can be liked', function () {
                    cy.contains('View').click();
                    cy.contains('Like').click();
                    cy.contains('Likes: 1');
                });

                it('can be removed by creator', function () {
                    cy.contains('View').click();
                    cy.contains('Remove').click();
                    cy.get('.message')
                        .should('contain', 'blog is removed');
                    cy.get('html')
                        .should('not.contain', 'Already Existing Blog');
                });

                it('can not be removed by other users', function () {
                    cy.addUser({
                        name: 'LeChuck',
                        username: 'LeChuck',
                        password: 'kalainen'
                    });
                    cy.contains('Log off').click();
                    cy.login({ username: 'LeChuck', password: 'kalainen' });
                    cy.contains('View').click();
                    cy.contains('Remove').click();
                    cy.get('html')
                        .should('contain', 'Already Existing Blog');
                });
            });
        });
    });
});