import React, {useEffect, createRef} from 'react'
import InputRow from './InputRow'
import type { TableDataEntry, AllDataListsType } from "../interfaces/Interfaces"
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { makeStyles, createStyles, withStyles, Theme } from '@material-ui/core/styles';

export default function ReportTable(props:
    {
        state:
        {
            schema:
            {
                fields: { name: string }[]
            },
            data: TableDataEntry[]

        },
        dataLists?: AllDataListsType
        handleChange: Function,
        handleUpdate: Function,
        deleteEntry: Function,
        form?: string
    }) {

        const StyledTableCell = withStyles((theme: Theme) =>
        createStyles({
            head: {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.common.white,
                padding: 10,
                fontSize: 16
            },
        }),
        )(TableCell);

        const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            table: {
                minWidth: 650,
            },
        })
        );
        const classes = useStyles();

        // Component scrolls into view on mount
        const myRef = createRef<HTMLTableElement>()
        const executeScroll = () => {
            if (myRef.current) {
                myRef.current.scrollIntoView({behavior: 'smooth'})
            }
        }
    
        useEffect(() => {
            executeScroll()
        }, [])
    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} ref={myRef}>
                <TableHead>
                    <TableRow>
                        {props.state.schema.fields
                            .filter(column => !column.name.includes("id"))
                            .map(column => {
                                return (
                                    <StyledTableCell key={column.name}>
                                        {column.name.replace("_", " ")}
                                    </StyledTableCell>
                                )
                            })}
                        <StyledTableCell><span>Save</span></StyledTableCell>
                        <StyledTableCell><span>Delete</span></StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody className="tableBody">
                    {(props.state.data).map((entry: TableDataEntry, i: number) => (
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
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}