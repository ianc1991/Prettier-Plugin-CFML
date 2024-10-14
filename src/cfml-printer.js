// cfml-printer.js
const { doc } = require("prettier");
const { builders } = doc;
const { concat } = builders;

// Define self-closing CFML tags
const selfClosingCfmlTags = new Set([
  "cfset",
  "cfinclude",
  "cfparam",
  // Add other CFML self-closing tags as needed
]);

// Define standalone CFML tags that do not require closing tags but can have children
const standaloneCfmlTags = new Set([
  "cfelse",
  "cfelseif",
  // Add other standalone CFML tags if necessary
]);

module.exports = {
  print(path, options, print) {
    const node = path.getValue();

    switch (node.type) {
      case "root":
      case "document":
        // Process all children of the root node
        return concat(path.map(print, "children"));

      case "text":
        return node.data;

      case "tag":
        if (node.name === "cfml_closing_tag") {
          // Output the closing tag
          const tagName = node.attribs.name;
          return `</${tagName}>`;
        } else if (node.name.startsWith("cf")) {
          const isSelfClosing = isSelfClosingTag(node);
          const isStandalone = isStandaloneTag(node);
          const tagOpen = `<${node.name}${formatAttributes(node.attribs)}${isSelfClosing ? " /" : ""}>`;

          if (isSelfClosing) {
            // Self-closing tag
            return tagOpen;
          } else {
            // CFML tags that may have children
            const children = node.children ? path.map(print, "children") : [];
            return concat([tagOpen, ...children]);
          }
        } else {
          // Regular HTML tag formatting
          const isSelfClosing = isSelfClosingTag(node);
          const tagOpen = `<${node.name}${formatAttributes(node.attribs)}${isSelfClosing ? " /" : ""}>`;

          if (isSelfClosing) {
            return tagOpen;
          } else {
            const children = node.children ? path.map(print, "children") : [];
            const tagClose = `</${node.name}>`;
            return concat([tagOpen, ...children, tagClose]);
          }
        }

      case "script":
      case "style":
        // Handle <script> and <style> tags
        const tagOpen = `<${node.name}${formatAttributes(node.attribs)}>`;
        const tagClose = `</${node.name}>`;
        const content = node.children ? path.map(print, "children") : [];
        return concat([tagOpen, ...content, tagClose]);

      case "comment":
        // Handle comments
        return `<!--${node.data}-->`;

      case "directive":
        // Handle directives like <!DOCTYPE html>
        return `<!${node.data}>`;

      case "cdata":
        // Handle CDATA sections
        return `<![CDATA[${node.data}]]>`;

      default:
        // Log unhandled node types for debugging
        console.warn(`Unhandled node type: ${node.type}`, node);
        return node.data || "";
    }
  },
};

function formatAttributes(attribs) {
  return Object.keys(attribs)
    .map((key) => {
      const value = attribs[key];
      return value ? ` ${key}="${value}"` : ` ${key}`;
    })
    .join("");
}

function isSelfClosingTag(node) {
  const selfClosingCfmlTags = new Set([
    "cfset",
    "cfinclude",
    "cfparam",
    // Add other CFML self-closing tags as needed
  ]);

  const selfClosingHtmlTags = new Set([
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
  ]);

  const tagName = node.name.toLowerCase();
  return selfClosingCfmlTags.has(tagName) || selfClosingHtmlTags.has(tagName);
}

function isStandaloneTag(node) {
  const tagName = node.name.toLowerCase();
  return standaloneCfmlTags.has(tagName);
}
