import { SpawnQueue } from "spawn/SpawnQueue";
import { SpawnUtils } from "utils/SpawnUtils";

export class SourceHandler {
    public static run(source: Source) {
        const sourceCreeps = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.memory.targetSourceID === source.id);

        console.log(`Source ${source.id} has ${sourceCreeps} creeps`);

        if(sourceCreeps.length === 0) {
            const harvestersCurrentlyBeingSpawned = SpawnQueue.numCreepsinQueue(source.room.name, 'harvester', source.id);
            if(harvestersCurrentlyBeingSpawned > 0) {
                return;
            }
            console.log(`spawning harvester for source ${source.id}`);
            const closestSpawn = source.pos.findClosestByPath(FIND_MY_SPAWNS);
            if(!closestSpawn) {
                return;
            }
            const energyAvailable = closestSpawn.room.energyAvailable ?? 0;
            const newHarvesterBody = SpawnUtils.getBodyPartsForArchetype('harvester', energyAvailable);
            console.log(newHarvesterBody);
            if(!newHarvesterBody) {
                return;
            }

            console.log(closestSpawn);

            SpawnQueue.addToQueue(closestSpawn, {
                priority: 'emergency',
                body: newHarvesterBody,
                spawnedFrom: closestSpawn.id,
                options: {
                    role: 'harvester',
                    targetSourceID: source.id,
                }
            });
        }
    }
}
