import React from 'react'
import InputRow from './InputRow'
import StaticRow from './StaticRow'
import type {tableDataEntry, dataListStateType} from "../interfaces/Interfaces"

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
        vendorsState?: dataListStateType[],
        handleChange: Function,
        setSourcesState?: Function,
        setPersonsState?: Function,
        setBroadState?: Function,
        setNarrowState?: Function,
        deleteEntry: Function,
        form?: string
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
                return props.form === "pivot" ?
                    <StaticRow
                        entry={entry}
                        i={i}
                        key={entry.entry_id || entry.id}
                        fields={props.state.schema.fields}
                    /> :
                    <InputRow
                        entry={entry}
                        i={i}
                        key={i}
                        fields={props.state.schema.fields}
                        handleChange={props.handleChange}
                        sourcesState={props.sourcesState}
                        personsState={props.personsState}
                        broadState={props.broadState}
                        narrowState={props.narrowState}
                        vendorsState={props.vendorsState}

                        setPersonsState={props.setPersonsState}
                        setSourcesState={props.setSourcesState}
                        setBroadState={props.setBroadState}
                        setNarrowState={props.setNarrowState}
                        deleteEntry={props.deleteEntry}
                    />
            })}

        </table>
    )
}