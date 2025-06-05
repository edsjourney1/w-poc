import { analyticsModal } from '../../scripts/analytics.js';

const popupDataAnalytics = (modalAction, modalName, openCount) => {
  analyticsModal({
    modal_action: modalAction,
    modal_location: window.location.href,
    modal_name: modalName,
    modal_impression: openCount,
  });
};

export default popupDataAnalytics;
