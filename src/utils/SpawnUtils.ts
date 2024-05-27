export class SpawnUtils {
    /*
    * Returns an array of BodyPartConstants for a given archetype, and available energy.
    * TODO: make this more single responsibility by removing the available energy logic.
    * TODO: Make this more typesafe by using a type for archetype instead of a string.
    * TODO: Use factory pattern or something to get rid of the switch statements. For example, each role can be required to describe it's parts pattern.
    */
    public static getBodyPartsForArchetype(archetype: string, energyAvailable: number): Array<BodyPartConstant> | null {
        let partsPattern = new Array<BodyPartConstant>();
        let bodyParts = new Array<BodyPartConstant>();
        let patternCost = 0;
        switch(archetype) {
            case 'builder':
            case 'harvester':
            case 'upgrader':
                partsPattern = [MOVE, WORK, CARRY];
                patternCost = 200;
                break;
            case 'defender':
                partsPattern = [MOVE, ATTACK];
                patternCost = 130;
                break;
        }
        let multiplier = Math.floor(energyAvailable/patternCost)
        if (multiplier > 0) {
            for (let partIndex = 0; partIndex < partsPattern.length; partIndex++) {
                for (let i = 0; i < multiplier; i++) {
                    bodyParts.push(partsPattern[partIndex]);
                }
            }

            return bodyParts;
        } else {
            return null;
        }

    }
}
