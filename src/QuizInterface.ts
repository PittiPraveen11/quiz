export interface QuestionModel {
    question: string;
    imageUrl: string;
    options: OptionModel[];
    difficultyLevel: number;
  }
  
  export interface OptionModel {
    value: string;
    serialNumber: number;
    correct: number;
  }

 