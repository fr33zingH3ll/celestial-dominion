import test from 'node:test';
import assert from 'node:assert/strict';
import { Editor } from './Editor.js';
import { fileTree } from './fileTree.js';
import { highlight } from './highlight.js';

test('l’arborescence place les dossiers avant les fichiers', () => {
    const tree = fileTree([
        'scene/Scene.js',
        'main/Loop.js',
        'scene/Cell.js',
    ]);
    assert.deepEqual(tree.children.map((child) => child.name), ['main', 'scene']);
    assert.deepEqual(tree.children[1].children.map((child) => child.name), ['Cell.js', 'Scene.js']);
    assert.throws(() => fileTree(['']), /chemin requis/);
});

test('l’éditeur affiche une fois et reste arrêté', () => {
    const editor = new Editor({ 'scene/Scene.js': 'export class Scene {}' });
    assert.equal(editor.running, false);
    const shown = [];
    editor.showOnce({ show: (scene) => shown.push(scene) }, { name: 'plateau' });
    assert.deepEqual(shown, [{ name: 'plateau' }]);
    assert.equal(editor.running, false);
    assert.equal(editor.select('scene/Scene.js'), 'export class Scene {}');
    editor.edit('modifié');
    assert.equal(editor.buffers.get('scene/Scene.js'), 'modifié');
    assert.equal(editor.running, false);
    assert.throws(() => editor.select('absent.js'), /fichier absent/);
});

test('une scène vide peut être lancée puis arrêtée', () => {
    const editor = new Editor({});
    editor.play();
    assert.equal(editor.running, true);
    assert.throws(() => editor.play(), /boucle déjà lancée/);
    assert.throws(() => editor.showOnce({ show() {} }, {}), /la partie ne doit pas tourner/);
    editor.stop();
    assert.equal(editor.running, false);
});

test('le surlignage colore sans changer le texte', () => {
    const source = 'export class Cell {\n  // case\n  const n = 8;\n  const name = "pion";\n}';
    const html = highlight(source);
    assert.match(html, /<span class="hl-keyword">export<\/span>/);
    assert.match(html, /<span class="hl-keyword">class<\/span>/);
    assert.match(html, /<span class="hl-comment">\/\/ case<\/span>/);
    assert.match(html, /<span class="hl-string">"pion"<\/span>/);
    assert.match(html, /<span class="hl-number">8<\/span>/);
    const plain = html
        .replaceAll(/<[^>]+>/g, '')
        .replaceAll('&lt;', '<')
        .replaceAll('&gt;', '>')
        .replaceAll('&amp;', '&');
    assert.equal(plain, source);
});
