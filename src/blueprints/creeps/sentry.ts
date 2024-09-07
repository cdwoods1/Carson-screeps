import { CreepTypes } from "./squadron-creep.types";

export class SentryCreep {
    public static creepType: CreepTypes = "sentry";

    public static body: BodyPartConstant[] = [
       MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK
    ]
}
