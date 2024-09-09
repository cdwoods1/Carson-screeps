import { ErrorMapper } from "utils/ErrorMapper";
import { Harvester } from "roles/harvester";
import { Upgrader } from "roles/upgrader";
import { Defender } from "roles/defender";
import { Builder } from "roles/builder";
import { AutoSpawn } from "autospawn";
import { Repairer } from "roles/repairer";
import { Collector } from "roles/collector";
import { RoomService } from "roomservice";
import { Claimer } from "roles/claimer";
import { Extensioner } from "roles/extensioner";
import { Sentry } from "roles/sentry";
import { Attacker } from "roles/attacker";
import { Healer } from "roles/healer";
import { Immigrant } from "roles/immigrant";
import { RoomUtils } from "utils/RoomUtils";
import { BaseCreepMemory, CreepRoles } from "memory/creep/creep-memory.types";
import { Hauler } from "roles/hauler";
import { SpawnAction, SpawnQueue } from "spawn/SpawnQueue";

export const ATTACK_THOSE_BOIS: boolean = false;

declare global {
  /*
    Example types, expand on these or remove them and add your own.
    Note: Values, properties defined here do no fully *exist* by this type definiton alone.
          You must also give them an implemention if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)

    Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
    Interfaces matching on name from @types/screeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
  */
  // Memory extension samples
  interface Memory {
    uuid: number;
    log: any;
    // Rooms memory
    myRooms: string[];
    timeSinceRoomsChecked: number;
  }

  interface StructureLink {
    receiver: boolean;
  }

  interface CreepMemory {

    creepMemory?: BaseCreepMemory;

    role: CreepRoles;
    room?: string;
    working?: boolean;
    upgrading?: boolean;
    building?: boolean;
    repairing?: boolean;
    targetSource?: number;
    delivering?: boolean;
    flag?: string;
    travelling?: boolean;
    attack?: boolean;

    objectRepairingID?: Id<Structure>;

    // Collector memory.
    targetContainerID?: Id<StructureContainer>;

    // Sentry memory.
    targetFlag?: Flag;

    spawnedFrom?: Id<any> | Flag;

    // Used for harvesters to determine which source to target.
    targetSourceID?: Id<Source>;
  }


  interface RoomMemory {
    receivingLink: Id<StructureLink>;

    previousStorageEnergy: number;
    currentStorageEnergy: number;
    ticksSinceLastCheck: number;
    totalDiffSinceCheck: number;
    ratioEnumerator: number;
    ratioTick: number;
    ratioDiff: number;

    currentContainerEnergy: number;

    receivingContainerID?: Id<StructureContainer>;
    fullestContainerID?: Id<StructureContainer>;

    // Represents a creep mapped to a source in a room.
    sourceCreeps: Map<Id<Source>, Id<Creep>>;

  }

  interface FlagMemory {
    // Blue flag
    sentryCreepID?: Id<Creep>;
  }

  interface SpawnMemory {
    spawnQueue: SpawnAction[];
    ticksSinceLastSort: number;
  }

  type RoomKeys = 'W7N5';

  // Syntax for adding proprties to `global` (ex "global.log")
  namespace NodeJS {
    interface Global {
      log: any;
       // Rooms memory
      myRooms: string[];
      timeSinceRoomsChecked: number;
    }
  }




}

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  //console.log(`Current game tick is ${Game.time}`);

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }

  for(const room in Memory.myRooms) {
    if(!Game.rooms[room].memory.sourceCreeps) {
      Game.rooms[room].memory.sourceCreeps = new Map();
    }
  }

  RoomUtils.run();


  // Creep behavior loop.
  for(var name in Game.creeps) {
    var creep = Game.creeps[name];

    switch(creep.memory.role) {
      case 'harvester':
        Harvester.run(creep);
        break;
      case 'upgrader':
        Upgrader.run(creep);
        break;
      case 'builder':
        Builder.run(creep);
        break;
      case 'defender':
        Defender.run(creep);
        break;
      case 'repairer':
        Repairer.run(creep);
        break;
      case 'collector':
        Collector.run(creep);
        break;
      case 'claimer':
        Claimer.run(creep);
        break;
      case 'extensioner':
        Extensioner.run(creep);
        break;
      case 'sentry':
        Sentry.run(creep);
        break;
      case 'attacker':
        Attacker.run(creep);
        break;
      case 'healer':
        Healer.run(creep);
        break;
      case 'hauler':
        Hauler.run(creep);
        break;
      case 'immigrant':
        Immigrant.run(creep);
    }
  }
});
