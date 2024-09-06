import { isFriendlyOwner } from "utils/AttackUtils";

export class Rampart {
    public static run(rampart: StructureRampart): void {
        const hostileCreeps = rampart.room.find(FIND_HOSTILE_CREEPS, { filter: (creep) => { return !isFriendlyOwner(creep.owner) } });
        if(hostileCreeps.length === 0) {
            rampart.setPublic(true);
        } else {
            rampart.setPublic(false);
        }
    }
}
