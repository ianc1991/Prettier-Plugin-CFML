// cfml-printer.js
module.exports = {
  print(path, options, print) {
    const text = path.getValue().text;

    const formattedText = safeFormatCFML(text);

    // If the formatted text is shorter, text might have been removed
    if (formattedText.length < text.length) {
      // Abort formatting and return original text
      return text;
    }

    return formattedText;
  },
};

function safeFormatCFML(text) {
  const lines = text.split("\n");
  const formattedLines = [];
  const indentSize = 2; // Adjust this value as needed

  const selfClosingTags = new Set([
    // HTML self-closing tags
    "area",
    "base",
    "br",
    "col",
    "command",
    "embed",
    "hr",
    "img",
    "input",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
    // CFML self-closing tags
    "cfset",
    "cfinclude",
    "cfparam",
  ]);

  const unindentTags = new Set(["cfelse", "cfelseif"]);

  let currentIndentLevel = 0;

  for (let line of lines) {
    let trimmedLine = line.trim();

    // Regular expressions for matching tags
    const tagMatch = /^\s*<\/?\s*([^\s>/]+)([^>]*)>/;
    const tagMatchResult = tagMatch.exec(trimmedLine);
    let tagName = "";
    if (tagMatchResult) {
      tagName = tagMatchResult[1].toLowerCase();
    }

    // Determine the tag type
    const isClosingTag = /^\s*<\/[^>]+>\s*$/.test(trimmedLine);
    const isSelfClosingTag =
      selfClosingTags.has(tagName) || /^\s*<[^>]+\/>\s*$/.test(trimmedLine);
    const isOpeningTag =
      /^\s*<[^/!][^>]*?>\s*$/.test(trimmedLine) && !isSelfClosingTag;
    const isSpecialTag = /^\s*<!|<!--|<\?/.test(trimmedLine);
    const isOpeningAndClosingTag = /^\s*<[^>]+>.*<\/[^>]+>\s*$/.test(
      trimmedLine
    );
    const isUnindentTag = unindentTags.has(tagName);

    // Adjust currentIndentLevel before applying indentation
    if (isClosingTag && !isOpeningAndClosingTag) {
      currentIndentLevel = Math.max(currentIndentLevel - 1, 0);
    } else if (isUnindentTag) {
      currentIndentLevel = Math.max(currentIndentLevel - 1, 0);
    }

    // Apply indentation to the line
    const indent = " ".repeat(currentIndentLevel * indentSize);
    formattedLines.push(indent + trimmedLine);

    // Adjust currentIndentLevel after applying indentation
    if (
      isOpeningTag &&
      !isSelfClosingTag &&
      !isSpecialTag &&
      !isOpeningAndClosingTag &&
      !isUnindentTag
    ) {
      currentIndentLevel++;
    }

    // If the unindent tag can have children, increase the indentation level
    if (isUnindentTag) {
      currentIndentLevel++;
    }
  }

  const formattedText = formattedLines.join("\n");

  // Ensure the formatted text is not shorter than the original
  if (formattedText.length < text.length) {
    return text;
  }

  return formattedText;
}
