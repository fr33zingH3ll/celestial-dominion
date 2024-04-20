import { Asteroide } from "./Asteroide";
import { PlayerEntity } from "./PlayerEntity";

const entityNames = {};

[Asteroide, PlayerEntity].forEach((e) => {
    entityNames[e.name] = e;
});

export { entityNames };