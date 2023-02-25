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
  useTheme,
  DialogContent,
  TextField,
  Button,
  styled,
  DialogActions,
  Dialog,
  DialogTitle,
  SelectChangeEvent
} from '@mui/material';
import BulkActions from '../../Transactions/BulkActions';
import numeral from 'numeral';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import UserContext from 'src/context/UserContext';
import { UserDetails, VerifyStatus } from 'src/models/User';
import { ManagementServices } from 'src/services/ManagementServices';
import Swal from 'sweetalert2';
import { activeStatus, ChapterGroupDetails } from 'src/models/ChapterGroup';
import { DeleteTwoTone } from '@mui/icons-material';
import { useFormik } from 'formik';
import React from 'react';
import * as yup from 'yup';
import CloseIcon from '@mui/icons-material/Close';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}
function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

// const [user, setUser] = useContext(UserContext);
interface AllChapterGroupTableProps {
  // className?: string;
  // allUsers: UserDetails[];
}

interface Filters {
  status?: any;
}

const applyFilters = (
  AllChapterGroups: ChapterGroupDetails[],
  filters: Filters
): any[] => {
  return AllChapterGroups.filter((group) => {
    let matches = true;

    let statusString;
    if (group.isActive === true) {
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
  allGroups: ChapterGroupDetails[],
  page: number,
  limit: number
): any[] => {
  return allGroups.slice(page * limit, page * limit + limit);
};

interface Props {
  allChapterGroups: ChapterGroupDetails[];
  setAllChapterGroups: React.Dispatch<
    React.SetStateAction<ChapterGroupDetails[]>
  >;
}

const AllGroupsTable: FC<Props> = ({
  allChapterGroups,
  setAllChapterGroups
}) => {
  const [selectedAllGroups, setSelectedAllGroups] = useState<string[]>([]);
  const selectedBulkActions = selectedAllGroups.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({
    status: null
  });

  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState('');
  const [idValue, setIdValue] = React.useState('');
  const handleClickOpen = (groupname, status, id) => {
    if (status === true) {
      setStatus('ACTIVE');
    } else {
      setStatus('INACTIVE');
    }
    setIdValue(id);
    setGroupNameUI(groupname);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [groupName, setGroupName] = React.useState('');
  const [groupNameUI, setGroupNameUI] = React.useState('');

  const validationSchema = yup.object({
    groupNameValue: yup.string().typeError('Not a String')
  });

  const updateGroup = (value) => {
    setOpen(false);
    const data = {
      chapterGroupId: idValue,
      chapterGroup: value.groupNameValue,
      isActive: status === 'ACTIVE' ? true : false
    };

    console.log(data);
    ManagementServices.updateChapterGroup(data).then((res) => {
      if (res.success) {
        let groupArray = allChapterGroups.filter(
          (groupDetails) => groupDetails._id !== idValue
        );

        setAllChapterGroups([...groupArray, res.data]);
        Swal.fire('Group Updated Successfully');
      } else {
        Swal.fire({
          icon: 'error',
          title: res.error,
          confirmButtonColor: '#FD7F00'
        });
      }
    });
  };

  const formik = useFormik({
    initialValues: {
      groupNameValue: ''
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      updateGroup(values);
      formik.resetForm();
    }
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
    getGroups();
  }, []);

  const getGroups = () => {
    ManagementServices.getAllChapterGroups(LIMIT_P_C, isOffset_p_c).then(
      (res) => {
        if (res.success) {
          setAllChapterGroups(res.data);
          setSeeMore_p_c(res.data.length > 0 && res.data.length == LIMIT_P_C);
        } else {
          setSeeMore_p_c(false);
        }
      }
    );
  };

  const deleteGroup = (groupId) => {
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
        ManagementServices.deleteChapterGroup(groupId).then((res) => {
          if (res.success) {
            setAllChapterGroups(
              allChapterGroups.filter(
                (groupDetails) => groupDetails._id !== groupId
              )
            );
            Swal.fire('Group Removed');
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

  const handleChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value);
  };

  const filteredAllGroups = applyFilters(allChapterGroups, filters);
  const paginatedAllGroups = applyPagination(filteredAllGroups, page, limit);
  const selectedSomeCryptoOrders =
    selectedAllGroups.length > 0 &&
    selectedAllGroups.length < allChapterGroups.length;
  const selectedAllCryptoOrders =
    selectedAllGroups.length === allChapterGroups.length;
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
            title="Chapter Groups"
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
                <TableCell>Chapter Group Name</TableCell>
                <TableCell>Chapter Group ID</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedAllGroups.map((group) => {
                return (
                  <TableRow hover key={group._id}>
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
                        {group.chapterGroup}
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
                        {group._id}
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
                        {group.isActive === true ? 'ACTIVE' : 'INACTIVE'}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Tooltip title="delete Group" arrow>
                        <IconButton
                          onClick={() => deleteGroup(group._id)}
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
                      </Tooltip>
                      <Tooltip title="Edit Group" arrow>
                        <IconButton
                          onClick={() =>
                            handleClickOpen(
                              group.chapterGroup,
                              group.isActive,
                              group._id
                            )
                          }
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

        <BootstrapDialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handleClose}
          >
            Update Category Group
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <form onSubmit={formik.handleSubmit}>
              <TextField
                required
                id="groupNameValue"
                label="Group Name"
                defaultValue={groupNameUI}
                variant="filled"
                onChange={formik.handleChange}
                error={
                  formik.touched.groupNameValue &&
                  Boolean(formik.errors.groupNameValue)
                }
                helperText={
                  formik.touched.groupNameValue && formik.errors.groupNameValue
                }
              />
              <div style={{ height: 20 }}></div>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Status</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={status}
                  label="Age"
                  onChange={handleChange}
                >
                  <MenuItem value={'ACTIVE'}>ACTIVE</MenuItem>
                  <MenuItem value={'INACTIVE'}>INACTIVE</MenuItem>
                </Select>
              </FormControl>
              <div style={{ height: 20 }}></div>
              <Button color="primary" variant="contained" type="submit">
                Update
              </Button>
            </form>
          </DialogContent>
        </BootstrapDialog>
        <Box p={2}>
          <TablePagination
            component="div"
            count={filteredAllGroups.length}
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

export default AllGroupsTable;
