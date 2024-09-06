export class RepairUtils {
    public static getRepairMax(structure: Structure): number {
        if(structure.structureType === STRUCTURE_WALL || structure.structureType === STRUCTURE_RAMPART) {
            const store = Game.rooms[structure.room.name].find(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType === STRUCTURE_STORAGE;
                }
            });
            if(store[0]) {
                if((store[0] as StructureStorage).store[RESOURCE_ENERGY] > 50000) {
                    return 500000;
                } else {
                    return 150000;
                }
            } else {
                return 50000;
            }
        }
        return structure.hitsMax;
    }
}
