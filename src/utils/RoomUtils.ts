import { AutoSpawn } from "autospawn";
import { RoomService } from "roomservice";

export type RoomKeys = 'W7N5';

export class RoomUtils {
    public static myRooms = global

    public static run(): void {
        RoomUtils.findMyRooms();
        for(const roomKey of global.myRooms) {
            const room = Game.rooms[roomKey];
            if(!room) {
                continue;
            }

            const spawns = room.find(FIND_MY_SPAWNS);

            for(const spawn of spawns) {
                AutoSpawn.run(spawn.name, roomKey);
            }

            RoomService.run(roomKey);
        }
    }

    public static findMyRooms(): void {
        if(global.timeSinceRoomsChecked > 200 || !global.myRooms) {
            global.myRooms = [];
            for(const roomKey in Game.rooms) {
                const room = Game.rooms[roomKey];
                if(room.controller && room.controller.my) {
                    global.myRooms.push(roomKey);
                }
            }
            global.timeSinceRoomsChecked = 0;
        }
    }
}
