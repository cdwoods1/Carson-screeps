export const TICKS_PER_CHECK = 300;

export class Storage {
    public static run(storage: StructureStorage): void {
        Game.rooms[storage.room.name].memory.previousStorageEnergy = Game.rooms[storage.room.name].memory.currentStorageEnergy;
        Game.rooms[storage.room.name].memory.currentStorageEnergy = storage.store[RESOURCE_ENERGY];
        const ticksSinceLastCheck = Game.rooms[storage.room.name].memory.ticksSinceLastCheck;

        if(ticksSinceLastCheck < TICKS_PER_CHECK) {
            Game.rooms[storage.room.name].memory.ticksSinceLastCheck++;
            const diff = Game.rooms[storage.room.name].memory.currentStorageEnergy - Game.rooms[storage.room.name].memory.previousStorageEnergy;
            Game.rooms[storage.room.name].memory.totalDiffSinceCheck = Game.rooms[storage.room.name].memory.totalDiffSinceCheck + diff;
            return;
        } else {
            Game.rooms[storage.room.name].memory.ticksSinceLastCheck = 0;
            const ratioTick = Game.rooms[storage.room.name].memory.ratioTick;
            Game.rooms[storage.room.name].memory.ratioTick++;

            if(Game.rooms[storage.room.name].memory.ratioTick > 300) {
                Game.rooms[storage.room.name].memory.ratioTick = 1;
                Game.rooms[storage.room.name].memory.ratioEnumerator = 0;
            }

            const totalDiffSinceCheck = Game.rooms[storage.room.name].memory.totalDiffSinceCheck;
            const ratio = totalDiffSinceCheck / (Game.rooms[storage.room.name].find(FIND_SOURCES).length * SOURCE_ENERGY_CAPACITY);
            console.log("The overall diff is", ratio);

            const oldRatio = Game.rooms[storage.room.name].memory.ratioEnumerator;
            const ratioDiff = ratio - oldRatio;

            Game.rooms[storage.room.name].memory.ratioEnumerator = (Game.rooms[storage.room.name].memory.ratioEnumerator ?? 0) + ratioDiff;
            Game.rooms[storage.room.name].memory.ratioDiff = ratioDiff;


            const diff = Game.rooms[storage.room.name].memory.currentStorageEnergy - Game.rooms[storage.room.name].memory.previousStorageEnergy;
            Game.rooms[storage.room.name].memory.totalDiffSinceCheck = diff;
        }


        // const diff = Game.rooms[storage.room.name].memory.currentStorageEnergy - Game.rooms[storage.room.name].memory.previousStorageEnergy;
        // console.log(diff);

        const closestLink: StructureLink | null = storage.pos.findClosestByRange(FIND_MY_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType === STRUCTURE_LINK &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0 &&
                    structure.cooldown === 0;
            }
        });

        if(closestLink) {
            Game.rooms[storage.room.name].memory.receivingLink = closestLink?.id;
        }


    }
}
