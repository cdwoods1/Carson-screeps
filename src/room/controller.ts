import { SpawnQueue } from "spawn/SpawnQueue";

export class Controller {
    public static run(controller: StructureController): void {
        const closestContainer: StructureContainer | null = controller.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType === STRUCTURE_CONTAINER;
            }
        });

        if(closestContainer) {
            Game.rooms[controller.room.name].memory.receivingContainerID = closestContainer.id;
        }

        const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader' && creep.memory.spawnedFrom === controller.id);
        if(upgraders.length < 3) {
            const numberInQueue = SpawnQueue.numCreepsinQueue(controller.room.name, 'upgrader',controller.id);
            if(numberInQueue < 3) {
                const closestSpawn = controller.pos.findClosestByPath(FIND_MY_SPAWNS);
                if(!closestSpawn) {
                    return;
                }
                SpawnQueue.addToQueue(closestSpawn, {
                    priority: 'high',
                    body: [WORK, CARRY, MOVE],
                    spawnedFrom: closestSpawn.id,
                    options: {
                        role: 'upgrader',
                        spawnedFrom: controller.id,
                    }
                });
            }
        }





       delete Game.rooms[controller.room.name].memory.receivingContainerID;
    }
}
