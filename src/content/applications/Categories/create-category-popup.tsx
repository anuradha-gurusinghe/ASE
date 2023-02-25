import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Options,
  SelectChangeEvent,
  TextField
} from '@mui/material';
import { ManagementServices } from 'src/services/ManagementServices';
import Swal from 'sweetalert2';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { height } from '@mui/system';
import { CategoryDetails } from 'src/models/Category';
import { SketchPicker } from 'react-color';
import { useEffect, useState } from 'react';
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
import { ChapterGroupDetails } from 'src/models/ChapterGroup';
import { IconDetails } from 'src/models/Icon';
import { BorderAllRounded, } from '@mui/icons-material';


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

const validationSchema = yup.object({
  category: yup.string().required('Category Name is required')
});

interface Props {
  AllCategories: CategoryDetails[];
  setAllCategories: React.Dispatch<
    React.SetStateAction<CategoryDetails[]>
  >;
}





export const WithMaterialUI: React.FC<Props> = ({
  AllCategories,
  setAllCategories
}) => {
  
  const [allChapterGroups, setAllChapterGroups] = useState([] as ChapterGroupDetails[]);
  const [AllIcons, setAllIcons] = useState([] as IconDetails[]);
  
  useEffect(() => {
    getGroups();
    geticons();
  }, []);

  const getGroups = () => {
    ManagementServices.getAllChapterGroups().then(
      (res) => {
        if (res.success) {
          setAllChapterGroups(res.data);
        } else {

        }
      }
    );
  };

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

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };



  const sendRequest = (value) => {
    setOpen(false);
    const color = bubbleColor;
    console.log(color);
    const data = {
      categoryName: value,
      categoryColor:color,
      iconValue:Icons,
      chapterGroup:ChapterGroup,
    };
   
    ManagementServices.createCategory(data).then((res) => {
      if (res.success) {
        getcategories()
        Swal.fire('New Category Added');
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
    ManagementServices.getAllCategories().then(
      (res) => {
        if (res.success) {
          setAllCategories(res.data);

        } else {
     
        }
      }
    );
  };
  const [bubbleColor, setBackgroundColor] = React.useState('#ffffff');
  const [isdropOpen, setIsdropOpen] = useState(false);
  const [file, setFile] = useState(null);

  const handlebackgroundColorChange = (color: any) => {
    setBackgroundColor(color.hex);
  };
   const handleChange = (e) => {
        setFile(e.target.files[0]);
    };


  const toggleDropdown = () => {
    setIsdropOpen(!isdropOpen);
  };


  const formik = useFormik({
    initialValues: {
      category: ''
    },
    
    validationSchema: validationSchema,
    onSubmit: (values) => {
      sendRequest(values.category);
      formik.resetForm();
    }
  });
  const [ChapterGroup, setChapterGroup] = useState();
  const [Icons, setIcon] = useState();

  const handlechapterGroup = (event) => {
    setChapterGroup(event.target.value);
    };

  const handleicon = (event) => {
    setIcon(event.target.value);
    };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Create New Category
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}>
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}>
          Create a New Category
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              id="category"
              name="category"
              label="category Name"
              value={formik.values.category}
              onChange={formik.handleChange}
              error={
                formik.touched.category && Boolean(formik.errors.category)}
              helperText={formik.touched.category && formik.errors.category}
            />

            <div style={{ height: 20 }}></div>
            <InputLabel>Select Chapter Group</InputLabel>
            <Select
               style={{width: `300px`}}
                id="outlined-select-currency"
                label="Select Chapter Group"
                value={ChapterGroup}
                onChange={handlechapterGroup}>
                {allChapterGroups.map(option => (
                  <MenuItem key={option._id} value={option._id}>
                  {option.chapterGroup}
                </MenuItem>
                ))}
              </Select>
  
            <div style={{ height: 20 }}></div>
            <InputLabel>Select Cateory Icon</InputLabel>
            <Select
                style={{width: `300px`}}
                id="filled-select-currency"
                label="Select Category Icon"
                variant="filled"
                value={Icons}
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
            <div style={{ height: 20 }}></div>

            <Button color="primary" variant="contained" type="submit">
              Create
            </Button>
          </form>
        </DialogContent>
        <DialogActions></DialogActions>
      </BootstrapDialog>
    </div>
  );
};