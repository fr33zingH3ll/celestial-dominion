const KEYWORDS = new Set([
    'await', 'break', 'case', 'catch', 'class', 'const', 'continue', 'default',
    'do', 'else', 'export', 'extends', 'false', 'finally', 'for', 'from',
    'function', 'if', 'import', 'in', 'instanceof', 'let', 'new', 'null',
    'return', 'static', 'super', 'switch', 'this', 'throw', 'true', 'try',
    'typeof', 'var', 'void', 'while', 'yield',
]);

function escape(text) {
    return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function paint(token) {
    const text = escape(token);
    if (token.startsWith('/*') || token.startsWith('//')) {
        return `<span class="hl-comment">${text}</span>`;
    }
    if (token.startsWith('"') || token.startsWith("'") || token.startsWith('`')) {
        return `<span class="hl-string">${text}</span>`;
    }
    if (KEYWORDS.has(token)) {
        return `<span class="hl-keyword">${text}</span>`;
    }
    if (/^\d/.test(token)) {
        return `<span class="hl-number">${text}</span>`;
    }
    return text;
}

/**
 * Colore un source JavaScript. Le texte, balises retirées, reste identique.
 */
export function highlight(source) {
    const pattern = /\/\*[\s\S]*?\*\/|\/\/[^\n]*|`(?:\\[\s\S]|[^`])*`|'(?:\\.|[^'\n])*'|"(?:\\.|[^"\n])*"|[A-Za-z_$][\w$]*|\d+(?:\.\d+)?/g;
    let html = '';
    let last = 0;
    for (const match of source.matchAll(pattern)) {
        html += escape(source.slice(last, match.index));
        html += paint(match[0]);
        last = match.index + match[0].length;
    }
    html += escape(source.slice(last));
    return html;
}
