/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
Cypress.Commands.add("openFirstIngredient", () => {
    cy.get('[data-testid="ingredient-item"]').first().click();
  });
  
  Cypress.Commands.add("closeModal", () => {
    cy.get('[data-testid="close-modal-button"]').click();
    cy.get('[data-testid="modal"]').should("not.exist");
  });
  
  Cypress.Commands.add("closeModalWithOverlay", () => {
    cy.get('[data-testid="modal-overlay"]').trigger("click", { force: true });
    cy.get('[data-testid="modal"]').should("not.exist");
  });
  
  Cypress.Commands.add("closeModalWithEsc", () => {
    cy.get("body").type("{esc}");
    cy.get('[data-testid="modal"]').should("not.exist");
  });

declare global {
    namespace Cypress {
      interface Chainable {
        openFirstIngredient(): Chainable<void>;
        closeModal(): Chainable<void>;
        closeModalWithOverlay(): Chainable<void>;
        closeModalWithEsc(): Chainable<void>;
      }
    }
  }
  
  export {} 