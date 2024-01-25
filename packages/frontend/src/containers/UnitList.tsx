import { useEffect, useState } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import {Accordion, Table} from 'react-bootstrap'
import { useAppContext } from '../lib/contextLib'
import { UnitType } from '../types/unit.ts'
import { mechdata } from '../mechdata.ts'
import './UnitList.css'

const dummyData = mechdata;

export default function UnitList() {
    const { isAuthenticated } = useAppContext()
    const [isLoading, setIsLoading] = useState(true)
    const [unitFilter, setUnitFilter] = useState("")
    const [minTonFilter, setMinTonFilter] = useState("")
    const [maxTonFilter, setMaxTonFilter] = useState("")

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
            if (parseInt(unit.tons || "100") < minTons) {
                show = false
            }
        }

        if (maxTonFilter !== "") {
            let maxTons = parseInt(maxTonFilter) // Todo as above
            if (parseInt(unit.tons || "0") > maxTons) {
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
                    <th>BV</th>
                    <th>PV</th>
                    <th>Role</th>
                    <th>Rules</th>
                    <th>Intro</th>
                    <th>Links</th>
                </tr>
                </thead>
                <tbody>
                { units.map( (unit) => {
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