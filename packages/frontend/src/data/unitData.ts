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

export function unitValidForEra(unit: UnitType, eras: string[]) {
    let fullFilter = ''
    eras.forEach( (eraFilter) => {
        if (eraFilter && eraFilter != '') {
            fullFilter = fullFilter.concat(`${eraFilter},`)
        }
    })

    if (fullFilter == '') {
        return true
    }

    let show = false
    unit.unitEras?.forEach( (era) => {
        if (fullFilter.indexOf(era) >= 0) {
            show = true
        }
    })
    return show
}

export function unitValidForFaction(unit: UnitType, factions: string[]) {
    let fullFilter = ''
    factions.forEach( (factionFilter) => {
        if (factionFilter && factionFilter != '') {
            fullFilter = fullFilter.concat(`${factionFilter},`)
        }
    })

    if (fullFilter == '') {
        return true
    }

    let show = false
    unit.unitFactions?.forEach( (faction) => {
        if (fullFilter.indexOf(faction) >= 0) {
            show = true
        }
    })
    return show
}

export function unitValidForFactionEra(unit: UnitType, faction: string[], era: string[]) {
    // @ts-ignore
    let factionEraKey = faction[0] + ":" + eraData[era[0]]?.eraTitle
    // @ts-ignore
    return (eraFactionData['factionEras'][factionEraKey]?.includes(unit.mechId))
}

export function getUnitNames() {
    return Object.keys(mechData).sort()
}

export function getUnitData() : {} {
    return mechData
}