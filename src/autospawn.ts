import { SpawnUtils } from "utils/SpawnUtils";

export class AutoSpawn {
    public static run(spawnName: string, roomKey: string): void {

        const currentRatio = Game.rooms[roomKey].memory.ratioEnumerator;
        // console.log("The current ratio is", currentRatio);

        let bodyParts = null;
        let name = null;
        let options: {memory: CreepMemory | undefined } | undefined = undefined;
        let defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defender' && creep.room.name === roomKey);
        let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester'&& creep.room.name === roomKey);
        let upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader'&& creep.room.name === roomKey);
        let builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder'&& creep.room.name === roomKey);
        let repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer'&& creep.room.name === roomKey);
        let collectors = _.filter(Game.creeps, (creep) => creep.memory.role == 'collector'&& creep.room.name === roomKey);
        let claimer = _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer');
        let extensioner = _.filter(Game.creeps, (creep) => creep.memory.role == 'extensioner'&& creep.room.name === roomKey);
        let attackers = _.filter(Game.creeps, (creep) => creep.memory.role == 'attacker');
        let sentries = _.filter(Game.creeps, (creep) => creep.memory.role == 'sentry');
        let healers = _.filter(Game.creeps, (creep) => creep.memory.role == 'healer' && creep.room.name === roomKey);
        let immigrants = _.filter(Game.creeps, (creep) => creep.memory.role == 'immigrant');
        let numHaulers = _.filter(Game.creeps, (creep) => creep.memory.role == 'hauler');

        const extensions = Game.spawns[spawnName].room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType === STRUCTURE_EXTENSION;
            }
        });

        const sources = Game.spawns[spawnName].room.find(FIND_SOURCES);

        const controller = Game.rooms[roomKey].controller;

        let numHarvesters = sources.length;
        let numCollectors = 2;
        if(extensions.length < 10) {
            // numHarvesters = sources.length * 3;
        }

        if(extensions.length >= 18) {
            numHarvesters = sources.length;
            numCollectors = 1;
        }

        const sourceCounts: Map<number, number> = new Map();
        for(let i = 0; i < harvesters.length; i++) {
            const source = harvesters[i].memory.targetSource ?? 0;
            sourceCounts.set(source, (sourceCounts.get(source) ?? 0) + 1);
        }

        let newSourceTarget = 0;
        for(let i = 0; i < sources.length; i++) {
            const sourceCount = sourceCounts.get(i);
            if(!sourceCount || sourceCount < numHarvesters / sources.length) {
                newSourceTarget = i;
                break;
            }
        }
        let energyAvailable = Game.spawns[spawnName].room.energyAvailable;
        if(immigrants.length < 0) {
            name = 'Immigrant' + Game.time;
            bodyParts = SpawnUtils.getBodyPartsForArchetype('immigrant', energyAvailable);
            options = {memory: {role: 'immigrant'}}
        }

        if(extensioner.length < 1 && numHarvesters > 0) {
            name = 'Extensioner' + Game.time;
            bodyParts = SpawnUtils.getBodyPartsForArchetype('extensioner', energyAvailable)
            options = {memory: {role: 'extensioner'} }
        } else if (harvesters.length < numHarvesters) {
            console.log("spawning harvester");
            name = 'Harvester' + Game.time;
            bodyParts = SpawnUtils.getBodyPartsForArchetype('harvester', energyAvailable)
                options = {memory: {role: 'harvester', targetSource: newSourceTarget }                }
        } else if(extensioner.length < 1) {
            name = 'Extensioner' + Game.time;
            bodyParts = SpawnUtils.getBodyPartsForArchetype('extensioner', energyAvailable)
            options = {memory: {role: 'extensioner'} }
        } else if(numHaulers.length  < 2) {
            name = 'Hauler' + Game.time;
            bodyParts = SpawnUtils.getBodyPartsForArchetype('hauler', energyAvailable)
            options = {memory: {role: 'hauler'} }
        }
        else if(collectors.length < 1) {
            console.log("spawning collector");
            name = 'Collector' + Game.time;
            bodyParts = SpawnUtils.getBodyPartsForArchetype('collector', energyAvailable)
                options = {memory: {role: 'collector'}                }
        }  else if(sentries.length < AutoSpawn.getSentryNumber(roomKey)) {
            name = 'Sentry' + Game.time;
            console.log("spawning sentry");
            bodyParts = SpawnUtils.getBodyPartsForArchetype('sentry', energyAvailable)
            options = {memory: {role: 'sentry'} }
        }
        else if (defenders.length < 1) {
            name = 'Defender' + Game.time;
            bodyParts = SpawnUtils.getBodyPartsForArchetype('defender', energyAvailable);
            options = {memory: {role: 'defender'}};
        } else if(upgraders.length < AutoSpawn.getNumberOfUpgradersAndBuilders(roomKey)) {
            name = 'Upgrader' + Game.time;
            bodyParts = SpawnUtils.getBodyPartsForArchetype('upgrader', energyAvailable)
                options = {memory: {role: 'upgrader'}                }
        } else if(builders.length < AutoSpawn.getNumberOfUpgradersAndBuilders(roomKey)) {
            name = 'Builder' + Game.time;
            bodyParts = SpawnUtils.getBodyPartsForArchetype('builder', energyAvailable)
            options = {memory: {role: 'builder', travelling: false}                }
        }  else if(repairers.length < 2) {
                name = 'Repairer' + Game.time;
                bodyParts = SpawnUtils.getBodyPartsForArchetype('repairer', energyAvailable)
                    options = {memory: {role: 'repairer'}            }
        } else if(claimer.length < 0) {
                name = 'Claimer' + Game.time;
                bodyParts = SpawnUtils.getBodyPartsForArchetype('claimer', energyAvailable)
                options = {memory: {role: 'claimer'}            }
        }

            else if(defenders.length < 1) {
                name = 'Defender' + Game.time;
                bodyParts = SpawnUtils.getBodyPartsForArchetype('defender', energyAvailable)
                options = {memory: {role: 'defender'}            }
            }

        else if(attackers.length < 0) {
            name = 'Attacker' + Game.time;
            bodyParts = SpawnUtils.getBodyPartsForArchetype('attacker', energyAvailable)
            options = {memory: {role: 'attacker'} }
        }

        else if(healers.length < 2) {
            name = 'Healer' + Game.time;
            bodyParts = SpawnUtils.getBodyPartsForArchetype('healer', energyAvailable)
            options = {memory: {role: 'healer'} }
        }

        const spawning = Game.spawns[spawnName].spawning;
        if(spawning) {
            var spawningCreep = Game.creeps[spawning.name];
            Game.spawns[spawnName].room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                Game.spawns[spawnName].pos.x + 1,
                Game.spawns[spawnName].pos.y,
                {align: 'left', opacity: 0.8});
        } else if (bodyParts != null && name != null) {
            let spawnResult = Game.spawns[spawnName].spawnCreep(bodyParts,name, options);
            spawnResult
        }

    }

    private static getSentryNumber(roomKey: string) {
        const blueFlags = Game.rooms[roomKey].find(FIND_FLAGS).filter((flag) => flag.color === COLOR_BLUE);
        return blueFlags.length;
    }

    public static getNumberOfUpgradersAndBuilders(roomKey: string) {

        if(Game.rooms[roomKey].controller?.level ?? 0 < 4) {
            return 2;
        }
        const room = Game.rooms[roomKey];
        const currentRatio = room.memory.ratioEnumerator;
        const storage = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType === STRUCTURE_STORAGE &&
                structure.room.name === roomKey } })[0] as StructureStorage;
        if(!storage) {
            return 1;
        }
        const energy = storage.store.getUsedCapacity(RESOURCE_ENERGY);
        if(energy < 100000) {
            return currentRatio < 0.1 ? 1: 2;
        }
        if(energy < 150000) {
            return currentRatio > 0 ? 3 : 2;
        }
        if(energy < 500000) {
            return 3;
        }
        if(energy < 700000) {
            return 4;
        }
        return 5;
    }
}
