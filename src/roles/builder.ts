import { HarvestingUtils } from "utils/HarvestingUtils";
import { Tower } from '../room/tower';

export class Builder {
    public static run(creep: Creep) {
        if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if(creep.memory.building) {
            const numberOfConstructionSites = creep.room.find(FIND_CONSTRUCTION_SITES).length;

            const priorityConstructionSites = creep.room.find(FIND_CONSTRUCTION_SITES, {
                filter: (structure) => {
                    return structure.structureType === STRUCTURE_CONTAINER ||
                        structure.structureType === STRUCTURE_STORAGE ||
                        structure.structureType === STRUCTURE_LINK ||
                        structure.structureType === STRUCTURE_EXTENSION ||
                        structure.structureType === STRUCTURE_SPAWN;
                }
            });
            if(priorityConstructionSites.length > 0) {
                if(creep.build(priorityConstructionSites[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(priorityConstructionSites[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
                return;
            }

            if(creep.room.controller && creep.room.controller.level < 6) {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                return;
            }

            if(Game.rooms[creep.room.name].energyAvailable < Game.rooms[creep.room.name].energyCapacityAvailable * .5) {
                const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType === STRUCTURE_EXTENSION && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
                if(target) {
                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                    return;
                }
            }

            var tower = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType === STRUCTURE_TOWER &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if(tower) {
                if(creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(tower, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                return;
            }

            var container = creep.room.find(FIND_CONSTRUCTION_SITES, {
                filter: (structure) => {
                    return structure.structureType === STRUCTURE_STORAGE || structure.structureType === STRUCTURE_CONTAINER;
                }
            });
            if(container.length > 0) {
                if(creep.build(container[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
                return;
            }

            var link = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {
                filter: (structure) => {
                    return structure.structureType === STRUCTURE_LINK
                }
            });
            if(link) {
                if(creep.build(link) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(link, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                return;
            }

            var extensions = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {
                filter: (structure) => {
                    return structure.structureType === STRUCTURE_EXTENSION;
                }
            });
            if(extensions) {
                if(creep.build(extensions) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(extensions, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                return;
            }

            const target: ConstructionSite | null = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if(target) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                // TODO: Replace this backup target logic with a job priority structure.
                var backupTargets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TOWER) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
                if(backupTargets.length > 0) {
                    if(creep.transfer(backupTargets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(backupTargets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                    return;
                }

                if(creep.room.controller &&
                    creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        else {
            const containerConstructionSites = creep.room.find(FIND_CONSTRUCTION_SITES, {
                filter: (structure) => {
                    return structure.structureType === STRUCTURE_CONTAINER;
                }
            });
            const threshold = containerConstructionSites.length > 0 ? -.2 : 0.1;
            HarvestingUtils.harvestFromContainers(creep, RESOURCE_ENERGY, threshold);
        }
    }
}
