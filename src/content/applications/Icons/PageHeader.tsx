import { Typography } from '@mui/material';
import { WithMaterialUI } from './create-icon-popup';

function PageHeader({ AllIcons, setAllIcons }) {

  return (
    <>
      <Typography variant="h3" component="h3" gutterBottom>
        All Icons
      </Typography>
      <Typography variant="subtitle2">
        All Icons of the Budget App
      </Typography>
      <WithMaterialUI
        AllIcons={AllIcons}
        setAllIcons={setAllIcons}
      />
    </>
  );
}

export default PageHeader;