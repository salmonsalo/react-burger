describe("Constructor", () => {
  const email = "bo@ba.com";
  const password = "2325";
  const testUrl = "http://localhost:3000"
  beforeEach(() => {
    cy.intercept("POST", "login", { fixture: "login" }).as("loginRequest");

    cy.visit(testUrl);
  });

  it("Авторизация", () => {
    cy.fixture("login").then((loginData) => {
      const token = loginData[0].accessToken;

      cy.visit(`${testUrl}/#/login`);
      cy.get("[data-testid=email_input]").type(email);
      cy.get("[data-testid=password_input]").type(password);
      cy.get("[data-testid=login_button]").click();

      cy.wait("@loginRequest").then(() => {
        cy.window().then((win) => {
          win.localStorage.setItem("accessToken", token);
          const storedToken = win.localStorage.getItem("accessToken");
          expect(storedToken).to.equal(token);
        });
      });
    });
  });

  it("Работа модальных окон", () => {
    cy.openFirstIngredient();
    cy.get('[data-testid="modal"]').should("exist").and("be.visible");
    cy.closeModal();
  
    cy.openFirstIngredient();
    cy.get('[data-testid="modal"]').should("exist").and("be.visible");
    cy.closeModalWithOverlay();
  
    cy.openFirstIngredient();
    cy.get('[data-testid="modal"]').should("exist").and("be.visible");
    cy.closeModalWithEsc();
  });
  

  it("Создание заказа", () => {
    cy.fixture("login").then((loginData) => {
      cy.window().then((win) => {
        win.localStorage.setItem("accessToken", loginData.accessToken);
      });

      cy.wait(1000);
      cy.get('[data-testid="basket-ingredient"]').should("be.visible");
      cy.get('[data-testid="ingredient-item"]').first().trigger("dragstart");
      cy.get('[data-testid="basket-ingredient"]').trigger("drop");
      cy.get('[data-testid="basket-ingredient"]').should("have.length", 1);
      cy.get('[data-testid="bun-item"]').first().trigger("dragstart");
      cy.get('[data-testid="basket-bun-top"]').trigger("drop");
      cy.get('[data-testid="basket-bun-top"]').should("have.length", 1);
      cy.get('[data-testid="basket-bun-bottom"]').should("have.length", 1);
      cy.get('[data-testid="create-order-button"]').click();
      cy.get('[data-testid="order-success-message"]', {
        timeout: 20000,
      }).should("be.visible");
    });
  });
});
