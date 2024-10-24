import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReactNode } from 'react';

interface Job {
  logo: string | undefined;
  companyName: ReactNode;
  id: number;
  title: string;
  company: string;
  skills: string[];
  experience: number;
  description: string;
  applied: boolean;
}

interface JobsState {
  jobs: Job[];
  appliedJobs: number[];
}

const initialState: JobsState = {
  jobs: [],
  appliedJobs: [],
};

export const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setJobs: (state, action: PayloadAction<Job[]>) => {
      state.jobs = action.payload;
    },
    markApplied: (state, action: PayloadAction<number>) => {
      state.appliedJobs.push(action.payload);
      const jobIndex = state.jobs.findIndex((job) => job.id === action.payload);
      if (jobIndex !== -1) {
        state.jobs[jobIndex].applied = true;
      }
    },
  },
});

export const { setJobs, markApplied } = jobsSlice.actions;
export default jobsSlice.reducer;
