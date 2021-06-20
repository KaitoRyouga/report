import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({

    paper: {
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%)`,
        position: 'absolute',
        overflow: 'scroll',
        height: '100%',
        display: 'block'
    },

    err: {
        position: 'absolute',
        width: 400,
        height: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },

    input: {
        "&:invalid": {
            border: "red solid 2px"
        }
    },

    formControl: {
        margin: theme.spacing(1),
        minWidth: 200,
    }

}));

export default useStyles