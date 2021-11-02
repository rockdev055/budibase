context("Create a Table", () => {
  before(() => {
    cy.visit("localhost:4001/_builder")
    cy.createApp("Table App", "Table App Description")
  })

  it("should create a new Table", () => {
    cy.createTable("dog")

    // Check if Table exists
    cy.get(".title span").should("have.text", "dog")
  })

  it("adds a new column to the table", () => {
    cy.addColumn("dog", "name", "Text")
    cy.contains("name").should("be.visible")
  })

  it("creates a record in the table", () => {
    cy.addRecord(["Rover"])
    cy.contains("Rover").should("be.visible")
  })

  it("updates a column on the table", () => {
    cy.contains("name").click()
    cy.get("[data-cy='edit-column-header']").click()
    cy.get(".actions input")
      .first()
      .type("updated")
    cy.get("select").select("Text")
    cy.contains("Save Column").click()
    cy.contains("nameupdated").should("have.text", "nameupdated")
  })

  it("edits a record", () => {
    cy.get("tbody .ri-more-line").click()
    cy.get("[data-cy=edit-row]").click()
    cy.get(".modal input").type("Updated")
    cy.contains("Save").click()
    cy.contains("RoverUpdated").should("have.text", "RoverUpdated")
  })

  it("deletes a record", () => {
    cy.get("tbody .ri-more-line").click()
    cy.get("[data-cy=delete-row]").click()
    cy.contains("Delete Row").click()
    cy.contains("RoverUpdated").should("not.exist")
  })

  it("deletes a column", () => {
    cy.contains("name").click()
    cy.get("[data-cy='delete-column-header']").click()
    cy.contains("Delete Column").click()
    cy.contains("nameupdated").should("not.exist")
  })

  it("deletes a table", () => {
    cy.contains("div", "dog")
      .get(".ri-more-line")
      .click()
    cy.get("[data-cy=delete-table]").click()
    cy.contains("Delete Table").click()
    cy.contains("dog").should("not.exist")
  })
})
