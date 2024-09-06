import { Controller } from "room/controller";
import { Link } from "room/link";
import { Rampart } from "room/rampart";
import { Storage } from "room/storage";
import { Tower } from "room/tower";

export class RoomService {
    public static run(roomID: RoomKeys): void {
        RoomService.handleLinks(roomID);
        RoomService.handleTowers(roomID);
        RoomService.handleRamparts(roomID);
        RoomService.handleStorage(roomID);
        RoomService.handleControllers(roomID);
    }

    private static handleControllers(roomID: RoomKeys): void {
        for(var controller of Game.rooms[roomID].find(FIND_STRUCTURES, {
            filter: (structure) => {
              return structure.structureType === STRUCTURE_CONTROLLER;
            }
          })) {
            Controller.run(controller as StructureController);
          }
    }

    private static handleStorage(roomID: RoomKeys): void {
      for(var storage of Game.rooms[roomID].find(FIND_STRUCTURES, {
          filter: (structure) => {
            return structure.structureType === STRUCTURE_STORAGE;
          }
        })) {
          Storage.run(storage as StructureStorage);
        }
    }

    private static handleLinks(roomID: RoomKeys): void {
        //TODO: Update these methods to all take a room key.
        for(var link of Game.rooms[roomID].find(FIND_STRUCTURES, {
            filter: (structure) => {
              return structure.structureType === STRUCTURE_LINK;
            }
          })) {

            Link.run(link as StructureLink);
          }
    }

    private static handleTowers(roomID: RoomKeys): void {
        for(var tower of Game.rooms[roomID].find(FIND_STRUCTURES, {
            filter: (structure) => {
              return structure.structureType === STRUCTURE_TOWER;
            }
          })) {
            Tower.run(tower as StructureTower);
          }
    }

    private static handleRamparts(roomID: RoomKeys): void {
        for(var rampart of Game.rooms[roomID].find(FIND_STRUCTURES, {
            filter: (structure) => {
              return structure.structureType === STRUCTURE_RAMPART;
            }
          })) {
            Rampart.run(rampart as StructureRampart);
          }
    }
}
