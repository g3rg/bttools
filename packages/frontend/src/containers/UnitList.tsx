import { useEffect, useState } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import {Offcanvas, Dropdown, Table} from 'react-bootstrap'
import { useAppContext } from '../lib/contextLib'
import { UnitType } from '../types/unit.ts'
import './UnitList.css'
import { Form } from 'react-bootstrap'

import mechData from '../data/merged_mech_data.json'
import Button from "react-bootstrap/Button";

const MUL_UnitDetail_URL = `https://masterunitlist.info/Unit/Details/{id}`
const Flechs_UnitDetail_URL = `https://sheets.flechs.net/?s={mechName}`
const Sarna_URL = `https://www.sarna.net/wiki/{mechChassis}`

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

export default function UnitList() {
    const { isAuthenticated } = useAppContext()
    const [isLoading, setIsLoading] = useState(true)
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

    const handleShowAdvancedFilters = () => setShowAdvancedFilters(true)
    const handleHideAdvancedFilters = () => setShowAdvancedFilters(false)

    const [unitFilter, setUnitFilter] = useState("")
    const [minTonFilter, setMinTonFilter] = useState("")
    const [maxTonFilter, setMaxTonFilter] = useState("")
    const [minBVFilter, setMinBVFilter] = useState("")
    const [maxBVFilter, setMaxBVFilter] = useState("")
    const [minPVFilter, setMinPVFilter] = useState("")
    const [maxPVFilter, setMaxPVFilter] = useState("")
    const [roleFilter, setRoleFilter] = useState("")
    const [ruleFilter, setRuleFilter] = useState("")

    // advanced filters
    const [engineFilter, setEngineFilter] = useState("")
    const [structureFilter, setStructureFilter] = useState("")
    const [heatFilter, setHeatFilter] = useState("")
    const [walkFilter, setWalkFilter] = useState("")
    const [jumpFilter, setJumpFilter] = useState("")
    const [armorTypeFilter, setArmorTypeFilter] = useState("")
    const [armorPointsFilter, setArmorPointsFilter] = useState("")

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

    function doFilter(unit: UnitType) {
        let show = true

        if (unitFilter !== "" && !(unit.mechName.toLowerCase().indexOf(unitFilter.toLowerCase()) >= 0)) {
            show = false
        }

        if (show && minTonFilter !== "") {
            let minTons = parseInt(minTonFilter) // Todo Handle non-integers / force the field to be an int
            let unitTons = parseInt(unit.tons?.trim() || "50")
            if (unitTons < minTons) {
                show = false
            }
        }
        if (show && maxTonFilter !== "") {
            let maxTons = parseInt(maxTonFilter) // Todo as above
            let unitTons = parseInt(unit.tons?.trim() || "50")
            if (unitTons > maxTons) {
                show = false
            }
        }
        if (show && minBVFilter !== "") {
            let minBV = parseInt(minBVFilter) // Todo Handle non-integers / force the field to be an int
            let unitBV = parseInt(unit.bv?.replace(',','') || "0")
            if (unitBV < minBV) {
                show = false
            }
        }
        if(show && maxBVFilter !== "") {
            let maxBV = parseInt(maxBVFilter) // Todo as above
            if (parseInt(unit.bv?.replace(',','') || "0") > maxBV) {
                show = false
            }
        }
        if (show && minPVFilter !== "") {
            let minPV = parseInt(minPVFilter) // Todo Handle non-integers / force the field to be an int
            let unitPV = parseInt(unit.pv?.replace(',','') || "0")
            if (unitPV < minPV) {
                show = false
            }
        }
        if (show && maxPVFilter !== "") {
            let maxPV = parseInt(maxPVFilter) // Todo as above
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
            if (unit.variant == 'STK-3F') {
                console.log(`${minWalk} - ${unitWalk}`)
            }
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

        return show
    }

    function renderLinks(unit: UnitType) {
        let mechName = unit.mechName || ''
        let mulId = unit.id || ''
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
            <Table striped bordered hover size="sm" responsive="sm">
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
                    <th>
                        Tons<br/>
                        <input
                            type="text"
                            value={minTonFilter}
                            onChange={(e) =>
                                setMinTonFilter(e.target.value)
                            }
                        />
                        to
                        <input
                        type="text"
                        value={maxTonFilter}
                        onChange={(e) =>
                            setMaxTonFilter(e.target.value)
                        }
                    />
                    </th>
                    <th>
                        BV<br/>
                        <input
                            type="text"
                            value={minBVFilter}
                            onChange={(e) =>
                                setMinBVFilter(e.target.value)
                            }
                        />
                        to
                        <input
                            type="text"
                            value={maxBVFilter}
                            onChange={(e) =>
                                setMaxBVFilter(e.target.value)
                            }
                        />
                    </th>
                    <th>PV
                        <br/>
                        <input
                            type="text"
                            value={minPVFilter}
                            onChange={(e) =>
                                setMinPVFilter(e.target.value)
                            }
                        />
                        to
                        <input
                            type="text"
                            value={maxPVFilter}
                            onChange={(e) =>
                                setMaxPVFilter(e.target.value)
                            }
                        /></th>
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
                {Object.keys(units).map( (key,index) => {
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

    function renderFilters() {
        return (<>
            <Button onClick={handleShowAdvancedFilters}>Advanced Search</Button>

            <Offcanvas show={showAdvancedFilters} onHide={handleHideAdvancedFilters}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Advanced</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    Faction<br/>
                    Era<br/>
                    Engine: <input
                        type="text"
                        value={engineFilter}
                        onChange={(e) =>
                            setEngineFilter(e.target.value)
                        }
                    /><br/>
                        Structure: <input
                        type="text"
                        value={structureFilter}
                        onChange={(e) =>
                            setStructureFilter(e.target.value)
                        }
                    /><br/>
                        Heatsinks: <input
                        type="text"
                        value={heatFilter}
                        onChange={(e) =>
                            setHeatFilter(e.target.value)
                        }
                    /><br/>
                        Min Walk MP: <input
                        type="text"
                        value={walkFilter}
                        onChange={(e) =>
                            setWalkFilter(e.target.value)
                        }
                    />
                        <br/>
                        Min Jump MP:<input
                        type="text"
                        value={jumpFilter}
                        onChange={(e) =>
                            setJumpFilter(e.target.value)
                        }
                    />
                        <br/>
                        Armor Type:<input
                        type="text"
                        value={armorTypeFilter}
                        onChange={(e) =>
                            setArmorTypeFilter(e.target.value)
                        }
                    />
                    <br/>
                    Min Armor Points:<input
                        type="text"
                        value={armorPointsFilter}
                        onChange={(e) =>
                            setArmorPointsFilter(e.target.value)
                        }
                    /><br/>
                    Weapons...<br/>
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