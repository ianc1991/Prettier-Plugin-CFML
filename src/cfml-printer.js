// cfml-printer.js
const { doc } = require("prettier");
const { builders } = doc;
const { concat, hardline } = builders;

module.exports = {
  print(path, options, print) {
    const node = path.getValue();

    switch (node.type) {
      case "root":
      case "document": // Sometimes the root node may be of type 'document'
        // Process all children of the root node
        return concat(path.map(print, "children"));

      case "text":
        return node.data;

      case "tag":
        if (node.name.startsWith("cf")) {
          // Custom formatting for CFML tags
          const isSelfClosing = isSelfClosingTag(node);
          const tagOpen = `<${node.name}${formatAttributes(node.attribs)}${isSelfClosing ? " /" : ""}>`;

          if (isSelfClosing) {
            return tagOpen;
          } else {
            const children = node.children ? path.map(print, "children") : [];
            const tagClose = `</${node.name}>`;
            return concat([tagOpen, ...children, tagClose]);
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
  // Define self-closing tags here
  const selfClosingTags = new Set([
    "cfset",
    "cfinclude",
    "cfparam",
    // Add other CFML self-closing tags as needed
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

  return (
    selfClosingTags.has(node.name.toLowerCase()) ||
    (node.children && node.children.length === 0)
  );
}
