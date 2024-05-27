export class Harvester {
    public static run(creep: Creep): void {
        if(creep.memory.delivering && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.delivering = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.delivering && creep.store.getFreeCapacity() == 0) {
            creep.memory.delivering = true;
            creep.say('⚡ deliver');
        }
        if(!creep.memory.delivering) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[creep.memory.targetSource ?? 0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[creep.memory.targetSource ?? 0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
}
