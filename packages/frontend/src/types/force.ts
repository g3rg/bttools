import { UnitType } from './unit.ts'

export interface ForceUnit {
    id: number,
    unit: UnitType,
    gunnerySkill: number,
    pilotSkill: number,
    alphaSkill: number,
}

export interface ForceType {
    units: ForceUnit[]
}