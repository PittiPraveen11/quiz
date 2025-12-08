import React, { createContext, useReducer, ReactNode } from "react";
import { OptionModel } from "../QuizInterface";
import { QuizQuestions } from "../data/QuizQuestions";



export interface QuizModalClass {
    currentIndex: number;
    score: number;
    pointsEarned: number;
    accuracy: number;
    stars: number;
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
  pointsEarned: 0,
  accuracy: 0,
  stars: 0,
  selectedOption: null,
  showAnswer: false
};

const TOTAL_QUESTIONS = QuizQuestions.length;

function quizReducer(state: QuizModalClass, action: QuizAction): QuizModalClass {
  switch (action.type) {
    case "SELECT_OPTION":
      const isCorrect = action.payload.correct === 1;
      return {
        ...state,
        selectedOption: action.payload,
        showAnswer: true,
        score: isCorrect ? state.score + 1 : state.score,
        pointsEarned: isCorrect ? state.pointsEarned + 10 : state.pointsEarned
        
      };

    case "NEXT_QUESTION":
      const newIndex = state.currentIndex + 1;
      const accuracy = Number(((Number(state.score) / Number(TOTAL_QUESTIONS)) * 100).toFixed(2));
      let stars = 0;
      if (state.score >= 0 && state.score <= 0.5) stars = 1;
      else if (state.score >= 0.5 && state.score <= 1.5) stars = 2;
      else if (state.score >= 1.5 && state.score <= 3) stars = 3;

      return {
        ...state,
        currentIndex: newIndex,
        selectedOption: null,
        showAnswer: false,
        accuracy,
        stars,
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
