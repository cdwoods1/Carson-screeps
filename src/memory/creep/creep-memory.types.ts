export type BasicCreepTypes =
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
    'immigrant';


export type BaseCreepMemory = CollectorMemory;

export type CollectorMemory = {
    role: 'collector';
    room: string;
    targetContainerID?: Id<StructureContainer>;
}

export type RepairerMemory = {
    role: 'repairer';
    room: string;
    objectRepairingID?: Id<Structure>;
}

