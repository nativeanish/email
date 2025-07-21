import { $generateNodesFromDOM } from "@lexical/html";
import { LexicalEditor } from "lexical";

function convertHtmlToLexicalNodes(html: string, editor: LexicalEditor) {
  const parser = new DOMParser();
  const dom = parser.parseFromString(html, "text/html");
  const nodes = $generateNodesFromDOM(editor, dom);
  return nodes;
}
export default convertHtmlToLexicalNodes;
