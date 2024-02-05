import { UnitType } from './unit.ts'

export interface ForceUnit {
    id: string,
    unit: UnitType,
    gunnerySkill: number,
    pilotSkill: number,
    alphaSkill: number,
}

export class ForceType {
    units?: ForceUnit[]
    name?: string
    description?: string
    guid?: string
    createTime?: string
    updateTime?: string
}

export interface ForceUnitExport {
    id: string,
    mechId: string,
    name: string,
    chassis: string,
    variant: string,
    gunnerySkill: number,
    pilotSkill: number
}

export interface ForceTypeExport {
    units?: ForceUnitExport[]
}