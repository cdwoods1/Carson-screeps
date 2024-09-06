import { RepairUtils } from "utils/RepairUtils";


export class Repairer {
    public static run(creep: Creep) {
        if(creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.repairing = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
            creep.memory.repairing = true;
            creep.say('🚧 repair');
        }

        if(creep.memory.repairing) {

            const room = Game.rooms[creep.room.name];
            const currentRatio = room.memory.ratioEnumerator;
            const storage = room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType === STRUCTURE_STORAGE &&
                    structure.room.name === creep.room.name
                } })[0] as StructureStorage;

            if(storage && storage.store.energy < 100000 && currentRatio < 0) {
                const road = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: object => object.structureType === STRUCTURE_ROAD && object.hits < object.hitsMax * .1
                });
                if(road) {
                    creep.memory.objectRepairingID = road.id;
                    if(creep.repair(road) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(road, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                    return
                }

                // const extension = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                //     filter: object => object.structureType === STRUCTURE_EXTENSION && object.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                // });
                // if(extension) {
                //     if(creep.transfer(extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                //         creep.moveTo(extension, {visualizePathStyle: {stroke: '#ffffff'}});
                //     }
                //     return;
                // }

                return;
            }

            const potentialRepairingID = creep.memory.objectRepairingID;
            if(potentialRepairingID) {
                const potentialSavedRepairer = Game.getObjectById(potentialRepairingID);
                if(potentialSavedRepairer) {
                if(potentialSavedRepairer?.hits >= RepairUtils.getRepairMax(potentialSavedRepairer)) {
                    creep.memory.objectRepairingID = undefined;
                } else if(potentialSavedRepairer) {
                    if(creep.repair(potentialSavedRepairer) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(potentialSavedRepairer, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                    return;
                }
            }

            }

            const road = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: object => object.structureType === STRUCTURE_ROAD && object.hits < object.hitsMax * .25
            });
            if(road) {
                creep.memory.objectRepairingID = road.id;
                if(creep.repair(road) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(road, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                return
            }

            const rampart = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: object => object.structureType === STRUCTURE_RAMPART && object.hits < 100000
            });
            if(rampart) {
                creep.memory.objectRepairingID = rampart.id;
                if(creep.repair(rampart) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(rampart, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                return;
            }

            const wall = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: object => object.structureType === STRUCTURE_WALL && object.hits < 100000
            });
            if(wall) {
                creep.memory.objectRepairingID = wall.id;
                if(creep.repair(wall) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(wall, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                return;
            }

            const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: object => object.hits < object.hitsMax * .25
            });
            if(target) {
                creep.memory.objectRepairingID = target.id;
                if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                return;
            }

            const constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(constructionSites.length) {
                if(creep.build(constructionSites[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionSites[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
                return;
            }
        }
        else {
            var destroyedStructure = creep.room.find(FIND_RUINS, {
                filter: (ruin) => {
                    return ruin.store.energy > 50;
                }
            });

            if(destroyedStructure.length > 0) {
                if(creep.withdraw(destroyedStructure[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(destroyedStructure[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
                return;
            }

            var gravestones = creep.room.find(FIND_TOMBSTONES, {
                filter: (tombstone) => {
                    return tombstone.store.energy > 40;
                }
            });
            if(gravestones.length > 0) {
                if(creep.withdraw(gravestones[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(gravestones[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
                return;
            }
            var structureSources = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_STORAGE) && structure.store.energy > 0;
                }
            });
            if(structureSources.length > 0) {
                if(creep.withdraw(structureSources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structureSources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
                return;
            }
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
}
