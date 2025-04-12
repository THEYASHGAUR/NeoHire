import { configureStore } from "@reduxjs/toolkit";
import resumeSlice from "./FeaturedResume/resume";


 const store = configureStore({
    reducer: {
        resume: resumeSlice,
    },
  });

  export default store;