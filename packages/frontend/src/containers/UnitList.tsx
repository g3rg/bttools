import { useEffect, useState } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import { Offcanvas, Dropdown, Table, Row, Col, Toast, ToastContainer } from 'react-bootstrap'
import { useAppContext } from '../lib/contextLib'
import { UnitType } from '../types/unit.ts'
import {ForceType, ForceUnit, ForceUnitExport} from '../types/force.ts'
import './UnitList.css'
import { Form } from 'react-bootstrap'
import { v4 as uuidv4 } from 'uuid'

import UnitDetail from './UnitDetail.tsx'
import ForceList from './ForceList.tsx'

import {BV_Pilot_Adjustments, calculateForceBV} from '../lib/battletech.ts'

import {
    getFactions,
    getEras,
    unitValidForFactionEra,
    unitValidForFaction,
    unitValidForEra,
    getUnitNames, getUnitData,
    getUnit
} from '../data/unitData.ts'

import Button from "react-bootstrap/Button"
import { FaPlus } from "react-icons/fa"

const MUL_UnitDetail_URL = `https://masterunitlist.info/Unit/Details/{id}`
const Flechs_UnitDetail_URL = `https://sheets.flechs.net/?s={mechName}`
const Sarna_URL = `https://www.sarna.net/wiki/{mechChassis}`

const MAX_BV = 5000
const MAX_PV = 100

let mechNames = getUnitNames()

const roles = [
    '',
    'Ambusher',
    'Brawler',
    'Juggernaut',
    'Missile Boat',
    'None',
    'Skirmisher',
    'Sniper',
    'Striker',
    'Scout',
]

const rules = [
    '',
    'Introductory',
    'Standard',
    'Advanced',
    'Experimental',
    'Unknown'
]

const techBases = [
    '',
    'Inner Sphere',
    'Clan',
    'Mixed',
]

function adjustBV(bv: string|undefined, gunSkill:number, pilotSkill:number) {
    const unitBV = Math.round(parseInt(bv?.replace(',','') || "0") *
        BV_Pilot_Adjustments[gunSkill][pilotSkill])
    return unitBV
}

export default function UnitList() {
    const { isAuthenticated } = useAppContext()
    const [isLoading, setIsLoading] = useState(true)
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
    const [showForce, setShowForce] = useState(false)
    const [showToast, setShowToast] = useState(false)
    const [toastTitle, setToastTitle] = useState('')
    const [toastMessage, setToastMessage] = useState('')

    const [rowCount, setRowCount] = useState(getUnitNames().length)

    const handleShowAdvancedFilters = () => setShowAdvancedFilters(true)
    const handleHideAdvancedFilters = () => setShowAdvancedFilters(false)

    const handleShowForce = () => setShowForce(true)
    const handleHideForce = () => setShowForce(false)

    const [currentUnit, setCurrentUnit] = useState<UnitType>()

    const [unitFilter, setUnitFilter] = useState("")
    const [minTonFilter, setMinTonFilter] = useState(0)
    const [maxTonFilter, setMaxTonFilter] = useState(100)
    const [mechwarriorGunnerySkill, setMechwarriorGunnerySkill] = useState(4)
    const [mechwarriorPilotSkill, setMechwarriorPilotSkill] = useState(5)
    const [minBVFilter, setMinBVFilter] = useState(0)
    const [maxBVFilter, setMaxBVFilter] = useState(MAX_BV)
    const [minPVFilter, setMinPVFilter] = useState(0)
    const [maxPVFilter, setMaxPVFilter] = useState(MAX_PV)
    const [roleFilter, setRoleFilter] = useState("")
    const [ruleFilter, setRuleFilter] = useState("")

    // advanced filters
    const [factionFilter, setFactionFilter] = useState<string[]>([])
    const [eraFilter, setEraFilter] = useState<string[]>([])


    const [techBaseFilter, setTechBaseFilter] = useState("")
    const [engineFilter, setEngineFilter] = useState("")
    const [structureFilter, setStructureFilter] = useState("")
    const [heatFilter, setHeatFilter] = useState("")
    const [walkFilter, setWalkFilter] = useState("")
    const [jumpFilter, setJumpFilter] = useState("")
    const [armorTypeFilter, setArmorTypeFilter] = useState("")
    const [armorPointsFilter, setArmorPointsFilter] = useState("")
    const [weaponFilter, setWeaponFilter] = useState("")

    const [force, setForce] = useState<ForceType>({ units:[] })

    function setForceAndStore( force: ForceType) {
        setForce(force)
        localStorage.setItem("force", JSON.stringify(force))
    }

    useEffect(() => {
        async function onLoad() {
            // TODO Load 'force' from local storage
            let localForce = localStorage.getItem('force')
            if (localForce) {
                let forceData = JSON.parse(localForce)
                setForceAndStore({ units: forceData.units || [] })
            }

            if (!isAuthenticated) {
                setIsLoading(false)
                return
            }
            setIsLoading(false)
        }

        onLoad()
    }, [isAuthenticated])

    useEffect( () => {
        // @ts-ignore
        let rowCount = document.getElementById("unitTable")?.tBodies[0].rows.length;
        if (rowCount && rowCount != '')
            setRowCount(rowCount);
    }, [unitFilter, minTonFilter, maxTonFilter, minBVFilter, maxBVFilter, minPVFilter, maxPVFilter,
        roleFilter, ruleFilter, factionFilter, eraFilter, techBaseFilter, engineFilter, structureFilter, heatFilter,
        walkFilter, jumpFilter, armorTypeFilter, armorPointsFilter, weaponFilter, force])

    function doFilter(unit: UnitType) {
        let show = true

        if (unitFilter !== "" && !(unit.mechName.toLowerCase().indexOf(unitFilter.toLowerCase()) >= 0)) {
            show = false
        }

        if (show && minTonFilter > 0) {
            let minTons = minTonFilter
            let unitTons = parseInt(unit.tons?.trim() || "50")
            if (unitTons < minTons) {
                show = false
            }
        }
        if (show && maxTonFilter < 100) {
            let maxTons = maxTonFilter
            let unitTons = parseInt(unit.tons?.trim() || "50")
            if (unitTons > maxTons) {
                show = false
            }
        }
        if (show && minBVFilter > 0) {
            let minBV = minBVFilter
            if (adjustBV(unit.bv, mechwarriorGunnerySkill, mechwarriorPilotSkill) < minBV) {
                show = false
            }
        }
        if(show && maxBVFilter < MAX_BV) {
            let maxBV = maxBVFilter
            if (adjustBV(unit.bv, mechwarriorGunnerySkill, mechwarriorPilotSkill) > maxBV) {
                show = false
            }
        }
        if (show && minPVFilter > 0) {
            let minPV = minPVFilter
            let unitPV = parseInt(unit.pv?.replace(',','') || "0")
            if (unitPV < minPV) {
                show = false
            }
        }
        if (show && maxPVFilter < MAX_PV) {
            let maxPV = maxPVFilter // Todo as above
            if (parseInt(unit.pv?.replace(',','') || "0") > maxPV) {
                show = false
            }
        }
        if (show && roleFilter !== "") {
            let unitRole = unit.role
            if (unitRole !== roleFilter) {
                show = false
            }
        }
        if (show && ruleFilter !== "") {
            let unitRule = unit.rules
            if (unitRule !== ruleFilter) {
                show = false
            }
        }

        const filterHasValueToApply = (filter: string[]) => {
            return (filter.join('').length != 0)
        }

        if (show && filterHasValueToApply(factionFilter) && filterHasValueToApply(eraFilter)) {
            if (!unitValidForFactionEra(unit, factionFilter, eraFilter)) {
                show = false
            }
        } else {
            if (show && filterHasValueToApply(factionFilter)) {
                if (!unitValidForFaction(unit, factionFilter)) {
                    show = false
                }
            }
            if (show && filterHasValueToApply(eraFilter)) {
                if (!unitValidForEra(unit, eraFilter)) {
                    show = false
                }
            }
        }

        if (show && techBaseFilter !== "") {
            let techBase = unit.techbase || ''
            if (!(techBase.toLowerCase().indexOf(techBaseFilter.toLowerCase()) >=0)) {
                show = false
            }
        }
        if (show && engineFilter !== "") {
            let unitEngine = unit.engine || ''
            if (!(unitEngine.toLowerCase().indexOf(engineFilter.toLowerCase()) >=0)) {
                show = false
            }
        }
        if (show && structureFilter !== "") {
            let unitStructure = unit.structure || ''
            if (!(unitStructure.toLowerCase().indexOf(structureFilter.toLowerCase()) >=0)) {
                show = false
            }
        }
        if (show && heatFilter !== "") {
            let unitHeat = unit?.heatSinks?.count + ' ' + unit?.heatSinks?.type
            if (!(unitHeat.toLowerCase().indexOf(heatFilter.toLowerCase()) >=0)) {
                show = false
            }
        }
        if (show && walkFilter !== "") {
            let minWalk = parseInt(walkFilter)
            let unitWalk = parseInt(unit.walkMP || '0')
            if (minWalk > unitWalk) {
                show = false
            }
        }
        if (show && jumpFilter !== "") {
            let minJump = parseInt(jumpFilter)
            let unitJump = parseInt(unit.jumpMP || '0')
            if (minJump > unitJump) {
                show = false
            }
        }
        if (show && armorTypeFilter !== "") {
            let unitArmorType = unit.armorType || ''
            if (!(unitArmorType.toLowerCase().indexOf(armorTypeFilter.toLowerCase()) >=0)) {
                show = false
            }
        }
        if (show && armorPointsFilter !== "") {
            let minArmor = parseInt(armorPointsFilter)
            let unitArmor = unit.armorPoints || 0
            if (minArmor > unitArmor) {
                show = false
            }
        }
        if (show && weaponFilter !== "") {
            let unitWeapons = JSON.stringify(unit.weapons || '').replace(' ', '')
            if (!(unitWeapons.toLowerCase().indexOf(weaponFilter.toLowerCase()) >=0)) {
                show = false
            }
        }

        return show
    }

    function renderLinks(unit: UnitType) {
        let mechName = unit.mechName || ''
        let mulId = unit.mechId || '0'
        let mechChassis = unit.chassis || ''
        return (
            <Dropdown>
                <Dropdown.Toggle></Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item target="_blank" href={MUL_UnitDetail_URL.replace('{id}', mulId)}>Master Unit List</Dropdown.Item>
                    <Dropdown.Item target="_blank" href={Flechs_UnitDetail_URL.replace('{mechName}', mechName)}>Flechs Sheets</Dropdown.Item>
                    <Dropdown.Item target="_blank" href={Sarna_URL.replace('{mechChassis}', mechChassis)}>Sarna</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        )
    }

    function addUnitToForce(unit: UnitType) {
        let newForce = { ... force}
        if (!newForce.units) {
            newForce.units = []
        }
        let fUnit = {
            id: uuidv4(),
            unit: unit,
            gunnerySkill: mechwarriorGunnerySkill,
            pilotSkill: mechwarriorPilotSkill,
            alphaSkill: 4,
        }
        newForce.units.push(fUnit)
        setForceAndStore(newForce)
    }

    function setAndShowToast(title: string, message: string, autoDismiss: boolean = false) {
        setToastTitle(title)
        setToastMessage(message)
        setShowToast(true)
        if (autoDismiss) {
            setTimeout( ()=> { setShowToast(false)}, 3000)
        }
    }


    function copyForceToClipboard() {
        // TODO Include force name etc when that is implemented
        let units : ForceUnitExport[] = []
        let exportForce = { units }
        force.units?.forEach( (forceUnit) => {
            exportForce.units.push( {
                id: forceUnit.id,
                mechId: forceUnit.unit.mechId || '',
                name: forceUnit.unit.mechName,
                chassis: forceUnit.unit.chassis || '',
                variant: forceUnit.unit.variant || '',
                gunnerySkill: forceUnit.gunnerySkill,
                pilotSkill: forceUnit.pilotSkill
            })
        })
        navigator.clipboard.writeText(JSON.stringify(exportForce)).then(()=>setAndShowToast('Force','Force copied to clipboard', true))
    }

    function addUnitsFromClipboard() {

        navigator.clipboard.readText().then( (clipText) => {
            let errors = []
            let newForce = { units: [], ... force}
            try {
                let clipForce = JSON.parse(clipText)
                if (!clipForce['units']) {
                    errors.push('Clipboard did not contain a valid force')
                } else {

                    clipForce?.units?.forEach( (forceUnit: ForceUnitExport) => {
                        let unitName = forceUnit.chassis + ' ' + forceUnit.variant
                        // @ts-ignore
                        let unitDetails = getUnit(unitName)
                        if (unitDetails && unitDetails?.mechId == forceUnit.mechId) {
                            // @ts-ignore
                            let unit: UnitType = getUnit(unitName)
                            let fUnit = {
                                id: uuidv4(),
                                unit: unit,
                                gunnerySkill: forceUnit.gunnerySkill,
                                pilotSkill: forceUnit.pilotSkill,
                                alphaSkill: 4,
                            }
                            newForce.units.push(fUnit)
                        } else {
                            errors.push(`Invalid unit found: ${unitName} - ${forceUnit?.mechId})`)
                        }
                    })
                    if (errors.length == 0)
                        setForceAndStore(newForce)
                }
            } catch (e) {
                console.log("Error loading from clipboard")
                console.log(e)
                errors.push("There was an error loading from clipboard or Clipboard did not contain a valid force")
            }
            if (errors.length > 0) {
                setAndShowToast('Error Adding from Clipboard', errors.join('<br/>'))
            }

        })
    }

    function loadForceFromClipboard() {
        navigator.clipboard.readText().then( (clipText) => {
            let errors = []
            let units: ForceUnit[] = []
            let newForce = { units }
            try {
                let clipForce = JSON.parse(clipText)
                if (!clipForce['units']) {
                    errors.push('Clipboard did not contain a valid force')
                } else {

                    clipForce?.units?.forEach( (forceUnit: ForceUnitExport) => {
                        let unitName = forceUnit.chassis + ' ' + forceUnit.variant
                        // @ts-ignore
                        let unitDetails = getUnit(unitName)
                        if (unitDetails && unitDetails?.mechId == forceUnit.mechId) {
                            // @ts-ignore
                            let unit: UnitType = getUnit(unitName)
                            let fUnit = {
                                id: uuidv4(),
                                unit: unit,
                                gunnerySkill: forceUnit.gunnerySkill,
                                pilotSkill: forceUnit.pilotSkill,
                                alphaSkill: 4,
                            }
                            newForce.units.push(fUnit)
                        } else {
                            errors.push(`Invalid unit found: ${unitName} - ${forceUnit?.mechId})`)
                        }
                    })
                    if (errors.length == 0)
                        setForceAndStore(newForce)
                }
            } catch (e) {
                console.log("Error loading from clipboard")
                console.log(e)
                errors.push("There was an error loading from clipboard or Clipboard did not contain a valid force")
            }
            if (errors.length > 0) {
                setAndShowToast('Error Loading from Clipboard', errors.join('<br/>'))
            }

        })
    }

    function removeUnitFromForce(unit: ForceUnit) {
        let units: ForceUnit[] = []
        force.units?.forEach( (fUnit) => {
            if (unit.id != fUnit.id) {
                units.push(fUnit)
            }
        })
        let newForce = { units }
        setForceAndStore(newForce)
    }

    function updateForceUnitGunnery(id: string, newSkill: number) {
        let units: ForceUnit[] = []
        force.units?.forEach((fUnit) => {
            if (id == fUnit.id) {
                fUnit.gunnerySkill = newSkill
            }
            units.push(fUnit)
        })

        let newForce = { units }
        setForceAndStore(newForce)
    }

    function updateForceUnitPilot(id: string, newSkill: number) {
        let units: ForceUnit[] = []
        force.units?.forEach((fUnit) => {
            if (id == fUnit.id) {
                fUnit.pilotSkill = newSkill
            }
            units.push(fUnit)
        })

        let newForce = { units }
        setForceAndStore(newForce)
    }

    function renderAddToForce(unit: UnitType) {
        return (
            <Button onClick={()=> addUnitToForce(unit)}><FaPlus/></Button>
        )
    }

    function renderUnitList(units: { [mechName:string] : UnitType }) {

        return (
            <>
                { renderUnitDetailPanel() }
                <Table id="unitTable" striped bordered hover size="sm" responsive="sm">
                    <thead>
                    <tr>
                        <th>
                            Unit
                            <Form.Control type="text" value={unitFilter} onChange={(e) =>
                                setUnitFilter(e.target.value)}/>
                        </th>
                        <th>Tons</th>
                        <th>BV ({mechwarriorGunnerySkill}/{mechwarriorPilotSkill})</th>
                        <th>PV</th>
                        <th>Role</th>
                        <th>Rules</th>
                        <th>Intro</th>
                        <th>Links</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {mechNames.map( (key,index) => {
                        let unit = units[key]
                        if (doFilter(unit)) {
                            return (
                                <tr key={index}>
                                    <td onClick={() => setCurrentUnit(unit)}>{unit.mechName}</td>
                                    <td>{unit.tons}</td>
                                    <td>{adjustBV(unit?.bv, mechwarriorGunnerySkill,mechwarriorPilotSkill)}</td>
                                    <td>{unit.pv}</td>
                                    <td>{unit.role}</td>
                                    <td>{unit.rules}</td>
                                    <td>{unit.intro}</td>
                                    <td>{ renderLinks(unit) }</td>
                                    <td>{ renderAddToForce(unit) }</td>
                                </tr>)
                        } else {
                            return (<></>)
                        }
                    })}
                    </tbody>
                </Table>
            </>
        )
    }

    function renderUnits() {
        return (
            <div className="units">
                <ListGroup>{!isLoading && renderUnitList(getUnitData())}</ListGroup>
            </div>
        )
    }

    function summariseFilters() {
        let filterSummary = ''
        if (factionFilter) {
            filterSummary += ` Faction (${factionFilter}), `
        }
        if (eraFilter) {
            filterSummary += ` Era (${eraFilter}), `
        }
        if (techBaseFilter) {
            filterSummary += ` Tech (${techBaseFilter}), `
        }
        if (roleFilter) {
            filterSummary += ` Role (${roleFilter}), `
        }
        if (ruleFilter) {
            filterSummary += ` Rule (${ruleFilter}), `
        }
        if (minTonFilter > 0 || maxTonFilter < 100) {
            filterSummary += ` Tons ${minTonFilter} to ${maxTonFilter}, `
        }
        if (minBVFilter > 0 || maxBVFilter < MAX_BV) {
            filterSummary += ` BV ${minBVFilter} to ${maxBVFilter}, `
        }
        if (minPVFilter > 0 || maxPVFilter < MAX_PV) {
            filterSummary += ` PV ${minPVFilter} to ${maxPVFilter}, `
        }
        if (engineFilter) {
            filterSummary += ` Engine (${engineFilter}), `
        }
        if (structureFilter) {
            filterSummary += ` Structure (${structureFilter}), `
        }
        if (heatFilter) {
            filterSummary += ` HeatSinks (${heatFilter}), `
        }
        if (walkFilter) {
            filterSummary += ` Min Walk (${walkFilter}), `
        }
        if (jumpFilter) {
            filterSummary += ` Min Jump (${jumpFilter}), `
        }
        if (armorTypeFilter) {
            filterSummary += ` Armor Type(${armorTypeFilter}), `
        }
        if (armorPointsFilter) {
            filterSummary += ` Armor Points(${armorPointsFilter}), `
        }
        if (weaponFilter) {
            filterSummary += ` Weapons (${weaponFilter}), `
        }

        return `${filterSummary.trim()}`
    }


    function clearFilters() {
        setUnitFilter("")
        setMinTonFilter(0)
        setMaxTonFilter(100)
        setMechwarriorGunnerySkill(4)
        setMechwarriorPilotSkill(5)
        setMinBVFilter(0)
        setMaxBVFilter(MAX_BV)
        setMinPVFilter(0)
        setMaxPVFilter(MAX_PV)
        setRoleFilter("")
        setRuleFilter("")
        setFactionFilter([])
        setEraFilter([])
        setTechBaseFilter("")
        setEngineFilter("")
        setStructureFilter("")
        setHeatFilter("")
        setWalkFilter("")
        setJumpFilter("")
        setArmorTypeFilter("")
        setArmorPointsFilter("")
        setWeaponFilter("")
        return undefined
    }

    function renderFilters() {
        return (<>
            <Button onClick={handleShowForce} size="sm">Force</Button>&nbsp;&nbsp;
            <Button onClick={handleShowAdvancedFilters} size="sm">Filters</Button>
            &nbsp;&nbsp;Rows { rowCount }, Force: { force.units?.length } units, { calculateForceBV(force) }<br/>
            <br/>
            &nbsp;Active Filters: {summariseFilters()}

            <Offcanvas show={showAdvancedFilters} onHide={handleHideAdvancedFilters}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Filters</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Button onClick={clearFilters} size='sm'>Clear Filters</Button><br/>
                    Faction:
                    <Form.Select value={factionFilter} onChange={(e) => setFactionFilter( [ e.target.value ])}>
                        <option key={0}></option>
                        {
                            getFactions().map((faction, index) => (
                                <option key={index+1}>{faction || ''}</option>
                        ))}
                    </Form.Select>
                    <Form.Select hidden value={factionFilter} multiple onChange={(e) =>
                        //@ts-ignore
                        setFactionFilter([].slice.call(e.target.selectedOptions).map(item => item.value))
                    }>
                        <option key={0}></option>
                        {
                            getFactions().map((faction, index) => (
                                <option key={index+1}>{faction || ''}</option>
                            ))}
                    </Form.Select>
                    Era:
                    <Form.Select value={eraFilter} multiple onChange={(e) => {
                        //@ts-ignore
                        setEraFilter([].slice.call(e.target.selectedOptions).map(item => item.value))
                        }
                    }>
                        <option key={0}></option>
                        {
                            getEras().map((era, index) => (
                                <option key={index+1}>{era || ''}</option>
                            ))}
                    </Form.Select>
                    TechBase:
                    <Form.Select value={techBaseFilter} onChange={(e) =>
                        setTechBaseFilter(e.target.value)
                    }>
                        {
                            techBases.map((techBase, index) => (
                                <option key={index}>{techBase || ''}</option>
                            ))}
                    </Form.Select>
                    Role:
                    <Form.Select value={roleFilter} onChange={(e) =>
                            setRoleFilter(e.target.value)
                        }>
                            {
                                roles.map((role, index) => (
                                    <option key={index}>{role || ''}</option>
                                ))}
                    </Form.Select>
                    Rules:
                    <Form.Select value={ruleFilter} onChange={(e) =>
                            setRuleFilter(e.target.value)
                        }>
                            {rules.map((rule, index) => (
                                <option key={index}>{rule || ''}</option>
                            ))}
                    </Form.Select>

                    Tons:
                    Min: {minTonFilter}
                    <Form.Range step="5" value={minTonFilter} onChange={(e) =>
                        setMinTonFilter(parseInt(e.target.value))}></Form.Range>
                    Max: {maxTonFilter}
                    <Form.Range step="5" value={maxTonFilter} onChange={(e) =>
                        setMaxTonFilter(parseInt(e.target.value))}></Form.Range>
                    Mechwarrior:
                    <Row>
                        <Col>
                            <Form.Select size="sm" value={mechwarriorGunnerySkill} onChange={(e) =>
                                setMechwarriorGunnerySkill(parseInt(e.target.value))} >
                                <option>0</option><option>1</option><option>2</option>
                                <option>3</option><option>4</option><option>5</option>
                                <option>6</option><option>7</option><option>8</option>
                            </Form.Select>
                        </Col>
                        <Col>
                        <Form.Select size="sm" value={mechwarriorPilotSkill} onChange={(e) =>
                            setMechwarriorPilotSkill(parseInt(e.target.value))} >
                            <option>0</option><option>1</option><option>2</option>
                            <option>3</option><option>4</option><option>5</option>
                            <option>6</option><option>7</option><option>8</option>
                        </Form.Select>
                        </Col>
                    </Row>
                    BV Min: {minBVFilter}
                    <Form.Range step="100" value={minBVFilter} max={MAX_BV} onChange={(e) =>
                        setMinBVFilter(parseInt(e.target.value))}></Form.Range>
                    BV Max: {maxBVFilter}
                    <Form.Range step="100" value={maxBVFilter} max={MAX_BV} onChange={(e) =>
                        setMaxBVFilter(parseInt(e.target.value))}></Form.Range>
                    PV Min: {minPVFilter}
                    <Form.Range step="5" value={minPVFilter} max={MAX_PV} onChange={(e) =>
                        setMinPVFilter(parseInt(e.target.value))}></Form.Range>
                    PV Max: {maxPVFilter}
                    <Form.Range step="5" value={maxPVFilter} max={MAX_PV} onChange={(e) =>
                        setMaxPVFilter(parseInt(e.target.value))}></Form.Range>

                    Engine:
                    <Form.Control type="text" value={engineFilter} onChange={(e) =>
                        setEngineFilter(e.target.value)}/>
                    Structure:
                    <Form.Control type="text" value={structureFilter} onChange={(e) =>
                        setStructureFilter(e.target.value)}/>
                    Heatsinks:
                    <Form.Control type="text" value={heatFilter} onChange={(e) =>
                        setHeatFilter(e.target.value)}/>
                    Min Walk MP:
                    <Form.Control type="text" value={walkFilter} onChange={(e) =>
                        setWalkFilter(e.target.value)}/>
                    Min Jump MP:
                    <Form.Control type="text" value={jumpFilter} onChange={(e) =>
                        setJumpFilter(e.target.value)}/>
                    Armor Type:
                    <Form.Control type="text" value={armorTypeFilter} onChange={(e) =>
                        setArmorTypeFilter(e.target.value)}/>
                    Min Armor Points:
                    <Form.Control type="text" value={armorPointsFilter} onChange={(e) =>
                        setArmorPointsFilter(e.target.value)}/>
                    Weapons:
                    <Form.Control type="text" value={weaponFilter} onChange={(e) =>
                        setWeaponFilter(e.target.value)}/>
                </Offcanvas.Body>
            </Offcanvas>
        </>)
    }

    function renderUnitDetailPanel() {
        return (
            <Offcanvas show={currentUnit} onHide={ () => setCurrentUnit(undefined)}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Mech Name</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <UnitDetail unit={currentUnit}/>
                </Offcanvas.Body>
            </Offcanvas>
        )
    }

    function renderToasts() {
        // showToast
        return (
            <ToastContainer
                style={{ zIndex: 5}}
                >
                <Toast show={showToast} onClose={()=>setShowToast(false)}>
                    <Toast.Header>
                        <img
                            src="holder.js/20x20?text=%20"
                            className="rounded me-2"
                            alt=""
                        />
                        <strong className="me-auto">{toastTitle}</strong>
                    </Toast.Header>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
        )
    }

    return (
        <div className="Home">
            {renderToasts()}
            {renderFilters()}
            <ForceList force={force} handleHideForce={handleHideForce} removeUnitFromForce={removeUnitFromForce}
                       addUnitsFromClipboard={addUnitsFromClipboard} loadForceFromClipboard={loadForceFromClipboard}
                       copyForceToClipboard={copyForceToClipboard}
                       showForce={showForce} updateForceUnitGunnery={updateForceUnitGunnery} updateForceUnitPiloting={updateForceUnitPilot}/>
            {renderUnits()}

        </div>
    )
}
