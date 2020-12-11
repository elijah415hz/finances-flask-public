import React from 'react'
import InputRow from './InputRow'
import StaticRow from './StaticRow'
import type { tableDataEntry, allDataListsType } from "../interfaces/Interfaces"
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles, createStyles, lighten, Theme } from '@material-ui/core/styles';



export default function ReportTable(props:
    {
        state:
        {
            schema:
            {
                fields: { name: string }[]
            },
            data: tableDataEntry[]

        },
        dataLists?: allDataListsType
        handleChange: Function,
        handleUpdate: Function,
        deleteEntry: Function,
        form?: string
    }) {

    const useStyles = makeStyles((theme: Theme) => 
        createStyles({
            table: {
                minWidth: 650,
            },
        })
    );
    const classes = useStyles();
    return (
        <Table className={classes.table}>
            <TableHead>
                <TableRow>
                    {props.state.schema.fields
                        .filter(column => !column.name.includes("id"))
                        .map(column => {
                            return (
                                <TableCell key={column.name}>
                                    {column.name.replace("_", " ")}
                                </TableCell>
                            )
                        })}
                        <TableCell><span>Save</span></TableCell>
                        <TableCell><span>Delete</span></TableCell>
                </TableRow>
            </TableHead>
            <TableBody className="tableBody">
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
                            handleUpdate={props.handleUpdate}
                            dataLists={props.dataLists}
                            deleteEntry={props.deleteEntry}
                        />
                })}
            </TableBody>

        </Table>
    )
}