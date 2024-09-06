
export class Collector {
    public static run(creep: Creep): void {
        if(creep.memory.delivering && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.delivering = false;
            creep.memory.targetContainerID = Game.rooms[creep.room.name].memory.fullestContainerID;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.delivering && creep.store.getFreeCapacity() == 0) {
            creep.memory.delivering = true;
            creep.say('⚡ deliver');
        }
        if(!creep.memory.delivering) {
            const recievingLink = Game.rooms[creep.room.name].memory.receivingLink;
            if(!recievingLink) {
                const targetContainerID = creep.memory.targetContainerID;
                if(targetContainerID) {
                    const fullestContainer = Game.getObjectById(targetContainerID);
                    if(fullestContainer) {
                        if(creep.withdraw(fullestContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(fullestContainer, {visualizePathStyle: {stroke: '#ffaa00'}});
                        }
                        return;
                    }
                } else {
                    creep.memory.targetContainerID = Game.rooms[creep.room.name].memory.fullestContainerID;
                }

                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[creep.memory.targetSource ?? 0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[creep.memory.targetSource ?? 0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            const recievingLinkID = Game.rooms[creep.room.name].memory.receivingLink;

            const link = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType === STRUCTURE_LINK &&
                    structure.store.energy > 0 &&
                    structure.id === recievingLinkID;
                }
            });
            if(link) {
                if(creep.withdraw(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(link, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
                var containers = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType === STRUCTURE_STORAGE) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
                creep.transfer(containers[0], RESOURCE_ENERGY);
                return;
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
            if(creep.room.controller && creep.room.controller?.level < 4) {
                const homeContainer = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                            structure.structureType === STRUCTURE_CONTAINER) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0 &&
                            Game.rooms[creep.room.name].memory.receivingContainerID === structure.id;
                    }
                });

                console.log(homeContainer);

                if(homeContainer) {
                    if(creep.transfer(homeContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(homeContainer, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                    return;
                }
            }

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
