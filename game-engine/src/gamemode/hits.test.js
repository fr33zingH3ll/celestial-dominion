import test from 'node:test';
import assert from 'node:assert/strict';
import { GameMaster } from './GameMaster.js';
import { PlayerEntity } from '../entity/PlayerEntity.js';
import { Projectil } from '../entity/Projectil.js';

test('un projectile ne blesse pas son auteur', () => {
    const game = new GameMaster();
    game.authoritative = true;
    const player = new PlayerEntity(game, 'base');
    game.addPool(player);
    const shot = new Projectil(game, 'base', player.id);
    game.addPool(shot);

    game.queueHit(shot, player);

    assert.equal(game.hitQueue.length, 0);
    assert.equal(player.hp, player.hpMax);
});

test('un projectile s\'arrête sur un corps sans points de vie', () => {
    const game = new GameMaster();
    game.authoritative = true;
    const owner = new PlayerEntity(game, 'base');
    game.addPool(owner);
    const shot = new Projectil(game, 'base', owner.id);
    game.addPool(shot);

    game.queueHit(shot, { id: owner.id + 1 });
    game.flushHits();

    assert.equal(game.pool.includes(shot), false);
});

test('un projectile blesse une autre entité vivante une seule fois', () => {
    const game = new GameMaster();
    game.authoritative = true;
    const owner = new PlayerEntity(game, 'base');
    const target = new PlayerEntity(game, 'base');
    game.addPool(owner);
    game.addPool(target);
    const shot = new Projectil(game, 'base', owner.id);
    game.addPool(shot);

    game.queueHit(shot, target);
    game.queueHit(shot, target);
    game.flushHits();

    assert.equal(target.hp, target.hpMax - shot.force);
    assert.equal(game.pool.includes(shot), false);
});
