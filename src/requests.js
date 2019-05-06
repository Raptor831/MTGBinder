import axios from 'axios';

function scheduleRequests(axiosInstance, intervalMs) {
  let lastInvocationTime = 0;
  const scheduler = (config) => {
    const now = Date.now();
    if (lastInvocationTime) {
      lastInvocationTime += intervalMs;
      const waitPeriodForThisRequest = lastInvocationTime - now;
      if (waitPeriodForThisRequest > 0) {
        return new Promise((resolve) => {
          setTimeout(
            () => resolve(config),
            waitPeriodForThisRequest,
          );
        });
      }
    }

    lastInvocationTime = now;
    return config;
  };

  axiosInstance.interceptors.request.use(scheduler);
}

const scryfallService = axios.create({ baseURL: 'https://api.scryfall.com' });
scheduleRequests(scryfallService, 100);

export default {
  scryfall: scryfallService,
};
