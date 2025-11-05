import { createContext, useContext, useState } from "react";

const TutorialContext = createContext();

export function TutorialProvider({ children }) {
  const [storyTourDone, setStoryTourDone] = useState(false);
  const [designTourDone, setDesignTourDone] = useState(false);

  return (
    <TutorialContext.Provider
      value={{
        storyTourDone,
        setStoryTourDone,
        designTourDone,
        setDesignTourDone,
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  return useContext(TutorialContext);
}
