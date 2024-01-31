import { UnitType } from './unit.ts'
import { calculateBV } from '../lib/battletech.ts'

export interface ForceUnit {
    id: string,
    unit: UnitType,
    gunnerySkill: number,
    pilotSkill: number,
    alphaSkill: number,
}

export class ForceType {
    units: ForceUnit[]


    constructor(units?: ForceUnit[]) {
        this.units = units || []
    }

    calculateBV(): number {
        let total = 0
        this.units.forEach((fUnit) => {
            total += calculateBV(fUnit.unit.bv || '0', fUnit.gunnerySkill, fUnit.pilotSkill)
        })

        return Math.round(total)
    }
}