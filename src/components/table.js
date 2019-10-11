import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import InputBase from '@material-ui/core/InputBase';

const columns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'money', label: 'Money', minWidth: 100 },
    { id: 'paintings', label: 'Paintings', minWidth: 100 },
    { id: 'value', label: 'Value', minWidth: 100 },
    { id: 'kudos', label: 'Kudos', minWidth: 100 },
    { id: 'change', minWidth: 50 },
  ];

function createData(name, paintings, money, value, kudos) {
    return { name, paintings, money, value, kudos };
}

const useStyles = makeStyles({
    root: {
      width: '100%',
    },
    tableWrapper: {
      maxHeight: 440,
      overflow: 'auto',
    },
  });

const rows = [
    createData('Julia Opatrny', '5', '9,000', '200', '50'),
    createData('Donald Holley', '6', '4,000', '400', '85'),
    createData('Matt Jenkins', '8', '1,500', '350', '35'),
];

export default function StickyHeadTable() {
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = event => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };
  
    return (
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map(column => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map(column => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                            { (column.id == 'change') ? 
                            (<Button variant="contained">Save Edit</Button>)
                             : 
                            <InputBase
                             defaultValue={value}
                             inputProps={{
                                 'aria-label': 'description',
                                 }}
                            />
                            // <Input
                            // defaultValue={value}
                            // inputProps={{
                            //   'aria-label': 'description',
                            //   }}
                            // />
                          }
                          {/* {column.format && typeof value === 'number' ? column.format(value) : value} */}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'previous page',
          }}
          nextIconButtonProps={{
            'aria-label': 'next page',
          }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    );
  }