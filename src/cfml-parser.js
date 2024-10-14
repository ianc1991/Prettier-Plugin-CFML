// cfml-parser.js
const { parseDocument } = require("htmlparser2");

module.exports = {
  parse(text, parsers, options) {
    // Parse the document using htmlparser2
    const ast = parseDocument(text, {
      recognizeSelfClosing: true,
      lowerCaseTags: false,
      lowerCaseAttributeNames: false,
      xmlMode: false, // Set to false to handle both HTML and CFML-style tags
    });

    // At this point, the AST includes both HTML and CFML tags

    // If needed, you can traverse and modify the AST here
    // For example, you can identify CFML tags and process them differently

    return ast;
  },
  astFormat: "htmlparser2",
  locStart(node) {
    return node.startIndex || 0;
  },
  locEnd(node) {
    return node.endIndex || 0;
  },
};
