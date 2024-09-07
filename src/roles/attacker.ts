import { ATTACK_THOSE_BOIS } from "main";
import { isFriendlyOwner } from "utils/AttackUtils";

export class Attacker {
    public static run(creep: Creep) {
        const flag = Game.flags.CarsonDefense;
        const attackFlag = Game.flags.CarsonAttack;
        if(!creep.memory.attack) {
            creep.moveTo(flag, {visualizePathStyle: {stroke: '#ff0000'}});
        }

        let attackers = _.filter(Game.creeps, (creep) => creep.memory.role == 'attacker');
        // let rangedAttackers = _.filter(Game.creeps, (creep) => creep.memory.role == 'rangedAttacker');
        let healers = _.filter(Game.creeps, (creep) => creep.memory.role == 'healer');

        if(ATTACK_THOSE_BOIS === true) {
            creep.memory.attack = true;
        } else {
            creep.memory.attack = false;
        }

        if(creep.memory.attack) {
            if(creep.room !== attackFlag.room) {
                console.log("Moving to attack flag")
                creep.moveTo(attackFlag, {visualizePathStyle: {stroke: '#ff0000'}});
                return;
            }

            const hostileCreep = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {
                filter: (creep) => { return !isFriendlyOwner(creep.owner) && (creep.getActiveBodyparts(ATTACK) > 0 || creep.getActiveBodyparts(HEAL) > 0) }
            });
            if (hostileCreep) {
                const attackResult = creep.attack(hostileCreep)
                if(attackResult == ERR_NOT_IN_RANGE) {
                    creep.moveTo(hostileCreep, {visualizePathStyle: {stroke: '#ff0000'}});
                }
                return;
            }

        }
    }

}
