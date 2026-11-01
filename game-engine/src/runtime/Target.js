export const Target = {
    ALL: 'all',
    SELF: 'self',
    OPPONENT: 'opponent',
    ALLY: 'ally',
    NEUTRAL: 'neutral',
};

/**
 * `actor` joue le coup, `subject` le subit.
 * Un allié est du même camp, auteur exclu. Un opposant est d'un autre camp.
 */
export function matchesTarget(target, actor, subject) {
    if (target === Target.ALL) {
        return true;
    }
    if (!actor || !subject) {
        return false;
    }
    if (target === Target.SELF) {
        return actor.id === subject.id;
    }
    if (target === Target.OPPONENT) {
        return actor.side !== undefined && actor.side !== subject.side;
    }
    if (target === Target.ALLY) {
        return actor.id !== subject.id && actor.side !== undefined && actor.side === subject.side;
    }
    if (target === Target.NEUTRAL) {
        return subject.side === 'neutral';
    }
    throw new Error('cible inconnue');
}
