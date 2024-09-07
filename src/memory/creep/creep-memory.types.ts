export type CreepRoles =
    'harvester' |
    'repairer' |
    'collector' |
    'extensioner' |
    'upgrader' |
    'builder' |
    'defender' |
    'claimer' |
    'sentry' |
    'healer' |
    'attacker' |
    'immigrant' |
    'hauler';


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

