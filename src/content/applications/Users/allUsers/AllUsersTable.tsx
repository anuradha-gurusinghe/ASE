import { ChangeEvent, FC, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  Box,
  CardHeader,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
  TableBody,
  Typography,
  Tooltip,
  IconButton,
  TablePagination,
  useTheme
} from '@mui/material';
import BulkActions from '../../Transactions/BulkActions';
import numeral from 'numeral';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import UserContext from 'src/context/UserContext';
import { UserDetails, VerifyStatus } from 'src/models/User';
import { ManagementServices } from 'src/services/ManagementServices';
import Swal from 'sweetalert2';
// const [user, setUser] = useContext(UserContext);
interface AllUserTableProps {
  className?: string;
  allUsers: UserDetails[];
}

interface Filters {
  status?: any;
}

const applyFilters = (AllUsers: UserDetails[], filters: Filters): any[] => {
  return AllUsers.filter((user) => {
    let matches = true;

    if (filters.status && user.verifiedStatus !== filters.status) {
      matches = false;
    }

    return matches;
  });
};

const applyPagination = (
  allUsers: UserDetails[],
  page: number,
  limit: number
): any[] => {
  return allUsers.slice(page * limit, page * limit + limit);
};

const AllUsersTable: FC = () => {
  const [selectedAllUsers, setSelectedAllUsers] = useState<string[]>([]);
  const selectedBulkActions = selectedAllUsers.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({
    status: null
  });

  const [allUsers, setAllUsers] = useState([] as UserDetails[]);
  const LIMIT_P_C = 10;
  const LIMIT_A_C = 10;

  const [isOffset_p_c, setOffset_p_c] = useState<number>(0);
  const [seeMore_p_c, setSeeMore_p_c] = useState(false);

  const [isOffset_a_c, setOffset_a_c] = useState<number>(0);
  const [seeMore_a_c, setSeeMore_a_c] = useState(false);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    ManagementServices.getAllUsers(LIMIT_P_C, isOffset_p_c).then((res) => {
      if (res.success) {
        setAllUsers(res.data);
        setSeeMore_p_c(res.data.length > 0 && res.data.length == LIMIT_P_C);
      } else {
        setSeeMore_p_c(false);
      }
    });
  };

  const updateUser = (user: UserDetails | undefined) => {
    if (user) {
      Swal.fire({
        title: 'Change Status',
        input: 'select',
        inputOptions: VerifyStatus,
        inputValue: user.verifiedStatus,
        inputAttributes: {
          autocapitalize: 'off',
          placeholder: 'Update User'
        },
        showCancelButton: true,
        confirmButtonText: 'Update',
        showLoaderOnConfirm: true,
        confirmButtonColor: '#FD7F00'
      }).then((result) => {
        if (result.isConfirmed) {
          if (
            result.value == '' ||
            result.value == undefined ||
            result.value == null
          ) {
            Swal.fire({
              icon: 'error',
              title: 'Invalid value. Please try again later.',
              confirmButtonColor: '#FD7F00'
            });
          } else {
            const data = {
              userId: user?._id,
              email: user?.email,
              name: user?.name,
              verifiedStatus: result.value
            };
            ManagementServices.updateUser(data).then((res) => {
              if (res.success) getUsers();
              else {
                Swal.fire({
                  icon: 'error',
                  title: res.error,
                  confirmButtonColor: '#FD7F00'
                });
              }
            });
          }
        }
      });
    }
  };

  const statusOptions = [
    {
      id: 'ALL',
      name: 'ALL'
    },
    // {
    //   id: 'PENDING',
    //   name: 'PENDING'
    // },
    {
      id: 'VERIFIED',
      name: 'VERIFIED'
    },
    {
      id: 'BLOCKED',
      name: 'BLOCKED'
    }
  ];

  const handleStatusChange = (e: ChangeEvent<HTMLInputElement>): void => {
    let value = null;

    if (e.target.value !== 'ALL') {
      value = e.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      status: value
    }));
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredAllUsers = applyFilters(allUsers, filters);
  const paginatedAllUsers = applyPagination(filteredAllUsers, page, limit);
  const selectedSomeCryptoOrders =
    selectedAllUsers.length > 0 && selectedAllUsers.length < allUsers.length;
  const selectedAllCryptoOrders = selectedAllUsers.length === allUsers.length;
  const theme = useTheme();

  return (
    <>
      <Card>
        {selectedBulkActions && (
          <Box flex={1} p={2}>
            <BulkActions />
          </Box>
        )}
        {!selectedBulkActions && (
          <CardHeader
            action={
              <Box width={150}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status || 'ALL'}
                    onChange={handleStatusChange}
                    label="Status"
                    autoWidth
                  >
                    {statusOptions.map((statusOption) => (
                      <MenuItem key={statusOption.id} value={statusOption.id}>
                        {statusOption.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            }
            title="All stations"
          />
        )}
        <Divider />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {/* <TableCell padding="checkbox">
                        <Checkbox
                        color="primary"
                        checked={selectedAllCryptoOrders}
                        indeterminate={selectedSomeCryptoOrders}
                        onChange={handleSelectAllCryptoOrders}
                        />
                    </TableCell> */}
                <TableCell>User Name</TableCell>
                <TableCell>User ID</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedAllUsers.map((user) => {
                const isCryptoOrderSelected = selectedAllUsers.includes(
                  user._id
                );
                return (
                  <TableRow
                    hover
                    key={user._id}
                    selected={isCryptoOrderSelected}
                  >
                    {/* <TableCell padding="checkbox">
                            <Checkbox
                            color="primary"
                            checked={isCryptoOrderSelected}
                            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                handleSelectOneCryptoOrder(event, user._id)
                            }
                            value={isCryptoOrderSelected}
                            />
                        </TableCell> */}
                    <TableCell>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {user.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        noWrap
                      ></Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {user._id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {user.verifiedStatus}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Tooltip title="Edit User" arrow>
                        <IconButton
                          onClick={() => updateUser(user)}
                          sx={{
                            '&:hover': {
                              background: theme.colors.primary.lighter
                            },
                            color: theme.palette.primary.main
                          }}
                          color="inherit"
                          size="small"
                        >
                          <EditTwoToneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {/* <Tooltip title="Delete Order" arrow>
                            <IconButton
                                sx={{
                                '&:hover': { background: theme.colors.error.lighter },
                                color: theme.palette.error.main
                                }}
                                color="inherit"
                                size="small"
                            >
                                <DeleteTwoToneIcon fontSize="small" />
                            </IconButton>
                            </Tooltip> */}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Box p={2}>
          <TablePagination
            component="div"
            count={filteredAllUsers.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 25, 30]}
          />
        </Box>
      </Card>
    </>
  );
};

AllUsersTable.propTypes = {
  allUsers: PropTypes.array.isRequired
};

AllUsersTable.defaultProps = {
  allUsers: []
};

export default AllUsersTable;
