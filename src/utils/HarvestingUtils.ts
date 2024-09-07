export class HarvestingUtils {
    public static harvestFromContainers(creep: Creep, resourceType: RESOURCE_ENERGY, minimumEnergyThreshold: number = 0.0): void {

        const currentRatio = Game.rooms[creep.room.name].memory.ratioEnumerator;
        const store: StructureStorage | null = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType === STRUCTURE_STORAGE && structure.store.energy > 0;
            }
        });

        // TODO: Map thresholds to energy values. Eventually one day dynamically calculate thresholds.
        if(currentRatio < minimumEnergyThreshold && store && store.store.energy < 100000) {

            const container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_CONTAINER) &&
                        structure.store.energy > 0;
                }
            });
            if(container) {
                if(creep.withdraw(container, resourceType) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
                return;
            }

            return;
        }

        if(currentRatio < Math.min(minimumEnergyThreshold, -1) && store && store.store.getUsedCapacity(RESOURCE_ENERGY) < 300000) {
            const container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_CONTAINER) &&
                        structure.store.energy > 0;
                }
            });
            if(container) {
                if(creep.withdraw(container, resourceType) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
                return;
            }

            return;
        }

        var storage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType === STRUCTURE_STORAGE && structure.store.getUsedCapacity(resourceType) > 0;
            }
        });
        if(storage) {
            if(creep.withdraw(storage, resourceType) == ERR_NOT_IN_RANGE) {
                creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            return;
        }

        const container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_CONTAINER) &&
                    structure.store.getUsedCapacity(resourceType) > 0;
            }
        });
        if(container) {
            if(creep.withdraw(container, resourceType) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            return;
        }

        if(creep.room.controller && creep.room.controller.level < 4) {



            var sources = creep.pos.findClosestByPath(FIND_SOURCES);
            if(sources) {
            if(creep.harvest(sources) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources);
            }
        }
    }
    }

    public static fillContainers(creep: Creep, resourceType: RESOURCE_ENERGY): boolean {
        const storages = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_STORAGE) &&
                    structure.store.getFreeCapacity(resourceType) > 0;
            }
        });

        if(storages.length > 0) {
            if(creep.transfer(storages[0], resourceType) == ERR_NOT_IN_RANGE) {
                creep.moveTo(storages[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
            return true;
        }

        const containers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_CONTAINER) &&
                    structure.store.getFreeCapacity(resourceType) > 0;
            }
        });

        if(containers.length > 0) {
            if(creep.transfer(containers[0], resourceType) == ERR_NOT_IN_RANGE) {
                creep.moveTo(containers[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
            return true;
        }

        return false;
    }

    private static fillLinks(creep: Creep) {
        if(!creep.memory.targetSource || creep.memory.targetSource < 1) {
            return false;
        }

        const link = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType === STRUCTURE_LINK
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
}
