const columnTable = [
    { 
        field: 'id', 
        headerName: 'ID', 
        width: 90 
    },
    { 
        field: 'table', 
        headerName: 'Tên Bảng', 
        width: 150, 
        editable: true 
    },
    { 
        field: 'task', 
        headerName: 'Tên Task', 
        width: 150, 
        editable: true 
    },
    { 
        field: 'day', 
        headerName: 'Ngày', 
        width: 150, 
        editable: true 
    },
    { 
        field: 'hours', 
        headerName: 'Giờ', 
        width: 150, 
        editable: true 
    },
    { 
        field: 'target', 
        headerName: 'Mục Tiêu', 
        width: 150, 
        editable: true 
    },
    {
        field: 'estimated', 
        headerName: 'Hoàn Thành Dự Kiến', 
        width: 250, 
        editable: true, 
        valueGetter: e => {
            return e.value + "%"
        }
    },
    {
        field: 'rate', 
        headerName: 'Hoàn Thành Thực Tế', 
        width: 250, 
        editable: true, 
        valueGetter: e => {
            return e.value + "%"
        }
    },
    { 
        field: 'note', 
        headerName: 'Ghi Chú', 
        width: 300, 
        editable: true 
    }
];

export default columnTable