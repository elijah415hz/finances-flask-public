import React from 'react'
import type {tableDataEntry} from '../interfaces/Interfaces'

export default function StaticRow(props:
    {
        entry: tableDataEntry,
        i: number,
        fields: { name: string }[],
    }) {

    return (
        <tbody>
            <tr>
                {props.fields
                    .filter(column => !column.name.includes("id"))
                    .map(column => {
                        return (
                            <td key={props.i + column.name}>
                                {column.name === 'Amount' ? <span>$</span> : null}
                                <span
                                    className="tableInput"
                                >{props.entry[column.name as keyof tableDataEntry] || ""}
                                </span>

                            </td>
                        )
                    })}
            </tr>
        </tbody>
    )
}