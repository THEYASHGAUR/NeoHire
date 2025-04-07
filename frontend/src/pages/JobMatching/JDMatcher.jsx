import {useState} from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import {setExtractedResumes} from '../../store/FeaturedResume/resume.js'


const JDMatcher = () => {
  const extractedResume = useSelector(setExtractedResumes)
  // const aiParsedResume = useSelector(setAiParsedResumes)
  const extractedResumeData = extractedResume.payload.resume.extResumes ; 

  
    
  return (
    <div className='flex gap-2 p-3 flex-col justify-center items-center'>
      <div className='flex gap-2 p-3 flex-col'>
        <h1 className='text-2xl font-bold'>JD Matcher</h1>
        <p className='text-gray-500'>This is a simple JD matcher</p>
      <div className='flex gap-2 p-3 flex-col'>
        <h1>Extracted Resume </h1>
        { extractedResumeData && extractedResumeData.map((extR) => (
          <div key={extR.id}>
            <h2>Resume ID :- {extR.id}</h2>
            <p>Content :- {extR.text}</p>
          </div>
          ))}

         </div>
         <div className='flex gap-2 p-3 flex-col'>
          <h1>AI Parsed Resume </h1>
          {/* {aiParsedResume && aiParsedResume.map((aiR) => (
            <div key={aiR.id}>
              <h2>{aiR.id}</h2>
              <p>{aiR.content}</p>
            </div>
          ))} */}
         </div>
    </div>
    </div>
  )
}

export default JDMatcher
