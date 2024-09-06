// export const receivingLinks: Map<RoomKeys, string> = new Map([
//     ['W3N7', '66bc76484267030f311e9ea5'],
//     ['W4N6', '66bf9160bd7b230a304590b8'],
//     ['W5N5', '66c36a50b6f7fd0a2faf2693']
// ]);

export class Link {
    public static run(link: StructureLink): void {
        if(link.store.energy === 0) {
            return;
        }

        //TODO: Explore finding a way to dynamically determine the receiving link.
        const recievingLinkID = Game.rooms[link.room.name].memory.receivingLink;

        const target = link.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType === STRUCTURE_LINK &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0 &&
                structure.cooldown === 0 &&
                structure.id === recievingLinkID;
            }
        });

        if(target && target instanceof StructureLink) {
            if(link.transferEnergy(target) == ERR_NOT_IN_RANGE) {
                link.transferEnergy(target);
            }
        }
    }
}
