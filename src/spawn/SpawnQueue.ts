import { CreepRoles } from "memory/creep/creep-memory.types";
import { Memory } from '../../test/unit/mock';

export type SpawnPriority = 'low' | 'medium' | 'high' | 'emergency';

// Represents a spawn action to put into the spawn queue.
export interface SpawnAction {
    priority: SpawnPriority;
    body: BodyPartConstant[];
    spawnedFrom: Id<any> | Flag;
    spawnDestination?: { roomKey: string, roomPosition: RoomPosition};
    options?: CreepMemory;
}

/**
 * Handles queuing spawns for spawning new creeps.
 *
 * This class is singularly focused on spawning, and does not choose
 * Which spawn to use or which body parts to use.
 *
 * The focus of this class to queue spawns, and to ensure the higher priority spawns go first.
 *
 */
export class SpawnQueue {
    public static run(spawn: StructureSpawn): void {
        console.log("Queue running");
        const spawnMemory = spawn.memory as SpawnMemory;
        const spawnQueue = spawnMemory.spawnQueue;

        if(!spawnQueue) {
            Game.spawns[spawn.name].memory.spawnQueue = [];
        }

        console.log(spawnQueue);

        const spawning = spawn.spawning;

        // Do not shift the queue if we are actively spawning.
        if( spawning ) {
            const spawnName = spawn.name;
            var spawningCreep = Game.creeps[spawning.name];
            Game.spawns[spawnName].room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                Game.spawns[spawnName].pos.x + 1,
                Game.spawns[spawnName].pos.y,
                {align: 'left', opacity: 0.8});
            return;
        }

        if (spawnQueue && spawnQueue.length > 0) {
            const nextSpawn = spawnQueue[0];
            const spawnResult = spawn.spawnCreep(nextSpawn.body, `${nextSpawn.options?.role ?? ''}-creep-${Game.time}`, {
                memory: {
                    // TODO: Figure out a better way to handle roles not being set.
                    role: nextSpawn.options?.role ?? 'harvester',
                    ...nextSpawn.options,
                }
            });

            console.log(spawnResult);

            if (spawnResult === OK) {
                spawnQueue.shift();
            }
        }
    }

    public static addToQueue(spawn: StructureSpawn, spawnAction: SpawnAction): void {
        const spawnMemory = spawn.memory as SpawnMemory;
        const spawnQueue = Game.spawns[spawn.name].memory.spawnQueue;

        console.log( Game.spawns[spawn.name].memory.spawnQueue);

        if(!Game.spawns[spawn.name].memory.spawnQueue) {
            Game.spawns[spawn.name].memory.spawnQueue = [];
        }

        // Only allow one item at a time to be queued from the same location.
        // TODO: Find a way to allow multiple spawns at once while not overloading the queue.
        const hasItem = spawnQueue.some((item) => {
            return item.spawnedFrom === spawnAction.spawnedFrom;
        });

        if(hasItem) {
            return;
        }

        Game.spawns[spawn.name].memory.spawnQueue.push(spawnAction);
        Game.spawns[spawn.name].memory.spawnQueue =  Game.spawns[spawn.name].memory.spawnQueue.sort((a, b) => {
            return this.getHigherPriority(a.priority, b.priority);
        });
    }

    public static numCreepsinQueue(roomID: string, role: CreepRoles, spawnedFrom?: Id<any> | Flag): number {
        const spawns = Game.rooms[roomID].find(FIND_MY_SPAWNS);
        let numCreeps = 0;
        for(const spawn of spawns) {
            const spawnQueue = Game.spawns[spawn.name].memory.spawnQueue;

            if(!Game.spawns[spawn.name].memory.spawnQueue) {
                continue;
            }

            const creepsBeingSpawnedFromItem = spawnQueue.filter((item) => {
                return spawnedFrom === undefined || item.spawnedFrom === spawnedFrom;
            });

            const creepsFulfillingRole = creepsBeingSpawnedFromItem.filter((item) => {
                return item.options?.role === role;
            });

            numCreeps += creepsFulfillingRole.length;
        }
        return numCreeps;
    }


    /**
     * Sorts and returns which of the two priorities is higher, in a way compatible with sort methods.
     */
    private static getHigherPriority(priorityOne: SpawnPriority, priorityTwo: SpawnPriority): number {
        switch (priorityOne) {
            case 'low':
                if(priorityTwo === 'low') {
                    return 0;
                }
                return 1;
            case 'medium':
                if(priorityTwo === 'low') {
                    return -1;
                }
                if(priorityTwo === 'medium') {
                    return 0;
                }
                return 1;
            case 'high':
                if(priorityTwo === 'emergency') {
                    return 1;
                }
                if(priorityTwo === 'high') {
                    return 0;
                }
                return -1;
            case 'emergency':
                if(priorityTwo === 'emergency') {
                    return 0;
                }
                return -1;
        }
    }
}
