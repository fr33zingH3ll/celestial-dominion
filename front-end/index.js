import { message_update } from "./api.js";


const updates = await message_update();
console.log(updates)

const divItem = document.querySelector('.div-item');

for (const update of updates) {
    const p = document.createElement('p');
    p.textContent = `${update.id} : ${update.description}`;
    divItem.appendChild(p);
}