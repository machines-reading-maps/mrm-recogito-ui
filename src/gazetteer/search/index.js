export const getQueryURL = (query, optSize) => {
  const size = optSize || 20;

  const useGazetteers = !window.config.authorities?.gazetteers?.use_all &&
    window.config.authorities?.gazetteers?.includes;

  return useGazetteers ? 
    `/api/place/search?q=${encodeURIComponent(query)}&offset=0&size=${size}&authorities=${encodeURIComponent(useGazetteers.join(','))}` : 
    `/api/place/search?q=${encodeURIComponent(query)}&offset=0&size=${size}`;
}