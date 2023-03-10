import { Helmet } from 'react-helmet-async';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import PageHeader from './PageHeader';
import Footer from 'src/components/Footer';
import { Container, Grid } from '@mui/material';
import AllUsersTable from './AllChaptersTable';

const AllCahapters = () => {
    
    return (
        <>
            <Helmet>
                <title>All Chapters - Applications</title>
            </Helmet>

            <PageTitleWrapper>
                <PageHeader />
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
                        <AllUsersTable/> 
                    </Grid>
                </Grid>
            </Container>

            <Footer />
        </>
    )
}

export default AllCahapters;