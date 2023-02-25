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
  Avatar,
  styled,
  Button,
  TextField,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';
import BulkActions from '../Transactions/BulkActions';
import numeral from 'numeral';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import UserContext from 'src/context/UserContext';
import { UserDetails, VerifyStatus } from 'src/models/User';
import { ManagementServices } from 'src/services/ManagementServices';
import Swal from 'sweetalert2';
import { activeStatus } from 'src/models/ChapterGroup';
import { DeleteTwoTone } from '@mui/icons-material';
import { CategoryDetails } from 'src/models/Category';
import AllCategories from './index';
import { IconDetails } from 'src/models/Icon';
import { SketchPicker } from 'react-color';
// const [user, setUser] = useContext(UserContext);

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
    <DialogTitle sx={{ m: 0, p: 5 }} {...other}>
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

const AvatarPrimary = styled(Avatar)(
  ({ theme }) => `
      background: ${theme.colors.primary.lighter};
      color: ${theme.colors.primary.main};
      width: ${theme.spacing(4)};
      height: ${theme.spacing(4)};
`
);

interface AllCategoryTableProps {
  // className?: string;
  // allUsers: UserDetails[];
}

interface Filters {
  status?: any;
}

const applyFilters = (
  AllChapterGroups: CategoryDetails[],
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
  allGroups: CategoryDetails[],
  page: number,
  limit: number
): any[] => {
  return allGroups.slice(page * limit, page * limit + limit);
};

interface Props {
  AllCategories: CategoryDetails[];
  setAllCategories: React.Dispatch<
    React.SetStateAction<CategoryDetails[]>
  >;
}

const AllCategoryTable: FC<Props> = ({
  AllCategories,
  setAllCategories
}) => {
  const [AllIcons, setAllIcons] = useState([] as IconDetails[]);
  const [selectedAllGroups, setSelectedAllGroups] = useState<string[]>([]);
  const selectedBulkActions = selectedAllGroups.length > 0;
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
    getcategories();
    geticons();
  }, []);

  const geticons = () => {
    ManagementServices.getAllIcons().then(
      (res) => {
        if (res.success) {
          setAllIcons(res.data);
        } else {
         
        }
      }
    );
  };
  const [CategoryName, setCategoryName] = useState("");
  const [CategoryId, setCategoryId] = useState();
  const [Status, setStatus] = useState();
  const [Iconid, setIcon] = useState();
  const [open, setOpen] = useState(false);
  const [bubbleColor, setBackgroundColor] = useState('#ffffff');
  const [ChapterId, setChapterId] = useState();
  const handlebackgroundColorChange = (color: any) => {
    setBackgroundColor(color.hex);
  };

  const handleClickOpen = ( categoryid,iconid,status,category,color,chapter) => {
    setIcon(iconid);
    setCategoryId(categoryid);
    setStatus(status);
    setCategoryName(category);
    setBackgroundColor(color);
    setChapterId(chapter)
    setOpen(true);
   
  };

  const handleClose = () => {
    setOpen(false);
  };

  const updateCategory = () => {
    setOpen(false);
    const data = {
      categoryId: CategoryId,
      iconValue:Iconid,
      isActive:Status,
      categoryName: CategoryName,
      color:bubbleColor,
      chapterId:ChapterId
    };

    ManagementServices.updateCategory(data).then((res) => {
      if (res.success) {
        getcategories()
        Swal.fire('Category Updated');
      } else {
        Swal.fire({
          icon: 'error',
          title: res.error,
          confirmButtonColor: '#FD7F00'
        });
      }
    });
  };

  const getcategories = () => {
    ManagementServices.getAllCategories(LIMIT_P_C, isOffset_p_c).then(
      (res) => {
        if (res.success) {
          setAllCategories(res.data);
          setSeeMore_p_c(res.data.length > 0 && res.data.length == LIMIT_P_C);
        } else {
          setSeeMore_p_c(false);
        }
      }
    );
  };

  // const updateCategory= (category: CategoryDetails | undefined) => {
  //   if (category) {
  //     Swal.fire({
  //       title: 'Change Status',
  //       input: 'select',
  //       inputOptions: activeStatus,
  //       inputValue:
  //       category.isActive === true ? activeStatus.ACTIVE : activeStatus.INACTIVE,
  //       inputAttributes: {
  //         autocapitalize: 'off',
  //         placeholder: 'Update Status'
  //       },
  //       showCancelButton: true,
  //       confirmButtonText: 'Update',
  //       showLoaderOnConfirm: true,
  //       confirmButtonColor: '#FD7F00'
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         if (
  //           result.value == '' ||
  //           result.value == undefined ||
  //           result.value == null
  //         ) {
  //           Swal.fire({
  //             icon: 'error',
  //             title: 'Invalid value. Please try again later.',
  //             confirmButtonColor: '#FD7F00'
  //           });
  //         } else {
  //           const data = {
  //             categoryId: category?._id,
  //             isActive: result.value === activeStatus.ACTIVE ? true : false
  //           };
  //           ManagementServices.updateCategoryStatus(data).then((res) => {
  //             if (res.success) getcategories();
  //             else {
  //               Swal.fire({
  //                 icon: 'error',
  //                 title: res.error,
  //                 confirmButtonColor: '#FD7F00'
  //               });
  //             }
  //           });
  //         }
  //       }
  //     });
  //   }
  // };

  const deleteCategory = (categoryId) => {
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
        ManagementServices.deleteCategory(categoryId).then((res) => {
          if (res.success) {
            setAllCategories(
              AllCategories.filter(
                (CategoryDetails) => CategoryDetails._id !== categoryId
              )
            );
            Swal.fire('Category Removed');
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

  const statusupdateOptions = [

    {
      id: "true",
      name: activeStatus.ACTIVE
    },
    {
      id: "false",
      name: activeStatus.INACTIVE
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

  const filteredAllGroups = applyFilters(AllCategories, filters);
  const paginatedAllGroups = applyPagination(filteredAllGroups, page, limit);
  const selectedSomeCryptoOrders =
    selectedAllGroups.length > 0 &&
    selectedAllGroups.length < AllCategories.length;
  const selectedAllCryptoOrders =
    selectedAllGroups.length === AllCategories.length;
  const theme = useTheme();

  const handleUpdateStatus = (event) => {
    setStatus(event.target.value);
    };

  const handleicon = (event) => {
    setIcon(event.target.value);
    };

  return (
    <>
    <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}>
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}>
          Update Category Icon
        </BootstrapDialogTitle>
        <DialogContent dividers>
        <InputLabel>Status</InputLabel>
          <Select
          style={{width: `300px`}}
          id="filled-select-currency"
          variant="filled"
          value={Status}
          onChange={handleUpdateStatus}
          label="Status"
          autoWidth
          >
            {statusupdateOptions.map((statusupdateOption) => (
              <MenuItem style={{ width: `300px` }} key={statusupdateOption.id} value={statusupdateOption.id}>
                {statusupdateOption.name}
              </MenuItem>
            ))}
          </Select>
          <div style={{ height: 10 }}></div>
          <TextField
            fullWidth
            id="category"
            name="category"
            label="category Name"
            value={CategoryName}
            onChange={(e)=>setCategoryName(e.target.value)}
          />
          <InputLabel>Select Cateory Icon</InputLabel>
          <Select
              style={{width: `300px`}}
              id="filled-select-currency"
              label="Select Category Icon"
              variant="filled"
              value={Iconid}
              onChange={handleicon}>
              {AllIcons.map((option) => (
              <MenuItem  style={{ backgroundColor: '#b6bab5' }} key={option._id} value={option._id}>
                  {option.icon && <img src={`data:image/svg+xml;base64,${option.icon}`}/>} {`-- ${option.name}`}
              </MenuItem>
            ))}
          </Select>
          <div style={{ height: 10 }}></div>
          <SketchPicker
          color={bubbleColor}
          onChangeComplete={handlebackgroundColorChange}
          />
          <div style={{ height: 10 }}></div>
          <Button color="primary" variant="contained" type="submit" onClick={()=>updateCategory()}>
            Update
          </Button>
          </DialogContent>
        </BootstrapDialog> 

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
                    value={filters.status}
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
            title="Category"
          />
        )}
        <Divider />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
              <TableCell width={5}>Icon</TableCell>
                <TableCell>Category Name</TableCell>
                <TableCell>Chapter group</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align='right'>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedAllGroups.map((category) => {
                return (
                  <TableRow hover key={category._id}>
                
                    <TableCell>
                         <AvatarPrimary style={{ backgroundColor: category.color }}>
                         {category.iconValue.icon && <img src={`data:image/svg+xml;base64,${category.iconValue.icon}`}/>}
                      </AvatarPrimary>
                    </TableCell>
             
                    <TableCell>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {category.category}
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
                        {category.chapterGroup.chapterGroup}
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
                        {category.isActive === true ? 'ACTIVE' : 'INACTIVE'}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Tooltip title="Edit category" arrow>
                        <IconButton
                          onClick={() => handleClickOpen(category._id,category.iconValue._id,category.isActive,category.category,category.color,category.chapterGroup._id)}
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
                                onClick={() => deleteCategory(category._id)}
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

export default AllCategoryTable;
