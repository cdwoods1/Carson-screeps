
export class Hauler {
    public static run(creep: Creep): void {
        if(creep.memory.delivering && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.delivering = false;
            console.log("Container to withdraw from: " + Game.rooms[creep.room.name].memory.fullestContainerID);
            creep.memory.targetContainerID = Game.rooms[creep.room.name].memory.fullestContainerID;
            creep.say('🔄 withdraw');
        }
        if(!creep.memory.delivering && creep.store.getFreeCapacity() == 0) {
            creep.memory.delivering = true;
            creep.say('⚡ haul');
        }
        if(!creep.memory.delivering) {
            const droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
            if(droppedEnergy) {
                if(creep.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(droppedEnergy, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
                return;
            }
            const targetContainerID = creep.memory.targetContainerID;
                if(targetContainerID) {
                    const fullestContainer = Game.getObjectById(targetContainerID);
                    if(fullestContainer) {
                        if(creep.withdraw(fullestContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(fullestContainer, {visualizePathStyle: {stroke: '#ffaa00'}});
                        }
                        return;
                    } else {
                        delete creep.memory.targetContainerID;
                    }
                } else {
                    creep.memory.targetContainerID = Game.rooms[creep.room.name].memory.fullestContainerID;
                }

                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[creep.memory.targetSource ?? 0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[creep.memory.targetSource ?? 0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }

            // var energy = creep.room.find(FIND_DROPPED_RESOURCES);
            // if(energy.length > 0) {
            //     if(creep.pickup(energy[0]) == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(energy[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            //     }
            //     return;
            // }

        }
        else {
            const storages = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                        structure.structureType === STRUCTURE_STORAGE) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                }
            });

            if(storages.length > 0) {
                if(creep.transfer(storages[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storages[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
                return;
            }
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
