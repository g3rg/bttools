import { useEffect, useState } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import {Accordion, Table} from 'react-bootstrap'
import { useAppContext } from '../lib/contextLib'
import { UnitType } from '../types/unit.ts'
import { mechdata } from '../mechdata.ts'
import './UnitList.css'
import { Form } from 'react-bootstrap'

const dummyData = mechdata;

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
    const [unitFilter, setUnitFilter] = useState("")
    const [minTonFilter, setMinTonFilter] = useState("")
    const [maxTonFilter, setMaxTonFilter] = useState("")
    const [minBVFilter, setMinBVFilter] = useState("")
    const [maxBVFilter, setMaxBVFilter] = useState("")
    const [minPVFilter, setMinPVFilter] = useState("")
    const [maxPVFilter, setMaxPVFilter] = useState("")
    const [roleFilter, setRoleFilter] = useState("")
    const [ruleFilter, setRuleFilter] = useState("")

    useEffect(() => {
        async function onLoad() {
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

        if (unitFilter !== "" && !(unit.name.toLowerCase().indexOf(unitFilter.toLowerCase()) >= 0)) {
            show = false
        }

        if (minTonFilter !== "") {
            let minTons = parseInt(minTonFilter) // Todo Handle non-integers / force the field to be an int
            let unitTons = parseInt(unit.tons?.trim() || "50")
            if (unitTons < minTons) {
                show = false
            }
        }

        if (maxTonFilter !== "") {
            let maxTons = parseInt(maxTonFilter) // Todo as above
            let unitTons = parseInt(unit.tons?.trim() || "50")
            if (unitTons > maxTons) {
                show = false
            }
        }

        if (minBVFilter !== "") {
            let minBV = parseInt(minBVFilter) // Todo Handle non-integers / force the field to be an int
            let unitBV = parseInt(unit.bv?.replace(',','') || "0")
            if (unitBV < minBV) {
                show = false
            }
        }

        if (maxBVFilter !== "") {
            let maxBV = parseInt(maxBVFilter) // Todo as above
            if (parseInt(unit.bv?.replace(',','') || "0") > maxBV) {
                show = false
            }
        }

        if (minPVFilter !== "") {
            let minPV = parseInt(minPVFilter) // Todo Handle non-integers / force the field to be an int
            let unitPV = parseInt(unit.pv?.replace(',','') || "0")
            if (unitPV < minPV) {
                show = false
            }
        }

        if (maxPVFilter !== "") {
            let maxPV = parseInt(maxPVFilter) // Todo as above
            if (parseInt(unit.pv?.replace(',','') || "0") > maxPV) {
                show = false
            }
        }

        if (roleFilter !== "") {
            let unitRole = unit.role
            if (unitRole !== roleFilter) {
                show = false
            }
        }

        if (ruleFilter !== "") {
            let unitRule = unit.rules
            if (unitRule !== ruleFilter) {
                show = false
            }
        }

        return show
    }

    function renderUnitList(units: UnitType[]) {
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
                            { roles.map( (role) => (
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
                {units.map((unit) => {
                    if (doFilter(unit)) {
                        return (
                            <tr>
                                <td>{unit.name}</td>
                                <td>{unit.tons}</td>
                                <td>{unit.bv}</td>
                                <td>{unit.pv}</td>
                                <td>{unit.role}</td>
                                <td>{unit.rules}</td>
                                <td>{unit.intro}</td>
                                <td>...</td>
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
                <ListGroup>{!isLoading && renderUnitList(dummyData)}</ListGroup>
            </div>
        )
    }

    function renderFilters() {
        return (
            <Accordion flush>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Filters</Accordion.Header>
                    <Accordion.Body>
                        Faction
                        Era
                        My Units
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        )
    }

    return (
        <div className="Home">
            { renderFilters() }
            {renderUnits() }
        </div>
    )
}