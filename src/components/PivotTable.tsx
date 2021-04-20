import React, { useState, useEffect } from 'react';
import { Paper, Table, TableBody, TableContainer, TableCell, TableRow, TableHead } from '@material-ui/core';
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import { TableDataEntry } from '../interfaces/Interfaces';
import { blueGrey } from '@material-ui/core/colors';

const StyledTableCell = withStyles((theme: Theme) =>
    createStyles({
        head: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white,
            padding: 10,
            fontSize: 16
        },
        body: {
            padding: 10,
            fontSize: 14,
        },
    }),
)(TableCell);

const DarkTableRow = withStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: theme.palette.background.default,
            cursor: 'pointer'
        },
    }),
)(TableRow);

const LightTableRow = withStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: blueGrey[800],
        },
    }),
)(TableRow);

const ExtraLightTableRow = withStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: blueGrey[700],
        },
    }),
)(TableRow);

export default function PivotTable(props: {
    state:
    {
        schema:
        {
            fields: { name: string }[]
        },
        data: TableDataEntry[]

    },
}) {

    // Controls which rows are expanded to view subcategories
    const [show, setShow] = useState<boolean[]>([false])
    function toggleShowRow(i: number) {
        let newShow = [...show]
        newShow[i] = !newShow[i]
        setShow(newShow)
    }

    // Calling reduce on our props data to create our pivot table data
    // Yes, this will re-run on every render, but until I have the time to get the TS errors worked out with the useEffect route, we'll do it this way
    const pivotState = props.state.data.reduce((a, b) => {
        if (b.broad_category) {
            if (a[b.broad_category]) {
                a[b.broad_category].total += parseFloat(b.amount);
            } else {
                a[b.broad_category] = { total: parseFloat(b.amount), narrow_categories: {} };
            }
            if (b.narrow_category) {
                if (a[b.broad_category].narrow_categories[b.narrow_category]) {
                    a[b.broad_category].narrow_categories[b.narrow_category].total += parseFloat(b.amount);
                } else {
                    a[b.broad_category].narrow_categories[b.narrow_category] = {total: parseFloat(b.amount), persons: {}}   ;
                }
                if (b.person) {
                    if (a[b.broad_category].narrow_categories[b.narrow_category].persons[b.person]) {
                        a[b.broad_category].narrow_categories[b.narrow_category].persons[b.person] += parseFloat(b.amount);
                    } else {
                        a[b.broad_category].narrow_categories[b.narrow_category].persons[b.person] = parseFloat(b.amount);
                    }
                }
            } else if (b.person) {
                if (a[b.broad_category].narrow_categories["--"]?.persons[b.person]) {
                    a[b.broad_category].narrow_categories["--"].persons[b.person] += parseFloat(b.amount);
                    a[b.broad_category].narrow_categories["--"].total += parseFloat(b.amount);
                } else {
                a[b.broad_category].narrow_categories = {...a[b.broad_category].narrow_categories, "--": {persons: {[b.person]: parseFloat(b.amount)}, total: parseFloat(b.amount)}}
                }
            }
        }
        return a
    }, {} as any)

    // Set every broad category to be collapsed
    useEffect(() => {
        let showState = Object.keys(pivotState).map((i: any) => false)
        setShow(showState)
    }, [props])

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <StyledTableCell>
                            Broad category
                        </StyledTableCell>
                        <StyledTableCell>
                            Narrow Category
                        </StyledTableCell>
                        <StyledTableCell>
                            Person
                        </StyledTableCell>
                        <StyledTableCell>
                            Amount
                        </StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.keys(pivotState).map((bCat, i) => (
                        <>
                            <DarkTableRow key={i} onClick={() => toggleShowRow(i)}>
                                <StyledTableCell>
                                    {bCat}
                                </StyledTableCell>
                                <StyledTableCell>
                                    TOTAL
                                </StyledTableCell>
                                <StyledTableCell>
                                    {/* Empty Cell */}
                                </StyledTableCell>
                                <StyledTableCell>
                                    ${pivotState[bCat].total.toFixed(2)}
                                </StyledTableCell>
                            </DarkTableRow>
                            {pivotState[bCat].narrow_categories && show[i] ? (
                                Object.keys(pivotState[bCat].narrow_categories).map(nCat => (
                                    <>
                                        <LightTableRow>
                                            <StyledTableCell>
                                                {/* Empty Cell */}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {nCat}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                TOTAL
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                ${pivotState[bCat].narrow_categories[nCat].total.toFixed(2)}
                                            </StyledTableCell>
                                        </LightTableRow>
                                        {pivotState[bCat].narrow_categories[nCat].persons ? (
                                            Object.keys(pivotState[bCat].narrow_categories[nCat].persons).map((person: string) => (
                                                <ExtraLightTableRow>
                                                    <StyledTableCell>
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {person}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        ${pivotState[bCat].narrow_categories[nCat].persons[person].toFixed(2)}

                                                    </StyledTableCell>
                                                </ExtraLightTableRow>
                                            ))
                                            ) : null
                                        }
                                    </>
                                ))
                            ) : null}
                        </>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}