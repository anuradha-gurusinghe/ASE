import { ChangeEvent, FC, useContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { Card, Box, CardHeader, FormControl, InputLabel, Select, MenuItem, Divider, TableContainer, Table, TableHead, TableRow, TableCell, Checkbox, TableBody, Typography, Tooltip, IconButton, TablePagination, useTheme } from "@mui/material";
import BulkActions from "../../views/distribution/BulkActions";
import numeral from 'numeral';;
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import UserContext from "src/context/UserContext";
import { ManagementServices } from "src/services/ManagementServices";
import Swal from "sweetalert2";
import { ChapterDetails } from './../../../../models/Chapter';
// const [user, setUser] = useContext(UserContext);


interface AllUserTableProps {
    className?: string;
    allChapters: ChapterDetails[];
}

interface Filters {
    status?: any;
}

const applyFilters = (
    AllChapters: ChapterDetails[],
    filters: Filters
  ): any[] => {
    return AllChapters.filter((user) => {
      let matches = true;
  
      if (filters.status && user.status !== filters.status) {
        matches = false;
      }
  
      return matches;
    });
  };
  
  const applyPagination = (
    allChapters: ChapterDetails[],
    page: number,
    limit: number
  ): any[] => {
    return allChapters.slice(page * limit, page * limit + limit);
  };

const AllChaptersTable: FC = () => {
    const [selectedAllChapters, setSelectedAllChapters] = useState<string[]>(
        []
      );
      const selectedBulkActions = selectedAllChapters.length > 0;
      const [page, setPage] = useState<number>(0);
      const [limit, setLimit] = useState<number>(5);
      const [filters, setFilters] = useState<Filters>({
        status: null
      });

      const [allChapters, setAllChapters] = useState([] as ChapterDetails[]);
      const LIMIT_P_C = 10;
      const LIMIT_A_C = 10;
      
      const [isOffset_p_c, setOffset_p_c] = useState<number>(0);
      const [seeMore_p_c, setSeeMore_p_c] = useState(false);
      
      const [isOffset_a_c, setOffset_a_c] = useState<number>(0);
      const [seeMore_a_c, setSeeMore_a_c] = useState(false);
      
      
      useEffect(() => {
        getChapters();
      
      }, []);

      const getChapters =()=>{
        ManagementServices.getAllChapters(LIMIT_P_C, isOffset_p_c).then(res => {
          if (res.success) {
            setAllChapters(res.data);
              setSeeMore_p_c(res.data.length > 0 && res.data.length == LIMIT_P_C);
          } else {
              setSeeMore_p_c(false);
          }
    
      });
      }

      // const updateChapter = (user: ChapterDetails | undefined) => {
      //   if (user) {
      //     Swal.fire({
      //       title: "Change Status",
      //       input: "select",
      //       inputOptions:VerifyStatus,
      //       inputValue: user.status,
      //       inputAttributes: {
      //         autocapitalize: "off",
      //         placeholder: 'Update User',
      //       },
      //       showCancelButton: true,
      //       confirmButtonText: "Update",
      //       showLoaderOnConfirm: true,
      //       confirmButtonColor: "#FD7F00",
      //     }).then(result => {
      //       if (result.isConfirmed) {
      //         if (result.value == "" || result.value == undefined || result.value == null) {
      //           Swal.fire({
      //             icon: "error",
      //             title: "Invalid value. Please try again later.",
      //             confirmButtonColor: "#FD7F00",
      //           });
      //         } else {
      //           const data = {
      //             userId: user?._id,
      //             status: result.value,
      //           };
      //           ManagementServices.updateChapter(data).then(res => {
      //             if (res.success) getChapters();
      //             else {
      //               Swal.fire({
      //                 icon: "error",
      //                 title: res.error,
      //                 confirmButtonColor: "#FD7F00",
      //               });
      //             }
      //           });
      //         }
      //       }
      //     });
      //   }
      // };
      

      const statusOptions = [
        {
            id: 'ALL',
            name: 'ALL'
          },
        {
          id: 'PENDING',
          name: 'PENDING'
        },
        {
          id: 'VERIFIED',
          name: 'VERIFIED'
        },
        {
          id: 'BLOCKED',
          name: 'BLOCKED'
        },
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
    
      const filteredAllChapters = applyFilters(allChapters, filters);
      const paginatedAllChapters = applyPagination(
        filteredAllChapters,
        page,
        limit
      );
      const selectedSomeCryptoOrders =
        selectedAllChapters.length > 0 &&
        selectedAllChapters.length < allChapters.length;
      const selectedAllCryptoOrders =
      selectedAllChapters.length === allChapters.length;
      const theme = useTheme();
      
    return(
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
                title="All Chapters"
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
                    <TableCell>Chapter Name</TableCell>
                    <TableCell>Chapter Group</TableCell>
                    <TableCell>Allocated Budget</TableCell>
                    <TableCell>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {paginatedAllChapters.map((chapter) => {
                    const isCryptoOrderSelected = selectedAllChapters.includes(
                      chapter._id
                    );
                    return (
                        <TableRow
                        hover
                        key={chapter._id}
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
                            {chapter.chapterName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>
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
                            {chapter.chapterGroup.chapterGroup}
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
                            {chapter.allotedBudget}
                            </Typography>
                        </TableCell>
                        {/* <TableCell>
                            <Typography
                            variant="body1"
                            fontWeight="bold"
                            color="text.primary"
                            gutterBottom
                            noWrap
                            >
                            {chapter.createdBy}
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
                            {chapter.createdAt}
                            </Typography>
                        </TableCell> */}
                        <TableCell>
                            <Typography
                            variant="body1"
                            fontWeight="bold"
                            color="text.primary"
                            gutterBottom
                            noWrap
                            >
                            {chapter.status}
                            </Typography>
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
                count={filteredAllChapters.length}
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
}

AllChaptersTable.propTypes = {
    allUsers: PropTypes.array.isRequired
};
  
AllChaptersTable.defaultProps = {
    allUsers: []
};

export default AllChaptersTable;