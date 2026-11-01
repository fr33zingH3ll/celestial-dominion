/**
 * Commandes d'affichage. Les règles ne les produisent pas :
 * Pixi les lira plus tard, et ce module ne l'importe pas.
 */
export class RenderQueue {
    constructor() {
        this.commands = [];
    }

    push(command) {
        if (!command || typeof command.type !== 'string' || command.type.length === 0) {
            throw new Error('commande d\'affichage requise');
        }
        this.commands.push(command);
    }

    drain() {
        const commands = this.commands;
        this.commands = [];
        return commands;
    }
}
