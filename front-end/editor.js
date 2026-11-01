import * as THREE from 'three';
import { BoardDocument } from 'game-engine/src/editor/Board.js';
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
const board = new BoardDocument();
const filesRoot = document.querySelector('#files');
const sceneRoot = document.querySelector('#scene');
const inspector = document.querySelector('#inspector');
const notice = document.querySelector('#notice');
const code = document.querySelector('#code');
const gutter = document.querySelector('#gutter');
const colored = document.querySelector('#highlight');
const scriptName = document.querySelector('#script-name');
const viewport = document.querySelector('#viewport');
const status = document.querySelector('#status');
const play = document.querySelector('#play');
const stop = document.querySelector('#stop');
const undo = document.querySelector('#undo');
const closedNodes = new Set();
let errorText = '';
let started = 0;

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

function run(action) {
    try {
        action();
        errorText = '';
        refresh();
    } catch (error) {
        errorText = error.message;
        notice.textContent = errorText;
    }
}

function paintScene() {
    sceneRoot.replaceChildren();
    const tree = board.tree();
    sceneRoot.append(sceneButton(
        `Plateau ${tree.width}×${tree.height}`,
        0,
        board.selection.type === 'plateau',
        () => board.select({ type: 'plateau' }),
    ));
    sceneRoot.append(paintNodes(tree.children, 1));
}

function paintNodes(nodes, depth) {
    const holder = document.createElement('div');
    for (const node of nodes) {
        if (node.type === 'groupe' || node.type === 'zone') {
            const key = node.type === 'zone' ? `zone:${node.name}` : node.name;
            const label = node.type === 'zone' ? `${node.name} (${node.count})` : node.name;
            const selected = node.type === 'zone' && board.selection.type === 'zone' && board.selection.name === node.name;
            const button = sceneButton(label, depth, selected, (event) => {
                if (event.target.classList.contains('arrow')) {
                    if (closedNodes.has(key)) {
                        closedNodes.delete(key);
                    } else {
                        closedNodes.add(key);
                    }
                    refresh();
                    return;
                }
                run(() => {
                    if (node.type === 'zone') {
                        board.select({ type: 'zone', name: node.name });
                    } else {
                        board.select({ type: 'plateau' });
                    }
                });
            }, true, !closedNodes.has(key));
            const children = paintNodes(node.children, depth + 1);
            children.hidden = closedNodes.has(key);
            holder.append(button, children);
        } else {
            const selected = board.selection.type === 'piece' && board.selection.id === node.id;
            holder.append(sceneButton(node.label, depth, selected, () => {
                board.select({ type: 'piece', id: node.id });
            }));
        }
    }
    return holder;
}

function sceneButton(label, depth, selected, onSelect, collapsible = false, open = true) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = selected ? 'tree-item selected' : 'tree-item';
    button.style.paddingLeft = `${8 + depth * 14}px`;
    const arrow = document.createElement('span');
    arrow.className = 'arrow';
    arrow.textContent = collapsible ? (open ? '▾' : '▸') : '';
    button.append(arrow, document.createTextNode(label));
    button.addEventListener('click', (event) => {
        if (onSelect.length > 0) {
            onSelect(event);
            return;
        }
        run(onSelect);
    });
    return button;
}

function paintInspector() {
    inspector.replaceChildren();
    const info = board.inspect();
    if (board.running) {
        inspector.append(line(readout(info)));
        inspector.append(line('Les modifications reprennent à l’arrêt.'));
    } else if (info.type === 'plateau') {
        inspector.append(line(`Pièces : ${info.count}`));
        const width = numberField('Largeur', info.width);
        const height = numberField('Hauteur', info.height);
        inspector.append(width.label, height.label, action('Appliquer la grille', () => {
            board.resize(Number(width.input.value), Number(height.input.value));
        }));
    } else if (info.type === 'zone') {
        inspector.append(line(`${info.name} · ${info.count} ${info.count > 1 ? 'pièces' : 'pièce'}`));
        inspector.append(line(info.top ? `Dessus : ${info.top}` : 'Zone vide'));
        if (!info.base) {
            inspector.append(action('Supprimer la zone', () => board.removeZone(info.name)));
        }
    } else if (info.type === 'case') {
        inspector.append(line(`Case ${info.x},${info.y}`));
        inspector.append(line(info.occupant ? `Occupant : ${info.occupant}` : 'Case libre'));
    } else {
        inspector.append(line(`${info.kind} · ${info.id}`));
        if (info.kind === 'carte') {
            const face = textField('Face', info.face);
            inspector.append(face.label, action('Appliquer la face', () => board.setFace(face.input.value)));
        }
        if (info.kind === 'dé') {
            const faces = numberField('Faces', info.faces);
            inspector.append(faces.label, action('Appliquer les faces', () => board.setFaces(Number(faces.input.value))));
        }
        const x = numberField('Case X', info.cell ? info.cell.x : 0);
        const y = numberField('Case Y', info.cell ? info.cell.y : 0);
        inspector.append(x.label, y.label, action('Vers la case', () => {
            board.moveTo(Number(x.input.value), Number(y.input.value));
        }));
        const zone = document.createElement('select');
        const stay = document.createElement('option');
        stay.value = '';
        stay.textContent = 'sur le plateau';
        stay.selected = !info.zone;
        zone.append(stay);
        for (const name of board.scene.zones.keys()) {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            option.selected = name === info.zone;
            zone.append(option);
        }
        const zoneLabel = document.createElement('label');
        zoneLabel.textContent = 'Zone';
        zoneLabel.append(zone);
        inspector.append(zoneLabel, action('Vers la zone', () => {
            if (!zone.value) {
                throw new Error('zone requise');
            }
            board.moveToZone(zone.value);
        }));
        const prefabName = textField('Prefab', info.kind);
        inspector.append(
            prefabName.label,
            action('Enregistrer le prefab', () => board.savePrefab(prefabName.input.value)),
            action('Dupliquer', () => board.duplicate()),
            action('Supprimer', () => board.remove()),
        );
    }
    if (!board.running && board.prefabs.length > 0) {
        inspector.append(line('Prefabs'));
        for (const prefab of board.prefabs) {
            inspector.append(action(`Poser ${prefab.name}`, () => board.stamp(prefab.name)));
        }
    }
    notice.textContent = errorText;
}

function readout(info) {
    if (info.type === 'piece') {
        const place = info.cell ? `case ${info.cell.x},${info.cell.y}` : `zone ${info.zone}`;
        const detail = info.kind === 'carte' ? info.face : info.kind === 'dé' ? `${info.faces} faces` : info.id;
        return `${info.kind} · ${detail} · ${place}`;
    }
    if (info.type === 'zone') {
        return `${info.name} · ${info.count} ${info.count > 1 ? 'pièces' : 'pièce'}`;
    }
    if (info.type === 'case') {
        return `Case ${info.x},${info.y}`;
    }
    return `Plateau ${info.width}×${info.height}`;
}

function line(value) {
    const node = document.createElement('p');
    node.textContent = value;
    return node;
}

function numberField(label, value) {
    return field(label, 'number', value);
}

function textField(label, value) {
    return field(label, 'text', value);
}

function field(label, type, value) {
    const input = document.createElement('input');
    input.type = type;
    input.value = value ?? '';
    const wrap = document.createElement('label');
    wrap.append(document.createTextNode(label), input);
    return { label: wrap, input };
}

function action(label, fn) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.addEventListener('click', () => run(fn));
    return button;
}

function paintStatus() {
    const editing = !board.running;
    for (const id of ['add-pawn', 'add-card', 'add-die', 'add-zone']) {
        document.querySelector(`#${id}`).disabled = !editing;
    }
    document.querySelector('#card-face').disabled = !editing;
    document.querySelector('#die-faces').disabled = !editing;
    document.querySelector('#zone-name').disabled = !editing;
    document.querySelector('#shuffle').disabled = editing;
    document.querySelector('#draw').disabled = editing;
    document.querySelector('#roll').disabled = editing;
    undo.disabled = editing === false || board.history.length === 0;
    if (!board.running) {
        status.textContent = 'Arrêté';
        status.classList.remove('running');
        play.disabled = false;
        stop.disabled = true;
        return;
    }
    status.classList.add('running');
    play.disabled = true;
    stop.disabled = false;
    const seconds = ((performance.now() - started) / 1000).toFixed(1);
    const face = board.lastRoll == null ? '' : ` · dé ${board.lastRoll}`;
    status.textContent = `En lecture ${seconds} s${face}`;
}

const world = new THREE.Scene();
world.background = new THREE.Color(0x1a1d24);
const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 200);
const worldGroup = new THREE.Group();
world.add(worldGroup);
world.add(new THREE.AmbientLight(0xffffff, 0.8));
const sun = new THREE.DirectionalLight(0xffffff, 0.85);
sun.position.set(4, 10, 6);
world.add(sun);
const view = new THREE.WebGLRenderer({ antialias: true });
view.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
viewport.append(view.domElement);
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let yaw = 0.7;
let pitch = 0.85;
let distance = 11;

function placeCamera() {
    const horizontal = Math.cos(pitch);
    camera.position.set(
        Math.sin(yaw) * horizontal * distance,
        Math.sin(pitch) * distance,
        Math.cos(yaw) * horizontal * distance,
    );
    camera.lookAt(0, 0, 0);
}

function draw() {
    const width = Math.max(1, viewport.clientWidth);
    const height = Math.max(1, viewport.clientHeight);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    view.setSize(width, height, false);
    placeCamera();
    view.render(world, camera);
}

function clearGroup(group) {
    while (group.children.length > 0) {
        const child = group.children[0];
        group.remove(child);
        child.traverse((node) => {
            node.geometry?.dispose();
            const materials = node.material ? [].concat(node.material) : [];
            for (const material of materials) {
                material.map?.dispose();
                material.dispose();
            }
        });
    }
}

function sprite(text) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    context.fillStyle = '#d5d8df';
    context.font = '28px sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, 128, 32);
    const material = new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true });
    const node = new THREE.Sprite(material);
    node.scale.set(1.8, 0.45, 1);
    node.raycast = () => {};
    return node;
}

function paintWorld() {
    clearGroup(worldGroup);
    const grid = board.scene.grid;
    const positions = [];
    const edge = (x1, z1, x2, z2) => positions.push(x1, 0.01, z1, x2, 0.01, z2);
    for (let x = 0; x <= grid.width; x += 1) {
        edge(x - grid.width / 2, -grid.height / 2, x - grid.width / 2, grid.height / 2);
    }
    for (let z = 0; z <= grid.height; z += 1) {
        edge(-grid.width / 2, z - grid.height / 2, grid.width / 2, z - grid.height / 2);
    }
    const lines = new THREE.BufferGeometry();
    lines.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    worldGroup.add(new THREE.LineSegments(lines, new THREE.LineBasicMaterial({ color: 0x46556c })));
    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(grid.width, grid.height),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
    );
    plane.rotation.x = -Math.PI / 2;
    plane.userData = { type: 'board' };
    worldGroup.add(plane);
    for (const piece of board.scene.pieces.values()) {
        if (!piece.cell) {
            continue;
        }
        addPiece(piece, piece.cell.x - (grid.width - 1) / 2, 0, piece.cell.y - (grid.height - 1) / 2);
    }
    const names = [...board.scene.zones.keys()];
    names.forEach((name, index) => {
        const zone = board.scene.zones.get(name);
        const x = grid.width / 2 + 1.7;
        const z = (index - (names.length - 1) / 2) * 1.7;
        const selected = board.selection.type === 'zone' && board.selection.name === name;
        const pad = new THREE.Mesh(
            new THREE.BoxGeometry(1, 0.03, 1.35),
            new THREE.MeshStandardMaterial({ color: selected ? 0x4d6484 : 0x2a3342 }),
        );
        pad.position.set(x, 0, z);
        pad.userData = { type: 'zone', name };
        worldGroup.add(pad);
        const title = sprite(name);
        title.position.set(x, 0.95, z);
        worldGroup.add(title);
        zone.pieces.forEach((piece, pieceIndex) => {
            addPiece(piece, x, 0.08 + pieceIndex * 0.07, z);
        });
    });
}

function addPiece(piece, x, y, z) {
    const spec = piece.prefab.spec;
    const selected = board.selection.type === 'piece' && board.selection.id === piece.id;
    let mesh;
    if (spec.kind === 'carte') {
        mesh = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.05, 0.9), material(0x3d6ea8, selected));
        mesh.position.set(x, y + 0.04, z);
    } else if (spec.kind === 'dé') {
        mesh = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.48, 0.48), material(0xe6e1d6, selected));
        mesh.position.set(x, y + 0.3, z);
    } else {
        mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.38, 20), material(0xd7b15e, selected));
        mesh.position.set(x, y + 0.22, z);
    }
    mesh.userData = { type: 'piece', id: piece.id };
    worldGroup.add(mesh);
    const caption = spec.kind === 'carte' ? spec.face : spec.kind === 'dé' ? String(spec.faces) : '';
    if (caption) {
        const label = sprite(caption);
        label.position.set(x, mesh.position.y + 0.5, z);
        worldGroup.add(label);
    }
}

function material(color, selected) {
    return new THREE.MeshStandardMaterial({
        color,
        emissive: selected ? 0x8a5a12 : 0x000000,
        roughness: 0.55,
    });
}

function refresh() {
    paintScene();
    paintInspector();
    paintStatus();
    paintWorld();
    draw();
}

function pick(event) {
    const rect = view.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(worldGroup.children, true);
    const hit = hits.find((item) => item.object.userData?.type);
    if (!hit) {
        return;
    }
    const data = hit.object.userData;
    if (data.type === 'piece') {
        board.select({ type: 'piece', id: data.id });
    } else if (data.type === 'zone') {
        board.select({ type: 'zone', name: data.name });
    } else {
        const grid = board.scene.grid;
        const x = Math.floor(hit.point.x + grid.width / 2);
        const y = Math.floor(hit.point.z + grid.height / 2);
        if (!grid.contains({ x, y })) {
            return;
        }
        const piece = board.scene.at({ x, y });
        board.select(piece ? { type: 'piece', id: piece.id } : { type: 'case', x, y });
    }
    errorText = '';
    refresh();
}

let drag = null;
view.domElement.addEventListener('pointerdown', (event) => {
    view.domElement.setPointerCapture(event.pointerId);
    drag = { x: event.clientX, y: event.clientY, yaw, pitch, moved: false };
});
view.domElement.addEventListener('pointermove', (event) => {
    if (!drag) {
        return;
    }
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (Math.hypot(dx, dy) < 4) {
        return;
    }
    drag.moved = true;
    yaw = drag.yaw - dx * 0.01;
    pitch = Math.min(1.2, Math.max(0.25, drag.pitch + dy * 0.008));
    draw();
});
view.domElement.addEventListener('pointerup', (event) => {
    if (!drag) {
        return;
    }
    const moved = drag.moved;
    drag = null;
    if (!moved) {
        pick(event);
    }
});
viewport.addEventListener('wheel', (event) => {
    event.preventDefault();
    distance = Math.min(48, Math.max(4, distance + event.deltaY * 0.01));
    draw();
}, { passive: false });

document.querySelector('#add-pawn').addEventListener('click', () => run(() => board.addPawn()));
document.querySelector('#add-card').addEventListener('click', () => run(() => {
    board.addCard(document.querySelector('#card-face').value);
}));
document.querySelector('#add-die').addEventListener('click', () => run(() => {
    board.addDie(Number(document.querySelector('#die-faces').value));
}));
document.querySelector('#add-zone').addEventListener('click', () => run(() => {
    board.addZone(document.querySelector('#zone-name').value);
}));
document.querySelector('#shuffle').addEventListener('click', () => run(() => {
    const info = board.inspect();
    const name = info.type === 'zone' ? info.name : info.zone || 'pioche';
    board.shuffleZone(name);
}));
document.querySelector('#draw').addEventListener('click', () => run(() => {
    const info = board.inspect();
    const from = info.type === 'zone' && info.name !== 'main' ? info.name : 'pioche';
    board.drawTo(from, 'main');
}));
document.querySelector('#roll').addEventListener('click', () => run(() => board.rollSelected()));
undo.addEventListener('click', () => run(() => board.undo()));
inspector.addEventListener('submit', (event) => event.preventDefault());

let frame = 0;
function tick() {
    if (!board.running) {
        return;
    }
    frame = requestAnimationFrame(tick);
    paintStatus();
    draw();
}

play.addEventListener('click', () => run(() => {
    board.play();
    started = performance.now();
    tick();
}));
stop.addEventListener('click', () => {
    cancelAnimationFrame(frame);
    run(() => board.stop());
});

window.addEventListener('resize', draw);
refresh();

const first = Object.keys(files).sort().find((path) => path.endsWith('scene/Scene.js')) ?? Object.keys(files).sort()[0];
if (first) {
    openFile(first);
}
