/**
 * Arborescence triée : les dossiers avant les fichiers.
 */
export function fileTree(paths) {
    const root = { name: '', path: '', kind: 'folder', children: [] };
    const folders = new Map([['', root]]);
    for (const filePath of paths) {
        if (typeof filePath !== 'string' || filePath.length === 0) {
            throw new Error('chemin requis');
        }
        const parts = filePath.split('/');
        let parentPath = '';
        for (let index = 0; index < parts.length - 1; index += 1) {
            const next = parentPath ? `${parentPath}/${parts[index]}` : parts[index];
            if (!folders.has(next)) {
                const folder = { name: parts[index], path: next, kind: 'folder', children: [] };
                folders.set(next, folder);
                folders.get(parentPath).children.push(folder);
            }
            parentPath = next;
        }
        folders.get(parentPath).children.push({
            name: parts[parts.length - 1],
            path: filePath,
            kind: 'file',
        });
    }
    for (const folder of folders.values()) {
        folder.children.sort((left, right) => {
            if (left.kind !== right.kind) {
                return left.kind === 'folder' ? -1 : 1;
            }
            return left.name.localeCompare(right.name);
        });
    }
    return root;
}
