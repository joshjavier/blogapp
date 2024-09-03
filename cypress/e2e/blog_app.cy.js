describe('Blog app', function () {
  beforeEach(function () {
    // Clear test database
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)

    // Create a new user
    cy.addUser({
      name: 'Josh Javier',
      username: 'joshjavier',
      password: 'mabuhay',
    })

    cy.visit('')
  })

  it('Login form is shown', function () {
    cy.get('input:first').parent().should('contain', 'username')
    cy.get('input:last').parent().should('contain', 'password')
    cy.get('button').should('contain', 'log in')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.contains('username').siblings('input').type('joshjavier')
      cy.contains('password').siblings('input').type('mabuhay')
      cy.get('button').contains('log in').click()

      cy.contains('Josh Javier logged in')
    })

    it('fails with wrong credentials', function () {
      cy.contains('username').siblings('input').type('joshjavier')
      cy.contains('password').siblings('input').type('manila')
      cy.get('button').contains('log in').click()

      cy.get('[role=alert]')
        .should('contain', 'invalid username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      // Log in and save auth token in local storage
      cy.login({ username: 'joshjavier', password: 'mabuhay' })
    })

    it('A blog can be created', function () {
      cy.contains('create new blog').click()

      cy.contains('title').siblings('input').type('Simplicity of IRC')
      cy.contains('author').siblings('input').type('Susam Pal')
      cy.contains('url').siblings('input').type('https://susam.net/simplicity-of-irc.html')
      cy.get('button[type=submit]').click()

      cy.get('[role=alert]')
        .should('contain', 'a new blog Simplicity of IRC by Susam Pal added')
        .should('have.css', 'color', 'rgb(0, 128, 0)')
    })

    describe('Several blogs exist', function () {
      beforeEach(function () {
        // Create sample blogs
        cy.createBlog({
          title: '40 years of programming',
          author: 'Lars Wirzenius',
          url: 'https://liw.fi/40/',
        })

        cy.createBlog({
          title: 'Detect Caps Lock with JavaScript',
          author: 'David Walsh',
          url: 'https://davidwalsh.name/detect-caps-lock',
        })

        cy.createBlog({
          title: 'Breaking Down Tasks',
          author: 'Jacob Kaplan-Moss',
          url: 'https://jacobian.org/2024/mar/11/breaking-down-tasks/',
        })

        cy.visit('')
      })

      it('a blog can be liked', function () {
        cy.get('button').contains('show').click()
        cy.get('button').contains('like').click()
        cy.contains('likes 1')
      })

      it('the user who created a blog can delete it', function () {
        cy.get('button').contains('show').click()
        cy.get('button').contains('remove').click()
        cy.contains('40 years of programming Lars Wirzenius').should('not.exist')
      })

      it('only the user who created a blog can see its delete button', function () {
        // Create a new user and log in with it
        cy.addUser({
          name: 'Blogless User',
          username: 'bloglessuser',
          password: 'sharpasatack',
        })
        cy.login({ username: 'bloglessuser', password: 'sharpasatack' })
        cy.visit('')

        cy.get('button').contains('show').click()
        cy.get('button').contains('remove').should('not.exist')
      })

      it('blogs are ordered by likes in descending order', function () {
        cy.get('.blog').eq(0).as('firstBlog')
        cy.get('.blog').eq(1).as('secondBlog')
        cy.get('.blog').eq(2).as('thirdBlog')

        cy.get('@secondBlog').contains('show').click()
        cy.get('@secondBlog').contains('likes 0').find('button').click()
        cy.get('@secondBlog').contains('likes 1').find('button').click()
        cy.get('@secondBlog').contains('likes 2').find('button').click()
        cy.get('@secondBlog').contains('likes 3')

        cy.get('@thirdBlog').contains('show').click()
        cy.get('@thirdBlog').contains('likes 0').find('button').click()
        cy.get('@thirdBlog').contains('likes 1').find('button').click()
        cy.get('@thirdBlog').contains('likes 2')

        cy.get('@firstBlog').contains('show').click()
        cy.get('@firstBlog').contains('likes 0').find('button').click()
        cy.get('@firstBlog').contains('likes 1')

        cy.visit('')

        cy.get('.blog').eq(0).should('contain', 'Detect Caps Lock with JavaScript')
        cy.get('.blog').eq(1).should('contain', 'Breaking Down Tasks')
        cy.get('.blog').eq(2).should('contain', '40 years of programming')
      })
    })
  })
})
