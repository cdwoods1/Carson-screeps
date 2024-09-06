import { ATTACK_THOSE_BOIS } from "main";

export class RangedAttacker {
    public static run(creep: Creep) {
        var TEAMMATES = ["dreamlane", "ridigilis", "legendeck", "Breadboard"];
        var isFriendlyOwner = (owner: any) => { return TEAMMATES.includes(owner.username)};
        const flag = Game.flags.CarsonDefense;
        const attackFlag = Game.flags.CarsonAttack;
        if(!creep.memory.attack) {
            creep.moveTo(flag, {visualizePathStyle: {stroke: '#ff0000'}});
        }


        let attackers = _.filter(Game.creeps, (creep) => creep.memory.role == 'attacker');
        let rangedAttackers = _.filter(Game.creeps, (creep) => creep.memory.role == 'rangedAttacker');
        let healers = _.filter(Game.creeps, (creep) => creep.memory.role == 'healer');
        if(ATTACK_THOSE_BOIS) {
            creep.memory.attack = true;
        } else {
            creep.memory.attack = false;
        }

        if(creep.memory.attack) {
            if(creep.room !== attackFlag.room) {
                creep.moveTo(attackFlag);
                return;
            } else {
                // if(creep.room.controller) {
                //     creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                // }
            }
            // const claimer = creep.room.find(FIND_HOSTILE_CREEPS, { filter: (creep) => { return creep.memory.role == 'claimer' } });
            // if (claimer.length > 0) {
            //     console.log("Attacking claimer")
            //     const attackResult = creep.attack(claimer[0])
            //     if(attackResult == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(claimer[0], {visualizePathStyle: {stroke: '#ff0000'}});
            //     }
            // }
            const hostileCreeps = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, { filter: (creep) => { return !isFriendlyOwner(creep.owner) } });
            if (hostileCreeps) {
                const attackResult = creep.rangedAttack(hostileCreeps)
                if(attackResult == ERR_NOT_IN_RANGE) {
                    creep.moveTo(hostileCreeps, {visualizePathStyle: {stroke: '#ff0000'}});
                }
            }

        }
    }

}
