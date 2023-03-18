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
import numeral from 'numeral';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import UserContext from 'src/context/UserContext';
import { UserDetails, VerifyStatus } from 'src/models/User';
import { ManagementServices } from 'src/services/ManagementServices';
import Swal from 'sweetalert2';
import { activeStatus } from 'src/models/ChapterGroup';
import { DeleteTwoTone } from '@mui/icons-material';
import AllCategories from './index';
import { IconDetails } from 'src/models/Icon';
// const [user, setUser] = useContext(UserContext);
interface AllCategoryTableProps {
  // className?: string;
  // allUsers: UserDetails[];
}

interface Filters {
  status?: any;
}

const applyFilters = (
  AllChapterGroups: IconDetails[],
  filters: Filters
): any[] => {
  return AllChapterGroups.filter((category) => {
    let matches = true;

    let statusString;
    if (category.isActive === true) {
      statusString = 'ACTIVE';
      if (filters.status && statusString !== filters.status) {
        matches = false;
      }
    } else {
      statusString = 'INACTIVE';
      if (filters.status && statusString !== filters.status) {
        matches = false;
      }
    }

    return matches;
  });
};

const applyPagination = (
  allIcons: IconDetails[],
  page: number,
  limit: number
): any[] => {
  return allIcons.slice(page * limit, page * limit + limit);
};

interface Props {
  AllIcons: IconDetails[];
  setAllIcons: React.Dispatch<
    React.SetStateAction<IconDetails[]>
  >;
}

const AllIconTable: FC<Props> = ({
    AllIcons,
    setAllIcons
}) => {
  const [selectedAllIcons, setSelectedAllIcons] = useState<string[]>([]);
  const selectedBulkActions = selectedAllIcons.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({
    status: null
  });

  // const [allChapterGroups, setAllChapterGroups] = useState(
  //   [] as ChapterGroupDetails[]
  // );
  const LIMIT_P_C = 10;
  const LIMIT_A_C = 10;

  const [isOffset_p_c, setOffset_p_c] = useState<number>(0);
  const [seeMore_p_c, setSeeMore_p_c] = useState(false);

  const [isOffset_a_c, setOffset_a_c] = useState<number>(0);
  const [seeMore_a_c, setSeeMore_a_c] = useState(false);

  useEffect(() => {
    geticons();
  }, []);

  const geticons = () => {
    ManagementServices.getAllIcons(LIMIT_P_C, isOffset_p_c).then(
      (res) => {
        if (res.success) {
          setAllIcons(res.data);
          setSeeMore_p_c(res.data.length > 0 && res.data.length == LIMIT_P_C);
        } else {
          setSeeMore_p_c(false);
        }
      }
    );
  };

  const updateCategory= (icon: IconDetails | undefined) => {
    if (icon) {
      Swal.fire({
        title: 'Change Status',
        input: 'select',
        inputOptions: activeStatus,
        inputValue:
        icon.isActive === true ? activeStatus.ACTIVE : activeStatus.INACTIVE,
        inputAttributes: {
          autocapitalize: 'off',
          placeholder: 'Update Status'
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
              iconId: icon?._id,
              isActive: result.value === activeStatus.ACTIVE ? true : false
            };
            ManagementServices.updateIcon(data).then((res) => {
              if (res.success) geticons();
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

  const deleteCategory = (iconId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        ManagementServices.deleteIcon(iconId).then((res) => {
          if (res.success) {
            setAllIcons(
                AllIcons.filter(
                (IconDetails) => IconDetails._id !== iconId
              )
            );
            Swal.fire('icon Removed');
          } else {
            Swal.fire({
              icon: 'error',
              title: res.error,
              confirmButtonColor: '#FD7F00'
            });
          }
        });
      }
    });
  };

  const statusOptions = [
    {
      id: 'ALL',
      name: 'ALL'
    },
    {
      id: 'ACTIVE',
      name: 'ACTIVE'
    },
    {
      id: 'INACTIVE',
      name: 'INACTIVE'
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

  const filteredAllIcons = applyFilters(AllIcons, filters);
  const paginatedAllIcons = applyPagination(filteredAllIcons, page, limit);
  const selectedSomeCryptoOrders =
    selectedAllIcons.length > 0 &&
    selectedAllIcons.length < AllIcons.length;
  const selectedAllCryptoOrders =
  selectedAllIcons.length === AllIcons.length;
  const theme = useTheme();

  return (
    <>
      <Card>
        {selectedBulkActions && (
          <Box flex={1} p={2}>
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
            title="Icons"
          />
        )}
        <Divider />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
              <TableCell >Icon</TableCell>
                <TableCell>Icon Name</TableCell>
                <TableCell>Icon ID</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody   style={{ backgroundColor: '#b6bab5' }}>
              {AllIcons.map((icon) => {
                return (
                  <TableRow hover key={icon._id}>
                    <TableCell>
                    <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                         {icon.icon && <img src={`data:image/svg+xml;base64,${icon.icon}`}/>}
                        
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
                        {icon.name}
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
                        {icon._id}
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
                        {icon.isActive === true ? 'ACTIVE' : 'INACTIVE'}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      {/* <Tooltip title="delete Group" arrow>
                        <IconButton
                          onClick={() => deleteCategory(category._id)}
                          sx={{
                            '&:hover': {
                              background: theme.colors.primary.lighter
                            },
                            color: theme.palette.primary.main
                          }}
                          color="inherit"
                          size="small"
                        >
                          <DeleteTwoTone fontSize="small" />
                        </IconButton>
                      </Tooltip> */}
                      <Tooltip title="Edit Group" arrow>
                        <IconButton
                          onClick={() => updateCategory(icon)}
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
                      <Tooltip title="Delete Order" arrow>
                            <IconButton
                                onClick={() => deleteCategory(icon._id)}
                                sx={{
                                '&:hover': { background: theme.colors.error.lighter },
                                color: theme.palette.error.main
                                }}
                                color="inherit"
                                size="small"
                            >
                                <DeleteTwoToneIcon fontSize="small" />
                            </IconButton>
                            </Tooltip>
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
            count={filteredAllIcons.length}
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

// AllGroupsTable.propTypes = {
//   allGroups: PropTypes.array.isRequired
// };

// AllGroupsTable.defaultProps = {
//   allGroups: []
// };

export default AllIconTable;
