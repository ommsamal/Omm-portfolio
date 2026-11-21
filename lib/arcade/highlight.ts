// A small syntax highlighter for the arcade's code snippets. It splits a line
// into tokens; the UI renders each token as a <span>, so no HTML is injected.
export type Lang = "python" | "javascript" | "java" | "cpp";
export type TokenKind = "keyword" | "string" | "number" | "comment" | "function" | "plain";
export type Token = { text: string; kind: TokenKind };

const KEYWORDS: Record<Lang, string[]> = {
  python: ["def", "return", "if", "elif", "else", "for", "while", "in", "not", "and", "or", "is", "None", "True", "False", "import", "from", "class", "lambda", "print", "len", "range", "pass", "break", "continue", "global", "self", "try", "except"],
  javascript: ["const", "let", "var", "function", "return", "if", "else", "for", "while", "of", "in", "new", "typeof", "null", "undefined", "true", "false", "class", "this", "console", "async", "await", "break", "continue", "NaN"],
  java: ["public", "private", "static", "void", "int", "double", "boolean", "char", "String", "class", "return", "if", "else", "for", "while", "new", "true", "false", "null", "System", "final", "long", "break", "continue"],
  cpp: ["int", "double", "char", "bool", "void", "return", "if", "else", "for", "while", "const", "auto", "std", "cout", "endl", "include", "using", "namespace", "true", "false", "nullptr", "string", "vector", "main", "break", "continue", "unsigned", "long"],
};

export const LANG_LABEL: Record<Lang, string> = { python: "Python", javascript: "JavaScript", java: "Java", cpp: "C++" };

const COMMON = String.raw`"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d+(?:\.\d+)?\b|[A-Za-z_]\w*|\s+|.`;
const PATTERNS: Record<Lang, RegExp> = {
  python: new RegExp(String.raw`#.*$|` + COMMON, "g"),
  javascript: new RegExp(String.raw`\/\/.*$|` + "`(?:\\\\.|[^`\\\\])*`|" + COMMON, "g"),
  java: new RegExp(String.raw`\/\/.*$|` + COMMON, "g"),
  cpp: new RegExp(String.raw`\/\/.*$|#.*$|` + COMMON, "g"),
};

export function tokenize(line: string, lang: Lang): Token[] {
  const words = new Set(KEYWORDS[lang]);
  const tokens: Token[] = [];
  for (const m of line.matchAll(PATTERNS[lang])) {
    const text = m[0];
    let kind: TokenKind = "plain";
    if (text.startsWith("//") || (text.startsWith("#") && lang === "python")) kind = "comment";
    else if (text.startsWith("#") && lang === "cpp") kind = "keyword"; // #include
    else if (/^["'`]/.test(text)) kind = "string";
    else if (/^\d/.test(text)) kind = "number";
    else if (words.has(text)) kind = "keyword";
    else if (/^[A-Za-z_]\w*$/.test(text) && line.slice((m.index ?? 0) + text.length).trimStart().startsWith("(")) kind = "function";
    const prev = tokens[tokens.length - 1];
    if (prev && prev.kind === kind && kind === "plain") prev.text += text;
    else tokens.push({ text, kind });
  }
  return tokens;
}
