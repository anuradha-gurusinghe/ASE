import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { RouteObject } from 'react-router';

import SidebarLayout from 'src/layouts/SidebarLayout';

import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

const Signin = Loader(
  lazy(() => import('src/content/pages/SigninPage/signin'))
);

// Pages

const Overview = Loader(lazy(() => import('src/content/overview')));

// Dashboards

const Crypto = Loader(lazy(() => import('src/content/dashboards/Crypto')));

// Applications

const Messenger = Loader(
  lazy(() => import('src/views/vehicles'))
);
const AllUsers = Loader(
  lazy(() => import('src/views/all-stations'))
);
const AllTestUsers = Loader(
  lazy(() => import('src/views/all-requests'))
);
const Transactions = Loader(
  lazy(() => import('src/views/distribution'))
);
const UserProfile = Loader(
  lazy(() => import('src/views/profile'))
);
const UserSettings = Loader(
  lazy(() => import('src/views/settings'))
);
const Restocked = Loader(
  lazy(() => import('src/views/re-stocks'))
);

const ApprovedRequests = Loader(
  lazy(() => import('src/views/approved-requests'))
);

const PendingRequests = Loader(
  lazy(() => import('src/views/pending-requests'))
);

const CanceledRequests = Loader(
  lazy(() => import('src/views/canceled-requests'))
);

const AskForChangeRequests = Loader(
  lazy(() => import('src/views/ask-for-change-requests'))
);

// Components

const Buttons = Loader(
  lazy(() => import('src/content/pages/Components/Buttons'))
);
const Modals = Loader(
  lazy(() => import('src/content/pages/Components/Modals'))
);
const Accordions = Loader(
  lazy(() => import('src/content/pages/Components/Accordions'))
);
const Tabs = Loader(lazy(() => import('src/content/pages/Components/Tabs')));
const Badges = Loader(
  lazy(() => import('src/content/pages/Components/Badges'))
);
const Tooltips = Loader(
  lazy(() => import('src/content/pages/Components/Tooltips'))
);
const Avatars = Loader(
  lazy(() => import('src/content/pages/Components/Avatars'))
);
const Cards = Loader(lazy(() => import('src/content/pages/Components/Cards')));
const Forms = Loader(lazy(() => import('src/content/pages/Components/Forms')));

// Status

const Status404 = Loader(
  lazy(() => import('src/content/pages/Status/Status404'))
);
const Status500 = Loader(
  lazy(() => import('src/content/pages/Status/Status500'))
);
const StatusComingSoon = Loader(
  lazy(() => import('src/content/pages/Status/ComingSoon'))
);
const StatusMaintenance = Loader(
  lazy(() => import('src/content/pages/Status/Maintenance'))
);
import AllChapterGroups from './views/failed-tokens';
import AllIcons from './content/applications/Icons';
import ApplicationsTransactions from 'src/views/distribution';

const routes: RouteObject[] = [
  {
    path: '',
    element: <SidebarLayout />,
    children: [
      {
        path: '/',
        element: <AllUsers />
      },
      {
        path: 'analytics',
        element: <Navigate to="/" replace />
      },
      {
        path: 'status',
        children: [
          {
            path: '',
            element: <Navigate to="404" replace />
          },
          {
            path: '404',
            element: <Status404 />
          },
          {
            path: '500',
            element: <Status500 />
          },
          {
            path: 'maintenance',
            element: <StatusMaintenance />
          },
          {
            path: 'coming-soon',
            element: <StatusComingSoon />
          }
        ]
      },
      {
        path: '*',
        element: <Status404 />
      }
    ]
  },

  {
    path: 'sign-in',
    element: <Signin />,
    children: [
      {
        path: '',
        element: <Signin />
      },
      {
        path: '*',
        element: <Status404 />
      }
    ]
  },

  {
    path: 'dashboards',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="analytics" replace />
      },
      {
        path: 'analytics',
        element: <Crypto />
      },
      {
        path: 'messenger',
        element: <Messenger />
      }
    ]
  },

  {
    path: 'management',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="" replace />
      },
      {
        path: 'all-stations',
        element: <AllUsers />
      },
      {
        path: 'all-requests',
        element: <AllTestUsers />
      },
      {
        path: 'approved-requests',
        element: <ApprovedRequests />
      },
      {
        path: 'pending-requests',
        element: <PendingRequests />
      },
      {
        path: 'canceled-requests',
        element: <CanceledRequests />
      },
      {
        path: 'ask-for-change-requests',
        element: <AskForChangeRequests />
      },
      {
        path: 'failed-tokens',
        element: <AllChapterGroups />
      },
      {
        path: 'restocked-tokens',
        element: <Restocked />
      },
      {
        path: 'fuel-distribute',
        element: <ApplicationsTransactions />
      },
      {
        path: 'vehicles',
        element: <Messenger />
      },
      {
        path: 'all-chapter-groups',
        element: <AllChapterGroups />
      },
      {
        path: 'all-icons',
        element: <AllIcons />
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            element: <Navigate to="details" replace />
          },
          {
            path: 'details',
            element: <UserProfile />
          },
          {
            path: 'settings',
            element: <UserSettings />
          }
        ]
      }
    ]
  },

  {
    path: '/components',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="buttons" replace />
      },
      {
        path: 'buttons',
        element: <Buttons />
      },
      {
        path: 'modals',
        element: <Modals />
      },
      {
        path: 'accordions',
        element: <Accordions />
      },
      {
        path: 'tabs',
        element: <Tabs />
      },
      {
        path: 'badges',
        element: <Badges />
      },
      {
        path: 'tooltips',
        element: <Tooltips />
      },
      {
        path: 'avatars',
        element: <Avatars />
      },
      {
        path: 'cards',
        element: <Cards />
      },
      {
        path: 'forms',
        element: <Forms />
      }
    ]
  }
];

export default routes;
