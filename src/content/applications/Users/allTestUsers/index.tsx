import { Helmet } from 'react-helmet-async';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import PageHeader from './PageHeader';
import Footer from 'src/components/Footer';
import { Container, Grid } from '@mui/material';
import RecentOrders from '../../Transactions/RecentOrders';

const AllTestUsers = () => {
    return (
        <>
            <Helmet>
                <title>All Test Users - Applications</title>
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
                        <RecentOrders /> 
                     {/* create new Table for All Test  users */}
                    </Grid>
                </Grid>
            </Container>

            <Footer />
        </>
    )
}

export default AllTestUsers;