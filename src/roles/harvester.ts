import { info } from "console";
import { HarvestingUtils } from "utils/HarvestingUtils";

export class Harvester {
    public static run(creep: Creep): void {
        if(creep.memory.delivering && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.delivering = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.delivering && creep.store.getFreeCapacity() == 0 || creep.room.find(FIND_SOURCES)[creep.memory.targetSource ?? 0].energy === 0) {
            creep.memory.delivering = true;
            creep.say('⚡ deliver');
        }
        if(!creep.memory.delivering) {
            const targetSourceID = creep.memory.targetSourceID;
            if(!targetSourceID) {
                console.log(`Harvester ${creep.id} spawned without source`);
                return;
            }
            var source = Game.getObjectById(targetSourceID);
            if(source) {
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }

            const link = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                        structure.structureType === STRUCTURE_LINK &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0 &&
                        structure.structureType !== Game.rooms[creep.room.name].memory.receivingLink
                    )
                }
            });

            if(link) {
                if(creep.transfer(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    return;
                }
                return;
            }

            const otherContainerTypes = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                        structure.structureType === STRUCTURE_LINK ||
                        structure.structureType === STRUCTURE_CONTAINER ||
                        structure.structureType === STRUCTURE_STORAGE) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0 &&
                        structure.structureType !== Game.rooms[creep.room.name].memory.receivingLink;;
                }
            });

            if(otherContainerTypes) {
                if(creep.transfer(otherContainerTypes, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    return;
                }
                return;
            }
            // Harvester.fillLinks(creep);
        }
        else {
            const roomSpawns = _.filter(Game.spawns, (spawn) => spawn.room.name === creep.room.name);
            // if((roomSpawns[0].room.energyAvailable / roomSpawns[0].room.energyCapacityAvailable) < 0.1) {
            //     Harvester.fillAlternateTargets(creep);
            // }
            if(Harvester.fillLinks(creep)) {
                return;
            }
            if(HarvestingUtils.fillContainers(creep, RESOURCE_ENERGY)) {
                return;
            }
            if(Harvester.fillAlternateTargets(creep)) {
                return;
            }
        }
    }

    private static fillLinks(creep: Creep) {
        const link = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_LINK ||
                    structure.structureType === STRUCTURE_CONTAINER ||
                    structure.structureType === STRUCTURE_STORAGE) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });

        if(link) {
            if(creep.transfer(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(link, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            return true;
        }
        return false;
    }

    private static fillAlternateTargets(creep: Creep) {

        const spawn = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_SPAWN) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });

        if(spawn) {
            if(creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(spawn, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            return true;
        }

        const controller = creep.room.controller;
        if(controller && controller.my && controller.level < 4) {
            if(creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(controller, {visualizePathStyle: {stroke: '#ffffff'}});
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
            return true;
        }

        // var constructionSites = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        // if(constructionSites) {
        //     if(creep.build(constructionSites) == ERR_NOT_IN_RANGE) {
        //         creep.moveTo(constructionSites, {visualizePathStyle: {stroke: '#ffffff'}});
        //     }
        //     return true;
        // }

        if(creep.room.controller && creep.room.controller.my &&
            creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            return true;
        }

        creep.moveTo(Game.flags["HarvesterHelp"], {visualizePathStyle: {stroke: '#ffffff'}});
        return;
    }
}
