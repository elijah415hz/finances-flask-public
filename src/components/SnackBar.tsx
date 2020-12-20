import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from './Alert'
import { makeStyles, Theme } from '@material-ui/core/styles';


const useStyles = makeStyles((theme: Theme) => ({
    snackbar: {
        minWidth: '4000px'
    },
}));

export default function CustomizedSnackbar({
    severity,
    message,
    open,
    setOpen }: {
        severity: "success" | "info" | "warning" | "error" | undefined,
        message: string,
        open: boolean,
        setOpen: React.Dispatch<React.SetStateAction<boolean>>
    }) {

    const classes = useStyles();

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (
        // <div className={classes.root}>
            <Snackbar open={open} className={classes.snackbar} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={severity}>
                    {message}
                </Alert>
            </Snackbar>
        // </div>
    );
}