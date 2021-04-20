import React from 'react';
import { fade, makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MoreIcon from '@material-ui/icons/MoreVert';
import { useAuth } from '../Context/Auth'
import { emptyDatabase } from '../utils/db';
import API from '../utils/API'


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        grow: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(1),
        },
        title: {
            textAlign: 'center',
            textTransform: 'capitalize'
        },
        sectionDesktop: {
            display: 'none',
            [theme.breakpoints.up('md')]: {
                display: 'flex',
            },
        },
        sectionMobile: {
            display: 'flex',
            [theme.breakpoints.up('md')]: {
                display: 'none',
            },
        },
    }),
);

export default function MyAppBar({ setEditOpen }: { setEditOpen: Function }) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const isMenuOpen = Boolean(anchorEl);
    const { Auth, setAuth } = useAuth()

    function edit(): void {
        setEditOpen(true)
    }

    function downloadFile(): void {
        API.downloadFile(Auth.token, `${Auth.user}_expenses.xlsx`, "2020-01-01", "2020-12-31")
        handleMenuClose()
    }

    function logout(): void {
        setAuth({ type: 'LOGOUT' })
        emptyDatabase()
    }

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={edit}>Edit</MenuItem>
            <MenuItem onClick={downloadFile}>Downloads</MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
        </Menu>
    );


    return (
        <div className={classes.grow}>
            <AppBar position="static">
                <Toolbar>
                    <Typography className={classes.title} variant="h6" noWrap>
                        {Auth.user}'s Finances
                    </Typography>
                    <div className={classes.grow} />
                    <div className={classes.sectionDesktop}>
                        <Button
                            color="inherit"
                            onClick={edit}
                        >Edit
                </Button>

                        <Button
                            color="inherit"
                            onClick={downloadFile}
                        // edge="end"
                        >Download
                    </Button>
                        <Button
                            color="inherit"
                            onClick={logout}
                        // edge="end"
                        >Logout
                    </Button>
                    </div>
                    <div className={classes.sectionMobile}>
                        <IconButton
                            aria-label="show more"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>

                    </div>
                </Toolbar>
            </AppBar>
            {renderMenu}
        </div>
    );
}