import {useEffect, useState} from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import {Offcanvas, Dropdown, Table, } from 'react-bootstrap'
import { useAppContext } from '../lib/contextLib'
import { UnitType } from '../types/unit.ts'
import './UnitList.css'
import { Form } from 'react-bootstrap'

import mechData from '../data/merged_mech_data.json'
import eraFactionData from '../data/mech_era_faction.json'

import Button from "react-bootstrap/Button"

const MUL_UnitDetail_URL = `https://masterunitlist.info/Unit/Details/{id}`
const Flechs_UnitDetail_URL = `https://sheets.flechs.net/?s={mechName}`
const Sarna_URL = `https://www.sarna.net/wiki/{mechChassis}`

const MAX_BV = 5000
const MAX_PV = 100

let mechNames = Object.keys(mechData).sort()

const roles = [
    '',
    'Ambusher',
    'Brawler',
    'Jugernaut',
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

export default function UnitList() {
    const { isAuthenticated } = useAppContext()
    const [isLoading, setIsLoading] = useState(true)
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

    const [rowCount, setRowCount] = useState(0)

    const handleShowAdvancedFilters = () => setShowAdvancedFilters(true)
    const handleHideAdvancedFilters = () => setShowAdvancedFilters(false)

    const [unitFilter, setUnitFilter] = useState("")
    const [minTonFilter, setMinTonFilter] = useState(0)
    const [maxTonFilter, setMaxTonFilter] = useState(100)
    const [minBVFilter, setMinBVFilter] = useState(0)
    const [maxBVFilter, setMaxBVFilter] = useState(MAX_BV)
    const [minPVFilter, setMinPVFilter] = useState(0)
    const [maxPVFilter, setMaxPVFilter] = useState(MAX_PV)
    const [roleFilter, setRoleFilter] = useState("")
    const [ruleFilter, setRuleFilter] = useState("")

    // advanced filters
    const [factionFilter, setFactionFilter] = useState("")
    const [eraFilter, setEraFilter] = useState("")
    const [techBaseFilter, setTechBaseFilter] = useState("")
    const [engineFilter, setEngineFilter] = useState("")
    const [structureFilter, setStructureFilter] = useState("")
    const [heatFilter, setHeatFilter] = useState("")
    const [walkFilter, setWalkFilter] = useState("")
    const [jumpFilter, setJumpFilter] = useState("")
    const [armorTypeFilter, setArmorTypeFilter] = useState("")
    const [armorPointsFilter, setArmorPointsFilter] = useState("")
    const [weaponFilter, setWeaponFilter] = useState("")


    useEffect(() => {
        async function onLoad() {
            // data_url

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
        setRowCount(document.getElementById("unitTable")?.tBodies[0].rows.length);
    }, [unitFilter, minTonFilter, maxTonFilter, minBVFilter, maxBVFilter, minPVFilter, maxPVFilter,
        roleFilter, ruleFilter, factionFilter, eraFilter, techBaseFilter, engineFilter, structureFilter, heatFilter,
        walkFilter, jumpFilter, armorTypeFilter, armorPointsFilter, weaponFilter])

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
            let unitBV = parseInt(unit.bv?.replace(',','') || "0")
            if (unitBV < minBV) {
                show = false
            }
        }
        if(show && maxBVFilter < MAX_BV) {
            let maxBV = maxBVFilter
            if (parseInt(unit.bv?.replace(',','') || "0") > maxBV) {
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

        if (show && factionFilter !== "" && eraFilter !== "") {

            let factionEraKey = factionFilter + ":" + eraFilter
            // @ts-ignore
            if (!eraFactionData['factionEras'][factionEraKey]?.includes(unit.mechId)) {
                show = false
            }
        } else {
            if (show && factionFilter !== "") {
                // @ts-ignore
                if (!eraFactionData['factions'][factionFilter]?.includes(unit.mechId)) {
                    show = false
                }
            }
            if (show && eraFilter !== "") {
                // @ts-ignore
                if (!eraFactionData['eras'][eraFilter]?.includes(unit.mechId)) {
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
            let unitHeat = unit.heatSinks || ''
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

    function renderUnitList(units: { [mechName:string] : UnitType }) {
        return (
            <Table id="unitTable" striped bordered hover size="sm" responsive="sm">
                <thead>
                <tr>
                    <th>
                        Unit<br/>
                        <input
                            type="text"
                            value={unitFilter}
                            onChange={(e) =>
                                setUnitFilter(e.target.value)
                            }
                        />
                    </th>
                    <th>Tons</th>
                    <th>BV</th>
                    <th>PV</th>
                    <th>
                        Role<br/>
                        <Form.Select onChange={ (e) =>
                            setRoleFilter(e.target.value)
                        }>
                            {
                                roles.map( (role) => (
                                <option>{role || ''}</option>
                            ))}
                        </Form.Select>
                    </th>
                    <th>
                        Rules<br/>
                        <Form.Select onChange={(e) =>
                            setRuleFilter(e.target.value)
                        }>
                            {rules.map((rule) => (
                                <option>{rule || ''}</option>
                            ))}
                        </Form.Select>
                    </th>
                    <th>Intro</th>
                    <th>Links</th>
                </tr>
                </thead>
                <tbody>
                {mechNames.map( (key,index) => {
                    let unit = units[key]
                    if (doFilter(unit)) {
                        return (
                            <tr key={index}>
                                <td>{unit.mechName}</td>
                                <td>{unit.tons}</td>
                                <td>{unit.bv}</td>
                                <td>{unit.pv}</td>
                                <td>{unit.role}</td>
                                <td>{unit.rules}</td>
                                <td>{unit.intro}</td>
                                <td>{ renderLinks(unit) }</td>
                            </tr>)
                    } else {
                        return (<></>)
                    }
                })}
                </tbody>
            </Table>
        )
    }

    function renderUnits() {
        return (
            <div className="units">
                <ListGroup>{!isLoading && renderUnitList(mechData)}</ListGroup>
            </div>
        )
    }

    function summariseFilters() {
        /*
        unitFilter        minTonFilter        maxTonFilter        minBVFilter        maxBVFilter        minPVFilter
        maxPVFilter        roleFilter        ruleFilter        factionFilter        eraFilter        techBaseFilter
        engineFilter        structureFilter        heatFilter        walkFilter        jumpFilter        armorTypeFilter
        armorPointsFilter        weaponFilter

         */
        let filterSummary = ''
        if (factionFilter) {
            filterSummary += ` Faction (${factionFilter})`
        }
        if (eraFilter) {
            filterSummary += ` Era (${eraFilter})`
        }
        if (techBaseFilter) {
            filterSummary += ` Tech (${techBaseFilter})`
        }
        if (minTonFilter > 0 || maxTonFilter < 100) {
            filterSummary += ` Tons ${minTonFilter} to ${maxTonFilter}`
        }
        if (minBVFilter > 0 || maxBVFilter < MAX_BV) {
            filterSummary += ` BV ${minBVFilter} to ${maxBVFilter}`
        }
        if (minPVFilter > 0 || maxPVFilter < MAX_PV) {
            filterSummary += ` PV ${minPVFilter} to ${maxPVFilter}`
        }
        if (engineFilter) {
            filterSummary += ` Engine (${engineFilter})`
        }
        if (structureFilter) {
            filterSummary += ` Structure (${structureFilter})`
        }
        if (heatFilter) {
            filterSummary += ` HeatSinks (${heatFilter})`
        }
        if (walkFilter) {
            filterSummary += ` Min Walk (${walkFilter})`
        }
        if (jumpFilter) {
            filterSummary += ` Min Jump (${jumpFilter})`
        }
        if (armorTypeFilter) {
            filterSummary += ` Armor Type(${armorTypeFilter})`
        }
        if (armorPointsFilter) {
            filterSummary += ` Armor Points(${armorPointsFilter})`
        }
        if (weaponFilter) {
            filterSummary += ` Weapons (${weaponFilter})`
        }

        return `${filterSummary.trim()}`
    }


    function clearFilters() {
        setUnitFilter("")
        setMinTonFilter(0)
        setMaxTonFilter(100)
        setMinBVFilter(0)
        setMaxBVFilter(MAX_BV)
        setMinPVFilter(0)
        setMaxPVFilter(MAX_PV)
        setRoleFilter("")
        setRuleFilter("")
        setFactionFilter("")
        setEraFilter("")
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
            <Button onClick={handleShowAdvancedFilters} size="sm">Filters</Button>
            &nbsp;&nbsp;Rows { rowCount }<br/>
            <br/>
            &nbsp;Active Filters: {summariseFilters()}

            <Offcanvas show={showAdvancedFilters} onHide={handleHideAdvancedFilters}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Filters</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Button onClick={clearFilters} size='sm'>Clear Filters</Button><br/>
                    Faction:
                    <Form.Select value={factionFilter} onChange={(e) =>
                        setFactionFilter(e.target.value)
                    }>
                            <option></option>
                        {
                            Object.keys(eraFactionData.factions).sort().map( (faction) => (
                                <option>{faction || ''}</option>
                            ))}
                    </Form.Select>
                    <br/>
                    Era:
                    <Form.Select value={eraFilter} onChange={(e) =>
                        setEraFilter(e.target.value)
                    }>
                            <option></option>
                        {
                            Object.keys(eraFactionData.eras).sort().map( (era) => (
                                <option>{era || ''}</option>
                            ))}
                    </Form.Select>
                    <br/>
                    TechBase:
                    <Form.Select value={techBaseFilter} onChange={(e) =>
                        setTechBaseFilter(e.target.value)
                    }>
                        {
                            techBases.map( (techBase) => (
                                <option>{techBase || ''}</option>
                            ))}
                    </Form.Select>
                    <br/>
                    Tons<br/>
                    Min: {minTonFilter}
                    <Form.Range step="5" value={minTonFilter} onChange={(e) =>
                        setMinTonFilter(parseInt(e.target.value))}></Form.Range>
                    Max: {maxTonFilter}
                    <Form.Range step="5" value={maxTonFilter} onChange={(e) =>
                        setMaxTonFilter(parseInt(e.target.value))}></Form.Range>
                    BV<br/>
                    Min: {minBVFilter}
                    <Form.Range step="100" value={minBVFilter} max={MAX_BV} onChange={(e) =>
                        setMinBVFilter(parseInt(e.target.value))}></Form.Range>
                    Max: {maxBVFilter}
                    <Form.Range step="100" value={maxBVFilter} max={MAX_BV} onChange={(e) =>
                        setMaxBVFilter(parseInt(e.target.value))}></Form.Range>
                    PV<br/>
                    Min: {minPVFilter}
                    <Form.Range step="5" value={minPVFilter} max={MAX_PV} onChange={(e) =>
                        setMinPVFilter(parseInt(e.target.value))}></Form.Range>
                    Max: {maxPVFilter}
                    <Form.Range step="5" value={maxPVFilter} max={MAX_PV} onChange={(e) =>
                        setMaxPVFilter(parseInt(e.target.value))}></Form.Range>

                    Engine:
                    <Form.Control type="text" value={engineFilter} onChange={(e) =>
                        setEngineFilter(e.target.value)} />
                    Structure:
                    <Form.Control type="text" value={structureFilter} onChange={(e) =>
                        setStructureFilter(e.target.value)} />
                    Heatsinks:
                    <Form.Control type="text" value={heatFilter} onChange={(e) =>
                        setHeatFilter(e.target.value)} />
                    Min Walk MP:
                    <Form.Control type="text" value={walkFilter} onChange={(e) =>
                        setWalkFilter(e.target.value)} />
                    Min Jump MP:
                    <Form.Control type="text" value={jumpFilter} onChange={(e) =>
                        setJumpFilter(e.target.value)} />
                    Armor Type:
                    <Form.Control type="text" value={armorTypeFilter} onChange={(e) =>
                        setArmorTypeFilter(e.target.value)} />
                    Min Armor Points:
                    <Form.Control type="text" value={armorPointsFilter} onChange={(e) =>
                        setArmorPointsFilter(e.target.value)} />
                    Weapons:
                    <Form.Control type="text" value={weaponFilter} onChange={(e) =>
                        setWeaponFilter(e.target.value)} />
                </Offcanvas.Body>
            </Offcanvas>
        </>)
    }

    return (
        <div className="Home">
            {renderFilters()}
            {renderUnits()}
        </div>
    )
}