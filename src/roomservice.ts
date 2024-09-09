import { Container } from "room/container";
import { Controller } from "room/controller";
import { FlagHandler } from "room/flag";
import { Link } from "room/link";
import { Rampart } from "room/rampart";
import { SourceHandler } from "room/source";
import { Storage } from "room/storage";
import { Tower } from "room/tower";
import { RoomKeys } from './utils/RoomUtils';
import { SpawnQueue } from "spawn/SpawnQueue";

export class RoomService {
    public static run(roomID: string): void {
        RoomService.handleLinks(roomID);
        RoomService.handleTowers(roomID);
        RoomService.handleRamparts(roomID);
        RoomService.handleStorage(roomID);
        RoomService.handleControllers(roomID);
        RoomService.handleContainers(roomID);
        RoomService.handleFlags(roomID);
        RoomService.handleSources(roomID);
        RoomService.handleConstructionSites(roomID);
        RoomService.handleFreeEnergy(roomID);
    }

    private static handleFreeEnergy(roomID: string): void {
      const freeEnergy = Game.rooms[roomID].find(FIND_DROPPED_RESOURCES, {
        filter: (resource) => {
          return resource.resourceType === RESOURCE_ENERGY;
        }
      });

      if(freeEnergy.length === 0) {
        return;
      }

      const haulers = _.filter(Game.creeps, (creep) => creep.memory.role == 'hauler' && creep.room.name === roomID);
      if(haulers.length < 1) {
        const numberInQueue = SpawnQueue.numCreepsinQueue(roomID, 'hauler');

        if(numberInQueue < 1) {
          const closestSpawn = Game.rooms[roomID].find(FIND_MY_SPAWNS)[0];
          SpawnQueue.addToQueue(closestSpawn, {
            priority: 'emergency',
            body: [CARRY, CARRY, MOVE],
            spawnedFrom: closestSpawn.id,
            options: {
              role: 'hauler',
            }
          });
        }
      }
    }

    private static handleConstructionSites(roomID: string): void {
      const constructionSites = Game.rooms[roomID].find(FIND_CONSTRUCTION_SITES);
      if(constructionSites.length === 0) {
        return;
      }

      console.log('Construction sites found');

      const builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder'&& creep.room.name === roomID);
      console.log(builders.length);
      if(builders.length < 5) {
        console.log('Spawning builder');
        const numberInQueue = SpawnQueue.numCreepsinQueue(roomID, 'builder');

        if(numberInQueue < 5) {
          const closestSpawn = Game.rooms[roomID].find(FIND_MY_SPAWNS)[0];
          SpawnQueue.addToQueue(closestSpawn, {
            priority: 'emergency',
            body: [WORK, CARRY, MOVE],
            spawnedFrom: closestSpawn.id,
            options: {
              role: 'builder',
            }
          });
        }
      }
    }

    private static handleSources(roomID: string): void {
      for(var source of Game.rooms[roomID].find(FIND_SOURCES)) {
        SourceHandler.run(source);
      }
    }

    private static handleFlags(roomID: string): void {
      for(var flag of Game.rooms[roomID].find(FIND_FLAGS)) {
        FlagHandler.run(flag);
      }
    }

    private static handleContainers(roomID: string): void {
      for(var container of Game.rooms[roomID].find(FIND_STRUCTURES, {
          filter: (structure) => {
            return structure.structureType === STRUCTURE_CONTAINER;
          }
        })) {
          Container.run(container as StructureContainer);
        }
    }

    private static handleControllers(roomID: string): void {
        for(var controller of Game.rooms[roomID].find(FIND_STRUCTURES, {
            filter: (structure) => {
              return structure.structureType === STRUCTURE_CONTROLLER;
            }
          })) {
            Controller.run(controller as StructureController);
          }
    }

    private static handleStorage(roomID: string): void {
      for(var storage of Game.rooms[roomID].find(FIND_STRUCTURES, {
          filter: (structure) => {
            return structure.structureType === STRUCTURE_STORAGE;
          }
        })) {
          Storage.run(storage as StructureStorage);
        }
    }

    private static handleLinks(roomID: string): void {
        //TODO: Update these methods to all take a room key.
        for(var link of Game.rooms[roomID].find(FIND_STRUCTURES, {
            filter: (structure) => {
              return structure.structureType === STRUCTURE_LINK;
            }
          })) {

            Link.run(link as StructureLink);
          }
    }

    private static handleTowers(roomID: string): void {
        for(var tower of Game.rooms[roomID].find(FIND_STRUCTURES, {
            filter: (structure) => {
              return structure.structureType === STRUCTURE_TOWER;
            }
          })) {
            Tower.run(tower as StructureTower);
          }
    }

    private static handleRamparts(roomID: string): void {
        for(var rampart of Game.rooms[roomID].find(FIND_STRUCTURES, {
            filter: (structure) => {
              return structure.structureType === STRUCTURE_RAMPART;
            }
          })) {
            Rampart.run(rampart as StructureRampart);
          }
    }
}
