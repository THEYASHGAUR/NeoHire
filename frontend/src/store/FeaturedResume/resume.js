import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  extResumes: [],
  aiParsedResumes: [],
};
const resumeSlice = createSlice({
    name: "resume",
    initialState,
    reducers: {
        setExtractedResumes: (state, action) => {
            state.extResumes = action.payload; 
            // state.extResumes = [...state.extResumes, resumeData];
        } , 
        setAiParsedResumes: (state, action) => {
            state.aiParsedResumes = action.payload; 
        } ,
        
        },
  
});

export const { setExtractedResumes, setAiParsedResumes } = resumeSlice.actions;


export const selectExtractedResumes = (state) => state.resume.extResumes;
export const selectAiParsedResumes = (state) => state.resume.aiParsedResumes;


export default resumeSlice.reducer;