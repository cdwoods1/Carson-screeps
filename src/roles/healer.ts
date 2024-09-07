import { ATTACK_THOSE_BOIS } from "main";
import { MovementUtils } from "utils/MovementUtils";

export class Healer {
    public static run(creep: Creep) {


        let attackers = _.filter(Game.creeps, (creep) => creep.memory.role == 'attacker');
        // let rangedAttackers = _.filter(Game.creeps, (creep) => creep.memory.role == 'rangedAttacker');
        let healers = _.filter(Game.creeps, (creep) => creep.memory.role == 'healer');
        if(ATTACK_THOSE_BOIS) {
            creep.memory.attack = true;
        } else {
            creep.memory.attack = false;
        }

        const creepsToHeal = creep.room.find(FIND_MY_CREEPS, { filter: (creep) => { return creep.hits < creep.hitsMax } });
        if (creepsToHeal.length > 0) {
            const healResult = creep.heal(creepsToHeal[0])
            if(healResult == ERR_NOT_IN_RANGE) {
                creep.moveTo(creepsToHeal[0], {visualizePathStyle: {stroke: '#00ff00'}});
            }
            return;
        } else {
            creep.move(MovementUtils.randomDirectionSelector())
        }
    }

}
