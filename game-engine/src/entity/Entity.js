class Entity {
    constructor(game, options) {
        this.game = game;
        if (options.vertices) {
            this.body = this.game.Bodies.fromVertices(options.x, options.y, options.vertices, {retitutions: options.retitutions} );
        } else {
            this.body = this.game.Bodies.rectangle(options.x, options.y, options.height, options.width, { isStatic: options.isStatic });
        }
        
        this.game.addPool(this);
        this.model = options.model;
        this.loader = new GLTFLoader();
        this.load();
    }

    load() {
        this.loader.load(
            '/assets/models/' + this.model, // Chemin du fichier GLB
            (gltf) => {
                this.game.scene.add(gltf.scene); // Ajout du modèle à la scène lorsque le chargement est terminé
            },
            undefined,
            ( error ) => {
                console.log( 'An error happened' ); // Gestionnaire d'erreur
            }   
        );
    }

    update(delta) {}
}

export { Entity };