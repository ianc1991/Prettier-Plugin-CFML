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
      parse: (text) => ({ text }),
      astFormat: "cfml",
    },
  },
  printers: {
    cfml: require("./cfml-printer"),
  },
};
