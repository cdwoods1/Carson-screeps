import { isFriendlyOwner } from "utils/AttackUtils";

export class Tower {
    public static run(tower: StructureTower): void {
        var hostileCreepsWithHealing = tower.room.find(FIND_HOSTILE_CREEPS, {
            filter: (creep) => {
                return !isFriendlyOwner(creep.owner) && (
                creep.getActiveBodyparts(HEAL) > 2 &&
                creep.getActiveBodyparts(TOUGH) < 10 ||
                creep.getActiveBodyparts(ATTACK) > 0
            )}
        });
        if(hostileCreepsWithHealing.length > 0) {
            tower.attack(hostileCreepsWithHealing[0]);
            return;
        }

        var hostileAttackCreep = tower
            .pos
            .findClosestByRange(FIND_HOSTILE_CREEPS, {
                filter: (creep) => {
                    return !isFriendlyOwner(creep.owner) && (creep.getActiveBodyparts(ATTACK) > 4 || creep.getActiveBodyparts(RANGED_ATTACK) > 4);
                }
            });
        if(hostileAttackCreep) {
            tower.attack(hostileAttackCreep);
            return;
        }

        var hostileCreeps = tower.room.find(FIND_HOSTILE_CREEPS, { filter: (creep) => { return !isFriendlyOwner(creep.owner) } });
        if (hostileCreeps.length > 0) {
            console.log("we're under attack!")
            tower.attack(hostileCreeps[0])
            return;
        }

        var damagedCreeps = tower.room.find(FIND_MY_CREEPS, { filter: (creep) => { return creep.hits < creep.hitsMax * .6 } });
        if (damagedCreeps.length > 0) {
            tower.heal(damagedCreeps[0]);
            return;
        }

        var damagedStructures = tower.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.hits < structure.hitsMax * .5 && structure.structureType !== STRUCTURE_WALL && structure.structureType !== STRUCTURE_RAMPART;
            }
        });
        if(damagedStructures.length > 0) {
            tower.repair(damagedStructures[0]);
        }

        var damagaedRamparts = tower.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType === STRUCTURE_RAMPART && structure.hits < 10000;
            }
        });
        if(damagaedRamparts.length > 0) {
            tower.repair(damagaedRamparts[0]);
        }
    }
}
