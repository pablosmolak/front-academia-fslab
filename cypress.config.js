const { defineConfig } = require("cypress");
require('dotenv').config()  // Carrega o .env

module.exports = defineConfig({
  e2e: {
    watchForFileChanges: false,
    baseUrl: process.env.NEXT_PUBLIC_FRONT_URL,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
