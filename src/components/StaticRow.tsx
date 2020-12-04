import React from 'react'

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