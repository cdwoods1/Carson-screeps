import { isFriendlyOwner } from "utils/AttackUtils";
import { MovementUtils } from "utils/MovementUtils";

export class Defender {

    public static run(creep: Creep): void {
        var hostileCreep = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, { filter: (creep) => { return !isFriendlyOwner(creep.owner) } });
            if (hostileCreep) {
                console.log("we're under attack!")
                const attackResult = creep.attack(hostileCreep)
                if(attackResult == ERR_NOT_IN_RANGE) {
                        creep.moveTo(hostileCreep, {visualizePathStyle: {stroke: '#ff0000'}});
                }
            } else
                creep.move(MovementUtils.randomDirectionSelector())
            }
        }
