import { AutoSpawn } from "autospawn";
import { RoomService } from "roomservice";

export type RoomKeys = 'W7N5';

export class RoomUtils {
    public static myRooms: RoomKeys[] = ['W7N5'];

    public static run(): void {
        for(const roomKey of RoomUtils.myRooms) {
            const room = Game.rooms[roomKey];
            if(!room) {
                continue;
            }

            const spawns = room.find(FIND_MY_SPAWNS);
            if(spawns.length === 0) {
                continue;
            }

            for(const spawn of spawns) {
                AutoSpawn.run(spawn.name, roomKey as RoomKeys);
            }

            RoomService.run(roomKey as RoomKeys);
        }
    }
}
