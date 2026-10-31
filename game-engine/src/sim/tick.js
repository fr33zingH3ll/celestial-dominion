/** Pas fixe du serveur, en millisecondes. 1000/30 n'est pas un entier. */
export const SERVER_TICK_MS = 1000 / 30;

/** Delta client plafonné pour éviter un saut de physique après un onglet en pause. */
export const MAX_FRAME_MS = 100;

/** Nombre maximum de pas rattrapés si le serveur a pris du retard. */
export const MAX_CATCHUP_STEPS = 5;
