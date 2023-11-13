import apiFetch from './api';

  const createLeads = (userData) => {
    return apiFetch('/api/leads', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  };
  
  export { createLeads };