import { Typography } from '@mui/material';
import { WithMaterialUI } from './create-category-popup';

function PageHeader({ AllCategories, setAllCategories }) {

  return (
    <>
      <Typography variant="h3" component="h3" gutterBottom>
        All Categories
      </Typography>
      <Typography variant="subtitle2">
        All Categories of the Budget App
      </Typography>
      <WithMaterialUI
        AllCategories={AllCategories}
        setAllCategories={setAllCategories}
      />
    </>
  );
}

export default PageHeader;