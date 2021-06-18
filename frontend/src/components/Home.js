import React, { useState, useEffect } from 'react'
import { Button, TextField, Modal, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { DataGrid } from '@material-ui/data-grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import { FormControl, MenuItem, Select, InputLabel } from '@material-ui/core';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from "@date-io/date-fns";
import { useHistory } from "react-router-dom";
import Cookies from 'universal-cookie';
import axios from 'axios';

const cookies = new Cookies();

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
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
    },
}));

const getModalStyle = () => {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
        position: 'absolute',
        overflow: 'scroll',
        height: '100%',
        display: 'block'
    };
}

const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'table', headerName: 'Tên Bảng', width: 150, editable: true },
    { field: 'task', headerName: 'Tên Task', width: 150, editable: true },
    { field: 'day', headerName: 'Ngày', width: 150, editable: true },
    { field: 'hours', headerName: 'Giờ', width: 150, editable: true },
    { field: 'target', headerName: 'Mục Tiêu', width: 150, editable: true },
    {
        field: 'estimated', headerName: 'Hoàn Thành Dự Kiến', width: 250, editable: true, valueGetter: e => {
            return e.value + "%"
        }
    },
    {
        field: 'rate', headerName: 'Hoàn Thành Thực Tế', width: 250, editable: true, valueGetter: e => {
            return e.value + "%"
        }
    },
    { field: 'note', headerName: 'Ghi Chú', width: 300, editable: true }
];

const Home = () => {

    let history = useHistory();
    const [open, setOpen] = useState(false)
    const [username, setusername] = useState("")
    const [onDelete, setOnDelete] = useState(false)
    const [rate, setRate] = useState("")
    const [estimated, setEstimated] = useState("")
    const [list, setList] = useState([])
    const [deletedRows, setDeletedRows] = useState([]);
    const [dataTemp, setDataTemp] = useState({
        table: "",
        task: "",
        day: "",
        hours: "",
        target: "",
        estimated: 0,
        rate: 0,
        note: ""
    });

    const [selectedDay, setSelectedDay] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(new Date());

    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);

    const onHandleOpen = () => {
        setOpen(true)
    }

    const onHandleClose = () => {
        setOpen(false)
    }

    const onHandleData = () => {

        if (dataTemp.day === "") {
            dataTemp.day = new Intl.DateTimeFormat('UTC', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
        }

        if (dataTemp.hours === "") {

            const date = new Date()
            const hours = date.getHours()
            const minutes = date.getMinutes()

            dataTemp.hours = hours + ':' + minutes
        }

        if (dataTemp.table === "" || dataTemp.task === "" || dataTemp.target === "" || dataTemp.note === "" || dataTemp.estimated === 0) {
            // setErr(true)
        } else {
            const count = list.length
            dataTemp.id = count + 1
            setList([...list, dataTemp])
            update([...list, dataTemp])
            onHandleClose()
        }
    }

    const handleDayChange = (date) => {
        setSelectedDay(date);
        setDataTemp({ ...dataTemp, day: new Intl.DateTimeFormat('UTC', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date) })
    };

    const handleTimeChange = (date) => {

        setSelectedTime(date);

        const hours = date.getHours()
        const minutes = date.getMinutes()

        setDataTemp({ ...dataTemp, hours: hours + ':' + minutes })
    };

    const onHandleEstimated = (e) => {
        if (!isNaN(Number(e))) {
            if (e >= 0 && e <= 100) {
                setDataTemp({ ...dataTemp, estimated: e })
                setEstimated(e)
            } else {
            }
        }
    }

    const onHandleRate = (e) => {

        if (!isNaN(Number(e))) {
            if (e >= 0 && e <= 100) {
                setDataTemp({ ...dataTemp, rate: e })
                setRate(e)
            } else {
            }
        }

    }

    const handleRowSelectionAll = (e) => {

        const check = e.selectionModel

        if (check.length !== 0) {
            setDeletedRows(check)
        } else {
            setOnDelete(false)
        }
    }

    const onHandleEditRow = (e) => {
        const temp = list
        switch (e.field) {
            case "rate":
            case "estimated":
                const percent = e.props.value.split("%")[0]
                if (!isNaN(Number(percent))) {
                    if (percent >= 0 && percent <= 100) {
                        temp[list.findIndex(l => l.id === e.id)][e.field] = Number(percent)
                    }
                }
                break;

            default:
                break;
        }

        setList([...temp])
        update([...temp])
    }

    const onHandleDelete = () => {
        const data = list.filter((r) => deletedRows.filter((sr) => sr === r.id).length < 1)
        setList(data)
        update(data)
    }

    useEffect(() => {
        if (deletedRows.length !== 0) {
            setOnDelete(true)
        } else {
            setOnDelete(false)
        }
    }, [deletedRows])

    const jwt = cookies.get("jwt")

    useEffect(() => {

        const check = async () => {

            if (jwt !== undefined && jwt !== "" && jwt !== null) {
                let res = await axios.get(`${process.env.REACT_APP_API}/info`,
                    {
                        headers: { 'Authorization': `Bearer ${jwt}` }
                    }
                )

                res = res.data
                setusername(res.body.data.username)

                if (!res.status) {
                    history.push("/login")
                } else {
                    if (res.body.data.task[0] !== "") {
                        setList(res.body.data.task)
                    }

                }
            } else {
                history.push("/login")
            }
        }

        check()

    }, [jwt, history])

    const update = async (data) => {

        await axios.post(`${process.env.REACT_APP_API}/task`, data,
            {
                headers: { 'Authorization': `Bearer ${jwt}` },
            }
        )

    }

    const body = (
        <div style={modalStyle} className={classes.paper}>

            <h2 id="simple-modal-title">Thêm task</h2>
            <div id="simple-modal-description">
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <FormControl className={classes.formControl}>
                            <InputLabel id="demo-simple-select-label">Tên Bảng</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={dataTemp.table}
                                onChange={(e) => setDataTemp({ ...dataTemp, table: e.target.value })}
                            >
                                {
                                    (username === "ngao" && (
                                        <div>
                                            <MenuItem value="Business">Business</MenuItem>
                                            <MenuItem value="English">English</MenuItem>
                                        </div>
                                    )) || (
                                        <div>
                                            <MenuItem value="Chat Bot">Chat Bot</MenuItem>
                                            <MenuItem value="Monitoring System">Monitoring System</MenuItem>
                                            <MenuItem value="Idea &amp; Design">Idea &amp; Design</MenuItem>
                                            <MenuItem value="CI/CD Security">CI/CD Security</MenuItem>
                                            <MenuItem value="Training">Training</MenuItem>
                                            <MenuItem value="Blog">Blog</MenuItem>
                                        </div>
                                    )
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField onChange={(e) => setDataTemp({ ...dataTemp, task: e.target.value })} id="task" label="Task" variant="outlined" />
                    </Grid>
                    <Grid item xs={12}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                margin="normal"
                                id="date-picker-dialog"
                                label="Ngày"
                                format="MM/dd/yyyy"
                                value={selectedDay}
                                onChange={handleDayChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item xs={12}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardTimePicker
                                margin="normal"
                                id="time-picker"
                                label="Giờ"
                                ampm={false}
                                value={selectedTime}
                                onChange={handleTimeChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change time',
                                }}
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField onChange={(e) => setDataTemp({ ...dataTemp, target: e.target.value })} id="target" label="Mục Tiêu" variant="outlined" />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField onChange={(e) => onHandleEstimated(e.target.value)}
                            value={dataTemp.estimated === 0 ? estimated : dataTemp.estimated}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">%</InputAdornment>,
                            }}
                            id="estimated" label="Hoàn Thành Dự Kiến"
                            variant="outlined"
                            inputProps={{ className: classes.input, pattern: "^(100|[0-9]{1,2})%?$" }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            value={dataTemp.rate === 0 ? rate : dataTemp.rate}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">%</InputAdornment>,
                            }}
                            onChange={(e) => onHandleRate(e.target.value)}
                            id="rate" variant="outlined"
                            label="Hoàn Thành Thực Tế"
                            disabled
                            inputProps={{ className: classes.input, pattern: "^(100|[0-9]{1,2})%?$" }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField onChange={(e) => setDataTemp({ ...dataTemp, note: e.target.value })} id="note" label="Ghi Chú" variant="outlined" />
                    </Grid>
                    <Grid item xs={12}>
                        <Button onClick={() => onHandleData()} variant="contained" color="secondary">
                            Thêm
                        </Button>
                    </Grid>
                </Grid>
            </div>
        </div>
    )

    return (
        <Grid direction="row" justify="flex-start" alignItems="center" container spacing={3}>

            <Grid item style={{ marginTop: '1em', marginLeft: '1em' }}>
                <Button variant="contained" color="secondary" onClick={onHandleOpen}>
                    Thêm task
                </Button>
                {
                    onDelete && (
                        <Button variant="contained" color="secondary" onClick={onHandleDelete}>
                            Xoá
                        </Button>
                    )
                }
            </Grid>

            <Modal
                open={open}
                onClose={onHandleClose}
            // aria-labelledby="simple-modal-title"
            // aria-describedby="simple-modal-description"
            >
                {body}
            </Modal>

            <Grid item xs={12}>
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={list}
                        columns={columns}
                        pageSize={5} checkboxSelection
                        onEditCellChangeCommitted={onHandleEditRow}
                        onSelectionModelChange={handleRowSelectionAll}
                    />
                </div>
            </Grid>

        </Grid>
    )
}

export default Home
