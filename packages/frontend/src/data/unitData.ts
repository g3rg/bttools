import { UnitType } from '../types/unit.ts'

import eraFactionData from '../data/mul_mech_era_faction.json'
import eraData from '../data/mul_era.json'
import mechData from '../data/merged_mech_data.json'

export function getFactions() {
    return Object.keys(eraFactionData.factions).sort()
}
export function getEras() {
    // return Object.keys(eraFactionData.eras).sort()
    return Object.keys(eraData).sort( (era1, era2) => {
        // @ts-ignore
        if (eraData[era1]['eraYears'] <= (eraData[era2]['eraYears'])) {
            return -1
        } else {
            return 1
        }
    })
}

export function unitValidForEra(unit: UnitType, era: string) {
    // @ts-ignore
    return (eraFactionData['eras'][eraData[era].eraTitle]?.includes(unit.mechId))
}

export function unitValidForFaction(unit: UnitType, faction: string) {
    // @ts-ignore
    return (eraFactionData['factions'][faction]?.includes(unit.mechId))
}

export function unitValidForFactionEra(unit: UnitType, faction: string, era: string) {
    // @ts-ignore
    let factionEraKey = faction + ":" + eraData[era]?.eraTitle
    // @ts-ignore
    return (eraFactionData['factionEras'][factionEraKey]?.includes(unit.mechId))
}

export function getUnitNames() {
    return Object.keys(mechData).sort()
}

export function getUnitData() : {} {
    return mechData
}