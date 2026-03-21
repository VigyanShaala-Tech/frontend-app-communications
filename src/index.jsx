import 'core-js/stable';
import 'regenerator-runtime/runtime';

import {
  APP_INIT_ERROR, APP_READY, subscribe, initialize, mergeConfig, getConfig,
} from '@edx/frontend-platform';
import { AppProvider, AuthenticatedPageRoute, ErrorPage } from '@edx/frontend-platform/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { Helmet } from 'react-helmet';
import { Routes, Route } from 'react-router-dom';
import messages from './i18n';

import './index.scss';
import BulkEmailTool from './components/bulk-email-tool';
import PageContainer from './components/page-container/PageContainer';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { useState, useEffect } from 'react';
import RestrictionPage from './restriction-page/RestrictionPage';

const RestrictionWrapper = () => {
  const [hasProfileCompleted, setHasProfileCompleted] = useState(true);
  const [canAccessPage, setCanAccessPage] = useState(true);

  useEffect(() => {
    const { LMS_BASE_URL } = getConfig();

    const loadProfileCompletion = async () => {
      try {
        const client = getAuthenticatedHttpClient();
        const { data } = await client.get(`${LMS_BASE_URL}/profile/progress/?role=student`);
        if (data?.percentage === 100) {
          setHasProfileCompleted(true);
        } else {
          setHasProfileCompleted(false);
        }
        setCanAccessPage(data.hidden);

      } catch (err) {
        console.error('Failed to load profile progress:', err);
        setHasProfileCompleted(false);
      }
    };

    loadProfileCompletion();
  }, []);

  if (!hasProfileCompleted && !canAccessPage) {
    return <RestrictionPage />;
  }
};

subscribe(APP_READY, () => {
  const root = createRoot(document.getElementById('root'));

  root.render(
    <StrictMode>
      <AppProvider>
        <RestrictionWrapper />
        <Helmet>
          <link rel="shortcut icon" href={getConfig().FAVICON_URL} type="image/x-icon" />
        </Helmet>
        <Routes>
          <Route
            path="/courses/:courseId/bulk_email"
            element={(
              <AuthenticatedPageRoute>
                <PageContainer>
                  <BulkEmailTool />
                </PageContainer>
              </AuthenticatedPageRoute>
          )}
          />
        </Routes>
      </AppProvider>
    </StrictMode>,
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  const root = createRoot(document.getElementById('root'));

  root.render(
    <StrictMode>
      <ErrorPage message={error.message} />
    </StrictMode>,
  );
});

initialize({
  handlers: {
    config: () => {
      mergeConfig(
        {
          // MICROBA-1505: Remove this when we remove the flag from config
          SCHEDULE_EMAIL_SECTION: process.env.SCHEDULE_EMAIL_SECTION || null,
        },
        'CommunicationsAppConfig',
      );
    },
  },
  messages,
});
