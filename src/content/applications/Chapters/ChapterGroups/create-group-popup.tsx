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
  SelectChangeEvent,
  TextField
} from '@mui/material';
import { ManagementServices } from 'src/services/ManagementServices';
import Swal from 'sweetalert2';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { ChapterGroupDetails } from 'src/models/ChapterGroup';
import { height } from '@mui/system';

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

const validationSchema = yup.object({
  groupName: yup.string().required('Group is required')
});
interface Props {
  allChapterGroups: ChapterGroupDetails[];
  setAllChapterGroups: React.Dispatch<
    React.SetStateAction<ChapterGroupDetails[]>
  >;
}
export const WithMaterialUI: React.FC<Props> = ({
  allChapterGroups,
  setAllChapterGroups
}) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [groupName, setGroupName] = React.useState('');
  const [age, setAge] = React.useState('');

  const addGroup = (value) => {
    setOpen(false);
    const data = {
      chapterGroup: value
    };
    ManagementServices.createChapterGroup(data).then((res) => {
      if (res.success) {
        setAllChapterGroups([...allChapterGroups, res.data]);
        Swal.fire('New Group Added');
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
      groupName: ''
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      addGroup(values.groupName);
      formik.resetForm();
    }
  });

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Create New Group
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
          Create a New Group
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              id="groupName"
              name="groupName"
              label=""
              value={formik.values.groupName}
              onChange={formik.handleChange}
              error={
                formik.touched.groupName && Boolean(formik.errors.groupName)
              }
              helperText={formik.touched.groupName && formik.errors.groupName}
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
