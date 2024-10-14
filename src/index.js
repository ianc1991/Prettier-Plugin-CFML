// index.js
module.exports = {
  parsers: {
    cfml: require("./cfml-parser"),
  },
  printers: {
    htmlparser2: require("./cfml-printer"),
  },
  languages: [
    {
      name: "CFML",
      parsers: ["cfml"],
      extensions: [".cfm", ".cfml"],
      vscodeLanguageIds: ["cfml"],
    },
  ],
};
