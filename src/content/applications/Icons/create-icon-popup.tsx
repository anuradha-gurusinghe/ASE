import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {TextField} from '@mui/material';
import { ManagementServices } from 'src/services/ManagementServices';
import Swal from 'sweetalert2';
import * as yup from 'yup';
import { useFormik } from 'formik';
import {useState } from 'react';
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
import { IconDetails } from 'src/models/Icon';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  },
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
    AllIcons: IconDetails[];
    setAllIcons: React.Dispatch<
    React.SetStateAction<IconDetails[]>
  >;
}


export const WithMaterialUI: React.FC<Props> = ({ 
  AllIcons,
  setAllIcons
}) => {

 
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const sendRequest = (value) => {
    setOpen(false);
    const formData = new FormData();
    formData.append('name', value);
    formData.append('file', file);

    ManagementServices.createIcon(formData).then((res) => {
      if (res.success) {
        setAllIcons([...AllIcons, res.data]);
        Swal.fire('New Icon Added');
      } else {
        Swal.fire({
          icon: 'error',
          title: res.error,
          confirmButtonColor: '#FD7F00'
        });
      }
    });
  };


  const [file, setFile] = useState(null);


   const handleChange = (e) => {
        setFile(e.target.files[0]);
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

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Create New Icon
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          Create a New Icon
        </BootstrapDialogTitle>
         <DialogContent dividers>
          <form onSubmit={formik.handleSubmit}>
          
          <TextField
              fullWidth
              id="category"
              name="category"
              label="Icon Name"
              value={formik.values.category}
              onChange={formik.handleChange}
              error={
                formik.touched.category && Boolean(formik.errors.category)
              }
              helperText={formik.touched.category && formik.errors.category}
            />

            <div style={{ height: 20 }}></div>
            <>
            <input
            
              style={{ display: 'none' }}
              accept=".svg"
              id="contained-button-file"
              multiple
              type="file"
              onChange={handleChange}
            />
            <label htmlFor="contained-button-file">
              <Button
              startIcon={<UploadTwoToneIcon />} variant="contained" 
              color="primary" 
              component="span">
                Upload SVG
              </Button>
            </label>
            {file && <p>File: {file.name}</p>}
          </>
       
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