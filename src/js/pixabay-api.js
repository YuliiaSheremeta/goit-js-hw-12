import axios from "axios";

export const fetchImages = (searchedQuery, currentPage) => {
    const axiosOptions = {
        params: {
            q: searchedQuery,
            page: currentPage,
            per_page: 15,
            key:'48292364-ad13d53928d4b39a49844bb07',
        },
    };
    return axios.get(`https://pixabay.com/api/`, axiosOptions);
};
    

  
