// cfml-parser.js
const { parseDocument } = require("htmlparser2");

function preprocessCFML(text) {
  // Wrap CFML closing tags in a placeholder tag
  // For example, replace </cfif> with <cfml_closing_tag name="cfif"></cfml_closing_tag>

  const closingTagRegex = /<\/(cf\w+)>/gi;
  const preprocessedText = text.replace(closingTagRegex, (match, tagName) => {
    return `<cfml_closing_tag name="${tagName}"></cfml_closing_tag>`;
  });

  return preprocessedText;
}

module.exports = {
  parse(text, parsers, options) {
    // Preprocess the text to wrap CFML closing tags
    const preprocessedText = preprocessCFML(text);

    // Parse the document using htmlparser2
    const ast = parseDocument(preprocessedText, {
      recognizeSelfClosing: true,
      lowerCaseTags: false,
      lowerCaseAttributeNames: false,
      xmlMode: false,
    });

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
