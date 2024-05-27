import { MovementUtils } from "utils/MovementUtils";

export class Defender {
    public static run(creep: Creep): void {
            var hostileCreeps = creep.room.find(FIND_HOSTILE_CREEPS);
            if (hostileCreeps.length > 0) {
                console.log("we're under attack!")
                const attackResult = creep.attack(hostileCreeps[0])
                if(attackResult == ERR_NOT_IN_RANGE) {
                        creep.moveTo(hostileCreeps[0], {visualizePathStyle: {stroke: '#ff0000'}});
                }
            } else
                creep.move(MovementUtils.randomDirectionSelector())
            }
        }
