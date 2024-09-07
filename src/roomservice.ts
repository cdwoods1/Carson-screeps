import { Container } from "room/container";
import { Controller } from "room/controller";
import { FlagHandler } from "room/flag";
import { Link } from "room/link";
import { Rampart } from "room/rampart";
import { Storage } from "room/storage";
import { Tower } from "room/tower";

export class RoomService {
    public static run(roomID: string): void {
        RoomService.handleLinks(roomID);
        RoomService.handleTowers(roomID);
        RoomService.handleRamparts(roomID);
        RoomService.handleStorage(roomID);
        RoomService.handleControllers(roomID);
        RoomService.handleContainers(roomID);
        RoomService.handleFlags(roomID);
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
