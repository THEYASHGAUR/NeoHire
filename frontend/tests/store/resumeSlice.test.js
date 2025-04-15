import resumeReducer, {
    setExtractedResumes,
    setAiParsedResumes,
  } from '../../src/store/FeaturedResume/resume';
  
  describe('resumeSlice reducer', () => {
    const initialState = {
      extResumes: [],
      aiParsedResumes: [],
    };
  
    it('should return the initial state', () => {
      expect(resumeReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
    });
  
    it('should handle setExtractedResumes', () => {
      const mockPayload = [
        { id: 1, name: 'Resume 1' },
        { id: 2, name: 'Resume 2' },
      ];
  
      const action = setExtractedResumes(mockPayload);
      const state = resumeReducer(initialState, action);
  
      expect(state.extResumes).toEqual(mockPayload);
      expect(state.aiParsedResumes).toEqual([]);
    });
  
    it('should handle setAiParsedResumes', () => {
      const mockPayload = [
        { id: 'a1', parsed: true },
        { id: 'a2', parsed: false },
      ];
  
      const action = setAiParsedResumes(mockPayload);
      const state = resumeReducer(initialState, action);
  
      expect(state.aiParsedResumes).toEqual(mockPayload);
      expect(state.extResumes).toEqual([]);
    });
  
    it('should update only extResumes and not aiParsedResumes when setExtractedResumes is dispatched', () => {
      const action = setExtractedResumes([{ id: 99, name: 'New Resume' }]);
  
      const currentState = {
        extResumes: [],
        aiParsedResumes: [{ id: 'parsed1' }],
      };
  
      const nextState = resumeReducer(currentState, action);
  
      expect(nextState.extResumes).toEqual([{ id: 99, name: 'New Resume' }]);
      expect(nextState.aiParsedResumes).toEqual([{ id: 'parsed1' }]);
    });
  });
  