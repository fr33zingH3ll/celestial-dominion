import * as THREE from 'three';
import { Editor } from 'game-engine/src/editor/Editor.js';
import { fileTree } from 'game-engine/src/editor/fileTree.js';
import { highlight } from 'game-engine/src/editor/highlight.js';

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
const colored = document.querySelector('#highlight');
const scriptName = document.querySelector('#script-name');
const viewport = document.querySelector('#viewport');
const status = document.querySelector('#status');
const play = document.querySelector('#play');
const stop = document.querySelector('#stop');

function paintGutter(text) {
    const count = Math.max(1, text.split('\n').length);
    gutter.textContent = Array.from({ length: count }, (_, index) => index + 1).join('\n');
}

function paintCode(text) {
    paintGutter(text);
    colored.innerHTML = `${highlight(text)}\n`;
}

function openFile(path) {
    const text = editor.select(path);
    scriptName.textContent = path;
    code.value = text;
    paintCode(text);
    for (const button of filesRoot.querySelectorAll('.file')) {
        button.classList.toggle('selected', button.dataset.path === path);
    }
}

function renderTree(node, depth) {
    const fragment = document.createDocumentFragment();
    for (const child of node.children) {
        const button = document.createElement('button');
        button.type = 'button';
        button.style.paddingLeft = `${10 + depth * 14}px`;
        if (child.kind === 'folder') {
            button.className = 'folder';
            const arrow = document.createElement('span');
            arrow.className = 'arrow';
            arrow.textContent = '▾';
            button.append(arrow, document.createTextNode(child.name));
            const children = renderTree(child, depth + 1);
            let open = true;
            button.addEventListener('click', () => {
                open = !open;
                children.hidden = !open;
                arrow.textContent = open ? '▾' : '▸';
            });
            fragment.append(button, children);
        } else {
            button.className = 'file';
            button.dataset.path = child.path;
            const spacer = document.createElement('span');
            spacer.className = 'arrow';
            button.append(spacer, document.createTextNode(child.name));
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
    paintCode(code.value);
});

code.addEventListener('scroll', () => {
    gutter.scrollTop = code.scrollTop;
    colored.scrollTop = code.scrollTop;
    colored.scrollLeft = code.scrollLeft;
});

const world = new THREE.Scene();
world.background = new THREE.Color(0x1a1d24);
const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 200);
camera.position.set(8, 6, 10);
camera.lookAt(0, 0, 0);
world.add(new THREE.GridHelper(10, 10, 0x8aa0b8, 0x3d4c63));
world.add(new THREE.AxesHelper(1.4));
world.add(new THREE.AmbientLight(0xffffff, 0.75));
const sun = new THREE.DirectionalLight(0xffffff, 0.9);
sun.position.set(4, 8, 6);
world.add(sun);

const view = new THREE.WebGLRenderer({ antialias: true });
view.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
viewport.append(view.domElement);

function draw() {
    const width = Math.max(1, viewport.clientWidth);
    const height = Math.max(1, viewport.clientHeight);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    view.setSize(width, height, false);
    view.render(world, camera);
}

draw();

let frame = 0;
let started = 0;
function tick() {
    if (!editor.running) {
        return;
    }
    frame = requestAnimationFrame(tick);
    const seconds = ((performance.now() - started) / 1000).toFixed(1);
    status.textContent = `En lecture ${seconds} s`;
    draw();
}

play.addEventListener('click', () => {
    editor.play();
    started = performance.now();
    status.classList.add('running');
    play.disabled = true;
    stop.disabled = false;
    tick();
});

stop.addEventListener('click', () => {
    editor.stop();
    cancelAnimationFrame(frame);
    status.textContent = 'Arrêté';
    status.classList.remove('running');
    play.disabled = false;
    stop.disabled = true;
    draw();
});

const first = Object.keys(files).sort().find((path) => path.endsWith('scene/Scene.js')) ?? Object.keys(files).sort()[0];
if (first) {
    openFile(first);
}
