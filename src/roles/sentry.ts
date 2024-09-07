import { filter } from "lodash";
import { ATTACK_THOSE_BOIS } from "main";
import { isFriendlyOwner } from "utils/AttackUtils";

export class Sentry {
    public static run(creep: Creep) {
        const blueFlags = creep.room.find(FIND_FLAGS, { filter: (flag) => flag.color === COLOR_BLUE });

        const sentryFlag = Game.flags[creep.memory.targetFlag?.name ?? ''];
        if(sentryFlag) {
            Game.flags[creep.memory.targetFlag?.name ?? ''].memory.sentryCreepID = creep.id;
            if(!creep.pos.isEqualTo(sentryFlag.pos)) {
                console.log("Moving to sentry flag", sentryFlag.pos);
                console.log(creep.moveTo(sentryFlag.pos.x, sentryFlag.pos.y, {visualizePathStyle: {stroke: '#ffffff'}}));
            } else {
                creep.say('QUEEEN');
                const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {filter: (creep) => !isFriendlyOwner(creep.owner)});
                if(target) {
                    creep.rangedAttack(target);
                }
            }
        } else {
            for(const blueFlag of blueFlags) {
                if(blueFlag.memory.sentryCreepID === undefined) {
                    Game.flags[blueFlag.name].memory.sentryCreepID = creep.id;
                    creep.memory.targetFlag = blueFlag;
                    break;
                }
            }
        }


    }

}
