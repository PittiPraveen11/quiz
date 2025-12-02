import React, { createContext, useReducer, ReactNode } from "react";
import { OptionModel } from "../QuizInterface";



export interface QuizModalClass {
    currentIndex: number;
    score: number;
    selectedOption: OptionModel | null;
    showAnswer: boolean;
  }
   
  export type QuizAction =
  | { type: "SELECT_OPTION"; payload: OptionModel }
  | { type: "NEXT_QUESTION" }
  | { type: "RESET" };

  export interface QuizContextType {
    state: QuizModalClass;
    dispatch: React.Dispatch<QuizAction>;
  }

const quizInitialState: QuizModalClass = {
  currentIndex: 0,
  score: 0,
  selectedOption: null,
  showAnswer: false
};

function quizReducer(state: QuizModalClass, action: QuizAction): QuizModalClass {
  switch (action.type) {
    case "SELECT_OPTION":
      const isCorrect = action.payload.correct === 1;
      return {
        ...state,
        selectedOption: action.payload,
        showAnswer: true,
        score: isCorrect ? state.score + 1 : state.score
      };

    case "NEXT_QUESTION":
      return {
        ...state,
        currentIndex: state.currentIndex + 1,
        selectedOption: null,
        showAnswer: false
      };

    case "RESET":
      return quizInitialState;

    default:
      return state;
  }
}



export const QuizContext = createContext<QuizContextType>({
  state: quizInitialState,
  dispatch: () => {}
});

export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(quizReducer,quizInitialState);

  return (
    <QuizContext.Provider value={{ state, dispatch }}>
      {children}
    </QuizContext.Provider>
  );
};
