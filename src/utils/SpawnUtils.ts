export const BodyPartsCost: Record<BodyPartConstant, number> = {
    "move": 50,
    "work": 100,
    "carry": 50,
    "attack": 80,
    "ranged_attack": 150,
    "heal": 250,
    "tough": 10,
    "claim": 600,
};

export type CreepTypes =
    'harvester' |
    'repairer' |
    'collector' |
    'extensioner' |
    'upgrader' |
    'builder' |
    'defender' |
    'claimer' |
    'rangedAttacker' |
    'healer' |
    'attacker' |
    'immigrant'

export type GenerateCreepStats = {
    role: CreepTypes;
    partsPattern: Array<BodyPartConstant>;
    partsMax: CreepMaxMap | undefined;
    partsMin: CreepMaxMap | undefined;
}

export const CreepBaseBodyParts: Record<CreepTypes, Array<BodyPartConstant>> = {
    'harvester': [MOVE, WORK, CARRY],
    'repairer': [MOVE, WORK, CARRY],
    'collector': [MOVE, WORK, CARRY],
    'extensioner': [MOVE, WORK, CARRY],
    'upgrader': [MOVE, WORK, WORK, CARRY],
    'builder': [MOVE, WORK, WORK, CARRY],
    'defender': [MOVE, ATTACK, TOUGH],
    'claimer': [CLAIM, MOVE],
    'rangedAttacker': [MOVE, RANGED_ATTACK, RANGED_ATTACK, TOUGH, HEAL],
    'healer': [MOVE, HEAL],
    'attacker': [MOVE, ATTACK, TOUGH],
    'immigrant': [MOVE, WORK, CARRY]
}

export type CreepMax = {
    type: BodyPartConstant;
    max: number;
}

export type CreepMaxMap = Map<BodyPartConstant, number>;
//Undefined means there is no max
export const CreepMaxBodyParts: Record<CreepTypes, CreepMaxMap | undefined> = {
    'harvester': new Map([[WORK, 6], [CARRY, 3], [MOVE, 2]]),
    'repairer': new Map([[WORK, 3], [CARRY, 5], [MOVE, 3]]),
    'collector': new Map([[WORK, 2], [CARRY, 3], [MOVE, 2]]),
    'extensioner': new Map([[WORK, 1], [CARRY, 10], [MOVE, 7]]),
    'upgrader': new Map([[WORK, 8], [CARRY, 7], [MOVE, 5]]),
    'builder': new Map([[WORK, 3], [CARRY, 4], [MOVE, 7]]),
    'defender': new Map([[ATTACK, 5], [MOVE, 7], [TOUGH, 7]]),
    'claimer': new Map([[CLAIM, 1], [MOVE, 8]]),
    'rangedAttacker': new Map([[RANGED_ATTACK, 6], [MOVE, 7], [TOUGH, 7], [HEAL, 2]]),
    'healer': new Map([[HEAL, 8], [MOVE, 5], [TOUGH, 9]]),
    'attacker': new Map([[ATTACK, 8], [MOVE, 8], [TOUGH, 10]]),
    'immigrant':  new Map([[WORK, 7], [CARRY, 3], [MOVE, 8]]),
}

export const CrepeMinBodyParts: Record<CreepTypes, CreepMaxMap | undefined> = {
    'harvester': undefined,
    'repairer': undefined,
    'collector': undefined,
    'extensioner': undefined,
    'upgrader': undefined,
    'builder': undefined,
    'defender': undefined,
    'claimer': undefined,
    'rangedAttacker': new Map([[RANGED_ATTACK, 6], [MOVE, 7], [TOUGH, 9]]),
    'healer': new Map([[HEAL, 5], [MOVE, 5]]),
    'attacker': new Map([[ATTACK, 5], [MOVE, 7], [TOUGH, 15]]),
    'immigrant': undefined
}



export class SpawnUtils {
    /*
    * Returns an array of BodyPartConstants for a given archetype, and available energy.
    * TODO: make this more single responsibility by removing the available energy logic.
    * TODO: Make this more typesafe by using a type for archetype instead of a string.
    * TODO: Use factory pattern or something to get rid of the switch statements. For example, each role can be required to describe it's parts pattern.
    */
    public static getBodyPartsForArchetype(archetype: CreepTypes, energyAvailable: number): Array<BodyPartConstant> | null {
        const newCreepState: GenerateCreepStats = {
            role: archetype,
            partsPattern: CreepBaseBodyParts[archetype],
            partsMax: CreepMaxBodyParts[archetype],
            partsMin: CrepeMinBodyParts[archetype]
        }

        const parts = SpawnUtils.generateParts(newCreepState, energyAvailable);
        return parts;
    }

    private static generateParts(stats: GenerateCreepStats, energyAvailable: number): Array<BodyPartConstant> | null {
        const basePatternCost = stats.partsPattern.reduce((acc, part) => acc + BodyPartsCost[part], 0);
        const minPatternCost = stats.partsMin ?
            Array.from(stats.partsMin).reduce((acc, [part, num]) => acc + BodyPartsCost[part] * num, 0) :
            basePatternCost;
        if(minPatternCost > energyAvailable) {
            return null;
        }

        let multiplier = Math.floor(energyAvailable/basePatternCost);

        const bodyParts: Array<BodyPartConstant> = [];

        for (let partIndex = 0; partIndex < stats.partsPattern.length; partIndex++) {
            const currentPattern = stats.partsPattern[partIndex];
            const maxParts = CreepMaxBodyParts[stats.role]?.get(currentPattern);
            const numParts = multiplier > (maxParts ?? Infinity) ? maxParts ?? 1 : multiplier;
            for (let i = 0; i < numParts; i++) {
                bodyParts.push(currentPattern);
            }

        }
        return bodyParts;
    }
}
