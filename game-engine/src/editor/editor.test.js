import test from 'node:test';
import assert from 'node:assert/strict';
import { Editor } from './Editor.js';
import { fileTree } from './fileTree.js';

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
