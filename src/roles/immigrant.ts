import { HarvestingUtils } from "utils/HarvestingUtils";

export class Immigrant {
    public static run(creep: Creep): void {
        const flag = Game.flags.ClaimOne;
        if(flag && creep.room !== flag.room) {
            creep.moveTo(flag, {visualizePathStyle: {stroke: '#ff0000'}});
            return;
        }

        if(creep.memory.delivering && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.delivering = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.delivering && creep.store.getFreeCapacity() == 0 || creep.room.find(FIND_SOURCES)[creep.memory.targetSource ?? 0].energy === 0) {
            creep.memory.delivering = true;
            creep.say('⚡ deliver');
        }
        if(!creep.memory.delivering) {
            var sources = creep.pos.findClosestByPath(FIND_SOURCES, {
                filter: (source) => {
                    return source.energy > 0;
                }
            });
            if(sources) {
            if(creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        }
        else {
            if(creep.room.controller && creep.room.controller.level > 1 && creep.room.controller.ticksToDowngrade > 2000) {
                const spawnConstructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {
                    filter: (structure) => {
                        return structure.structureType === STRUCTURE_SPAWN;
                    }
                });

                if(spawnConstructionSite) {
                    if(creep.build(spawnConstructionSite) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(spawnConstructionSite, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                    return;
                }

                const builtSpawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS, {
                    filter: (structure) => {
                        return structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
                if(builtSpawn) {
                    if(creep.transfer(builtSpawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(builtSpawn, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                    return;
                }
            }

            if(creep.room.controller &&
                creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }


              // TODO: fulfill a few roles based off of memory.
        // If there is a spawn construction site, focus on that.
        // If the controller is low enough, focus on that.
        // If neither is true, focus on extensions.
        }
    }
}
