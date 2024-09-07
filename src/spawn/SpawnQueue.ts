import { CreepRoles } from "memory/creep/creep-memory.types";

export type SpawnPriority = 'low' | 'medium' | 'high' | 'emergency';

// Represents a spawn action to put into the spawn queue.
export interface SpawnAction {
    role: CreepRoles;
    priority: SpawnPriority;
    body: BodyPartConstant[];
    spawnedFrom: Id<any> | Flag;
}

export class SpawnQueue {
    public static run(spawn: StructureSpawn): void {
        const spawnMemory = spawn.memory as SpawnMemory;
        const spawnQueue = spawnMemory.spawnQueue;

        if (spawnQueue.length > 0) {
            const nextSpawn = spawnQueue[0];
            const spawnResult = spawn.spawnCreep(nextSpawn.body, `creep-${Game.time}`, {
                memory: {
                    role: nextSpawn.role,
                    spawnedFrom: nextSpawn.spawnedFrom
                }
            });

            if (spawnResult === OK) {
                spawnQueue.shift();
            }
        }
    }
}
