export const BASE_URL = (function () {
    if (process.env.REACT_APP_XDOME_BASE_URL) {
      return process.env.REACT_APP_XDOME_BASE_URL;
    }
  
    if (process.env.NODE_ENV === 'development') {
        return "http://localhost:8080";
    }
  
    return "http://35.157.134.182";
  
})();