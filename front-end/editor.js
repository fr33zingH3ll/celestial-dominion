import { Application } from 'pixi.js';
import { Editor } from 'game-engine/src/editor/Editor.js';
import { fileTree } from 'game-engine/src/editor/fileTree.js';
import { CELL_SIZE, PixiRenderer } from 'game-engine/src/renderers/PixiRenderer.js';
import { RenderQueue } from 'game-engine/src/runtime/RenderQueue.js';
import { Scene } from 'game-engine/src/scene/Scene.js';

const sources = import.meta.glob('../game-engine/src/**/*.js', {
    query: '?raw',
    import: 'default',
    eager: true,
});

const files = Object.fromEntries(Object.entries(sources).map(([path, text]) => [
    path.replace('../game-engine/src/', ''),
    text,
]));

const editor = new Editor(files);
const filesRoot = document.querySelector('#files');
const code = document.querySelector('#code');
const gutter = document.querySelector('#gutter');
const scriptName = document.querySelector('#script-name');
const viewport = document.querySelector('#viewport');

function paintGutter(text) {
    const count = Math.max(1, text.split('\n').length);
    gutter.textContent = Array.from({ length: count }, (_, index) => index + 1).join('\n');
}

function openFile(path) {
    const text = editor.select(path);
    scriptName.textContent = path;
    code.value = text;
    paintGutter(text);
    for (const button of filesRoot.querySelectorAll('.file')) {
        button.classList.toggle('selected', button.dataset.path === path);
    }
}

function renderTree(node, depth) {
    const fragment = document.createDocumentFragment();
    for (const child of node.children) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = child.name;
        button.style.paddingLeft = `${10 + depth * 14}px`;
        if (child.kind === 'folder') {
            button.className = 'folder';
            const children = renderTree(child, depth + 1);
            let open = true;
            children.hidden = false;
            button.addEventListener('click', () => {
                open = !open;
                children.hidden = !open;
            });
            fragment.append(button, children);
        } else {
            button.className = 'file';
            button.dataset.path = child.path;
            button.addEventListener('click', () => openFile(child.path));
            fragment.append(button);
        }
    }
    const holder = document.createElement('div');
    holder.append(fragment);
    return holder;
}

filesRoot.append(renderTree(fileTree(Object.keys(files)), 0));

code.addEventListener('input', () => {
    editor.edit(code.value);
    paintGutter(code.value);
});

code.addEventListener('scroll', () => {
    gutter.scrollTop = code.scrollTop;
});

const board = new Scene(8, 8);
const application = new Application({
    width: board.grid.width * CELL_SIZE,
    height: board.grid.height * CELL_SIZE,
    backgroundColor: 0x1a1d24,
    antialias: true,
});
viewport.append(application.view);
editor.showOnce(new PixiRenderer({
    application,
    queue: new RenderQueue(),
}), board);
application.render();
application.ticker.stop();

const first = Object.keys(files).sort().find((path) => path.endsWith('scene/Scene.js')) ?? Object.keys(files).sort()[0];
if (first) {
    openFile(first);
}
