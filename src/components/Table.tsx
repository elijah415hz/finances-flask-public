import React from 'react'
import InputRow from './InputRow'

interface tableDataEntry {
    Amount: string,
    Date?: string,
    Source?: string,
    Person?: string,
    id?: number,
    source_id?: number,
    earner_id?: number,
    Vendor?: string,
    Broad_category?: string,
    Narrow_category?: string,
    Notes?: string,
    entry_id?: number
}

interface dataListStateType {
    id: number,
    name: string
}

export default function Table(props:
    {
        state:
        {
            schema:
            {
                fields: { name: string }[]
            },
            data: tableDataEntry[]

        },
        sourcesState?: dataListStateType[],
        personsState?: dataListStateType[],
        broadState?: dataListStateType[],
        narrowState?: dataListStateType[],
        handleChange?: Function,
        setSourcesState?: Function,
        setPersonsState?: Function,
        setBroadState?: Function,
        setNarrowState?: Function
    }) {

    return (
        <table>
            <thead>
                <tr>
                    {props.state.schema.fields
                        .filter(column => !column.name.includes("id"))
                        .map(column => {
                            return (
                                <th key={column.name}>
                                    {column.name.replace("_", " ")}
                                </th>
                            )
                        })}
                </tr>
            </thead>
            {(props.state.data).map((entry: tableDataEntry, i: number) => {
                return (<InputRow
                    entry={entry}
                    i={i}
                    key={i}
                    fields={props.state.schema.fields}
                    handleChange={props.handleChange}
                    sourcesState={props.sourcesState}
                    personsState={props.personsState}
                    broadState={props.broadState}
                    narrowState={props.narrowState}

                    setPersonsState={props.setPersonsState}
                    setSourcesState={props.setSourcesState}
                    setBroadState={props.setBroadState}
                    setNarrowState={props.setNarrowState}
                />)
            })}
        </table>
    )
}