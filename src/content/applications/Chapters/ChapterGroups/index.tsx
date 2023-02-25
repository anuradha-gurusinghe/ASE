import { Helmet } from 'react-helmet-async';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import PageHeader from './PageHeader';
import Footer from 'src/components/Footer';
import { Container, Grid, Typography } from '@mui/material';
import { WithMaterialUI } from './create-group-popup';
import { useState } from 'react';
import { ChapterGroupDetails } from 'src/models/ChapterGroup';
import AllGroupsTable from './ChapterGroupsTable';

const AllChapterGroups = () => {
  const [allChapterGroups, setAllChapterGroups] = useState(
    [] as ChapterGroupDetails[]
  );
  return (
    <>
      <Helmet>
        <title>All Chapter Groups - Applications</title>
      </Helmet>

      <PageTitleWrapper>
        <>
          <PageHeader
            allChapterGroups={allChapterGroups}
            setAllChapterGroups={setAllChapterGroups}
          />
        </>
      </PageTitleWrapper>

      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <AllGroupsTable
              allChapterGroups={allChapterGroups}
              setAllChapterGroups={setAllChapterGroups}
            />
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </>
  );
};

export default AllChapterGroups;
