import { Button, Typography } from '@mui/material';
import { FC } from 'react';
import { ChapterGroupDetails } from 'src/models/ChapterGroup';
import { WithMaterialUI } from './create-group-popup';
// import CustomizedDialogs from './create-group-popup';
interface Props {
  allChapterGroups: ChapterGroupDetails[];
  setAllChapterGroups: React.Dispatch<
    React.SetStateAction<ChapterGroupDetails[]>
  >;
}

const PageHeader: FC<Props> = ({ allChapterGroups, setAllChapterGroups }) => {
  return (
    <>
      <Typography variant="h3" component="h3" gutterBottom>
        Chapter Groups
      </Typography>
      <Typography variant="subtitle2">
        Chapter Groups of the Budget App
      </Typography>
      <div style={{ height: 20 }}></div>
      <WithMaterialUI
        allChapterGroups={allChapterGroups}
        setAllChapterGroups={setAllChapterGroups}
      />
    </>
  );
};

// function PageHeader() {
//   return (
//     <>
//       <Typography variant="h3" component="h3" gutterBottom>
//         Chapter Groups
//       </Typography>
//       <Typography variant="subtitle2">
//         Chapter Groups of the Budget App
//       </Typography>
//       <WithMaterialUI />
//     </>
//   );
// }

export default PageHeader;
