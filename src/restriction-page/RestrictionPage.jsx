import React from 'react';
import { useContext } from 'react';
import { Button, Card } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Link } from 'react-router-dom';
import { AppContext } from '@edx/frontend-platform/react';

import './restrictionPage.scss';
import messages from './RestrictionPage.messages';

const RestrictionPage = () => {
  const { formatMessage } = useIntl();
  const { authenticatedUser, config } = useContext(AppContext);

  return (
    <div className="profile-gate-overlay">
      <Card className="profile-gate-card shadow-lg">
        <Card.Body className="text-center p-4">

          <h2 className="mb-3 profile-gate-title">
            {formatMessage(messages['profile.gate.title'])}
          </h2>

          <p className="mb-4 profile-gate-text">
            {formatMessage(messages['profile.gate.description'])}
          </p>
          <Link to={`${config.ACCOUNT_PROFILE_URL}/u/${authenticatedUser.username}`} className="mt-auto">
          <Button
            variant="primary"
            size="md"
          >
            {formatMessage(messages['profile.gate.button'])}
          </Button>
          </Link>

        </Card.Body>
      </Card>
    </div>
  );
};

export default RestrictionPage;
