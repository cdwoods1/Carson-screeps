import { SpawnUtils } from "utils/SpawnUtils";

export class AutoSpawn {
    public static run(): void {


        let bodyParts = null;
        let name = null;
        let options = undefined;
        let defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defender');
        let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        let upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        let builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        let repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');

        let energyAvailable = Game.spawns['Spawn1'].room.energyAvailable;
        if (defenders.length < 2) {
            name = 'Defender' + Game.time;
            bodyParts = SpawnUtils.getBodyPartsForArchetype('defender', energyAvailable);
            options = {memory: {role: 'defender'}};
        } else if (harvesters.length < 3) {
            name = 'Harvester' + Game.time;
            bodyParts = SpawnUtils.getBodyPartsForArchetype('harvester', energyAvailable)
                options = {memory: {role: 'harvester'}                }
        } else if(upgraders.length < 3) {
            name = 'Upgrader' + Game.time;
            bodyParts = SpawnUtils.getBodyPartsForArchetype('upgrader', energyAvailable)
                options = {memory: {role: 'upgrader'}                }
        } else if(builders.length < 3) {
            name = 'Builder' + Game.time;
            bodyParts = SpawnUtils.getBodyPartsForArchetype('builder', energyAvailable)
                options = {memory: {role: 'builder'}                }
            }  else if(repairers.length < 2) {
                name = 'Repairer' + Game.time;
                bodyParts = SpawnUtils.getBodyPartsForArchetype('repairer', energyAvailable)
                    options = {memory: {role: 'repairer'}            }
            } else if(defenders.length < 10) {
                name = 'Defender' + Game.time;
                bodyParts = SpawnUtils.getBodyPartsForArchetype('defender', energyAvailable)
                options = {memory: {role: 'defender'}            }
            }


        if(Game.spawns['Spawn1'].spawning) {
            var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
            console.log('Spawning new creep: ' + name);
            Game.spawns['Spawn1'].room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                Game.spawns['Spawn1'].pos.x + 1,
                Game.spawns['Spawn1'].pos.y,
                {align: 'left', opacity: 0.8});
        } else if (bodyParts != null && name != null) {
            let spawnResult = Game.spawns['Spawn1'].spawnCreep(bodyParts,name, options);
        }

    }
}
