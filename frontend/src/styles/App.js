import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({

    root: {
        flexGrow: 1,
        marginBottom: '1em'
    },

    menuButton: {
        marginRight: theme.spacing(2),
    },

    title: {
        flexGrow: 1,
    },

    link: {
        color: 'white',
        textDecoration: 'none'
    }

}));

export default useStyles