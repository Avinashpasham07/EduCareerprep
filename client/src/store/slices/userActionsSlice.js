import { createSlice } from '@reduxjs/toolkit';
import { fetchCurrentUser } from './authSlice';

const initialState = {
  assessmentsTaken: 0,
  collegesSaved: 0,
  jobsApplied: 0,
  interviewsCompleted: 0,
  savedColleges: [],
  savedJobs: [],
  appliedJobs: [],
  completedAssessments: [],
  completedInterviews: []
};

const userActionsSlice = createSlice({
  name: 'userActions',
  initialState,
  reducers: {
    incrementAssessmentsTaken: (state) => {
      state.assessmentsTaken += 1;
    },
    incrementCollegesSaved: (state) => {
      state.collegesSaved += 1;
    },
    incrementJobsApplied: (state) => {
      state.jobsApplied += 1;
    },
    incrementInterviewsCompleted: (state) => {
      state.interviewsCompleted += 1;
    },
    addSavedCollege: (state, action) => {
      const college = action.payload;
      const existingIndex = state.savedColleges.findIndex(c => (c.id || c._id) === (college.id || college._id));
      if (existingIndex === -1) {
        state.savedColleges.push(college);
        state.collegesSaved = state.savedColleges.length;
      }
    },
    removeSavedCollege: (state, action) => {
      const collegeId = action.payload;
      state.savedColleges = state.savedColleges.filter(c => (c.id || c._id) !== collegeId);
      state.collegesSaved = state.savedColleges.length;
    },
    addSavedJob: (state, action) => {
      const job = action.payload;
      const existingIndex = state.savedJobs.findIndex(j => (j.id || j._id) === (job.id || job._id));
      if (existingIndex === -1) {
        state.savedJobs.push(job);
      }
    },
    removeSavedJob: (state, action) => {
      const jobId = action.payload;
      state.savedJobs = state.savedJobs.filter(j => (j.id || j._id) !== jobId);
    },
    addAppliedJob: (state, action) => {
      const job = action.payload;
      const existingIndex = state.appliedJobs.findIndex(j => (j.id || j._id) === (job.id || job._id));
      if (existingIndex === -1) {
        state.appliedJobs.push(job);
        state.jobsApplied = state.appliedJobs.length;
      }
    },
    addCompletedAssessment: (state, action) => {
      const assessment = action.payload;
      const existingIndex = state.completedAssessments.findIndex(a => a.id === assessment.id);
      if (existingIndex === -1) {
        state.completedAssessments.push(assessment);
        state.assessmentsTaken = state.completedAssessments.length;
      }
    },
    addCompletedInterview: (state, action) => {
      const interview = action.payload;
      const existingIndex = state.completedInterviews.findIndex(i => i.id === interview.id);
      if (existingIndex === -1) {
        state.completedInterviews.push(interview);
        state.interviewsCompleted = state.completedInterviews.length;
      }
    },
    resetUserActions: (state) => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      const user = action.payload;
      if (user) {
        state.savedJobs = user.savedJobs || [];
        state.savedColleges = user.savedColleges || [];
        state.appliedJobs = user.appliedJobs || [];
        // Update counts
        state.jobsApplied = state.appliedJobs.length;
        state.collegesSaved = state.savedColleges.length;
        // Assessments and Interviews might assume local only if not in DB, 
        // but for now we sync what we have.
      }
    });
  }
});

export const {
  incrementAssessmentsTaken,
  incrementCollegesSaved,
  incrementJobsApplied,
  incrementInterviewsCompleted,
  addSavedCollege,
  removeSavedCollege,
  addSavedJob,
  removeSavedJob,
  addAppliedJob,
  addCompletedAssessment,
  addCompletedInterview,
  resetUserActions
} = userActionsSlice.actions;

export default userActionsSlice.reducer;
