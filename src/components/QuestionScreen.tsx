import React, { useContext } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native";
import { QuizContext } from "../context/QuizContect";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { QuizQuestions } from "../data/QuizQuestions";
import { RootStackParamList } from "../../App";
import { OptionModel } from "../QuizInterface";
import { ProgressBar, Icon } from "react-native-paper";

type QuestionScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  "Question"
>;

export default function QuestionScreen({
  navigation,
}: {
  navigation: QuestionScreenProps;
}) {
  const { state, dispatch } = useContext(QuizContext);
  const question = QuizQuestions[state.currentIndex];

  const handleSelect = (opt: OptionModel) => {
    if (!state.showAnswer) {
      dispatch({ type: "SELECT_OPTION", payload: opt });
    }
  };

  const handleNext = () => {
    if (state.currentIndex === QuizQuestions.length - 1) {
      navigation.replace("Result");
    } else {
      dispatch({ type: "NEXT_QUESTION" });
    }
  };

  return (
    <View style={styles.wrapper}>
      {/* Title  .................................. */}
      <Text style={styles.title}>Mahabharat</Text>

      {/* Top Row - Question Count + Timer  .................................. */}
      <View style={styles.topRow}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>
            Question {state.currentIndex + 1} / {QuizQuestions.length}
          </Text>
        </View>

        <View style={styles.timer}>
          <Icon source="clock-outline" size={20} color="#D17800" />
          <Text style={styles.timerText}> 90s</Text>
        </View>
      </View>

      {/* Progress bar  .................................. */}
      <ProgressBar
        progress={(state.currentIndex + 1) / QuizQuestions.length}
        style={styles.progressBar}
        color="#F9A825"
      />

      {/* Main Question Content  .................................. */}
      <View style={styles.quizBoxContainer}>
      <ScrollView style={styles.quizBox}>
        <Image source={{ uri: question.imageUrl }} style={styles.image} />
        <View style={styles.questionContainer}>
         <View style={styles.questionTextContainer}>
          <Text style={styles.questionText}>{question.question}</Text>
         </View>

        {/* Options  ..................................*/}
        <View style={styles.optionsContainer}>
        {question.options.map((opt) => {
          const isSelected =
            state.selectedOption?.serialNumber === opt.serialNumber;
          const isCorrect = opt.correct === 1;

          let bg = "#FFF4E3";
          let border = "#F3C892";
          let textColor = "#5A4B39";

          if (state.showAnswer) {
            if (isCorrect) {
              bg = "#D8F5D0";
              border = "#65B96F";
            } else if (isSelected) {
              bg = "#FAD4D4";
              border = "#E57373";
            }
          }

          return (
            <TouchableOpacity
              key={opt.serialNumber}
              style={[styles.option, { backgroundColor: bg, borderColor: border }]}
              onPress={() => handleSelect(opt)}
              disabled={state.showAnswer}
            >
              <Text style={[styles.optionText, { color: textColor }]}>
                {opt.value}
              </Text>

              {/* Show Correct / Wrong Icon */}
              {/* {state.showAnswer && (
                <Icon
                  source={isCorrect ? "check-circle" : isSelected ? "close-circle" : ""}
                  size={26}
                  color={isCorrect ? "green" : isSelected ? "red" : "transparent"}
                />
              )} */}
            </TouchableOpacity>
          );
        })}
        </View>
        </View>
      </ScrollView>

      {/* Next Button  .................................. */}
      <View style={styles.nextBtnContainer}>
        {state.showAnswer && (
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextText}>Next Question</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Score Display .................................. */}
      <Text style={styles.score}>
        Score: {state.score} / {QuizQuestions.length}
      </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },

  title: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "700",
    color: "#6B4F2A",
    marginBottom: 15,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  tag: {
    backgroundColor: "orange",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
  },

  tagText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },

  timer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF1D6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  timerText: {
    color: "#C97800",
    fontSize: 14,
    fontWeight: "600",
  },

  progressBar: {
    marginTop: 15,
    height: 10,
    borderRadius: 10,
    backgroundColor: "#FFE4CC",
  },

  questionContainer: {  
  flex: 1,
  },

  quizBoxContainer: {
    flex: 1,
    marginTop: 20,
    backgroundColor: "#FFF8F0",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#FEEFDD",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,

  },

  quizBox: {
    borderRadius: 18,
  },

  image: {
    flex: 1,
    width: "100%",
    height: 140,
    marginBottom: 10,
  },

  questionTextContainer: {
    flex: 1,
    padding: 15,
  },

  questionText: {
    fontSize: 20,
    fontWeight: "700",
    verticalAlign: "middle",
    color: "#5A3000",
    marginBottom: 10,
    fontFamily: "Poppins",


  },

  optionsContainer: {
    flex: 1,
    padding: 15,
  },

  option: {
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  optionText: {
    fontSize: 16,
    fontWeight: "600",
  },
 
  nextBtnContainer: {
    height: 70,
    padding: 10,       
    justifyContent: "center", 
    alignItems: "center",     
  },

  nextBtn: {
    backgroundColor: "purple",
    paddingHorizontal: 40,
    height: 50,
    width: 200,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  nextText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
  },

  score: {

    textAlign: "center",
    fontSize: 14,
    color: "#F0A52E",
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
    lineHeight: 12,
    letterSpacing: -0.3,
    marginTop: 10,
    marginBottom: 10,
  },
});
