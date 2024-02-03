import { UnitType } from '../types/unit.ts'

import eraFactionData from '../data/mul_mech_era_faction.json'
import mechData from '../data/merged_mech_data.json'

export function getFactions() {
    return Object.keys(eraFactionData.factions).sort()
}
export function getEras() {
    return Object.keys(eraFactionData.eras).sort()
}

export function unitValidForEra(unit: UnitType, era: string) {
    // @ts-ignore
    return (eraFactionData['eras'][era]?.includes(unit.mechId))
}

export function unitValidForFaction(unit: UnitType, faction: string) {
    // @ts-ignore
    return (eraFactionData['factions'][faction]?.includes(unit.mechId))
}

export function unitValidForFactionEra(unit: UnitType, faction: string, era: string) {
    let factionEraKey = faction + ":" + era
    // @ts-ignore
    return (eraFactionData['factionEras'][factionEraKey]?.includes(unit.mechId))
}

export function getUnitNames() {
    return Object.keys(mechData).sort()
}

export function getUnitData() {
    return mechData
}