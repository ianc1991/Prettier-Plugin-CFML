// index.js
module.exports = {
  languages: [
    {
      name: "ColdFusion",
      parsers: ["cfml"],
      extensions: [".cfm", ".cfml"],
    },
  ],
  parsers: {
    cfml: {
      parse: (text) => {
        // Return an AST with the original text
        return { type: "cfml-root", content: text };
      },
      astFormat: "cfml",
      locStart: () => 0,
      locEnd: () => 0,
    },
  },
  printers: {
    cfml: require("./cfml-printer"),
  },
};
