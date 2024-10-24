import urls from "../../utilities/AppSettings";

import axios from "axios";

let BASE_URL = urls.BaseUrl;

export const getAllJobs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/jobs`);
      return response;
    } catch (error) {
      throw error
    }
  }

export const addJobApi = async(jobData : any) => {
    try {
        const response = await axios.post(`${BASE_URL}/jobs`, jobData);
        return response;
    } catch (error) {
      throw error
        
    }
  
  };

export const updateJobApi = async(id : Number, jobData : any) => {
    console.log(jobData,"jobData");
    try {
        const response = await axios.put(`${BASE_URL}/jobs/${id}`, jobData);
        return response;
    } catch (error) {
      throw error
        
    }
  
};

export const deleteJobApi = async(id : Number) => {
    try {
        const response = await axios.delete(`${BASE_URL}/jobs/${id}`);
        return response;
    } catch (error) {
      throw error
        
    }
  
};
  
