import React, { useContext } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native";
import { QuizContext } from "../context/QuizContect";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { QuizQuestions } from "../data/QuizQuestions";
import { RootStackParamList } from "../../App";
import { OptionModel } from "../QuizInterface";
import { ProgressBar, Icon } from "react-native-paper";
import LinearGradient from "react-native-linear-gradient";

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

      {/* Top Row - Question Count   .................................. */}
      <View style={styles.topRow}>
        <View>
          {/* Border gradient wrapper */}
          {/* <LinearGradient
            colors={["#FBD500", "#B75000"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.tagBorder}
          > */}
            {/* Inner fill gradient */}
            <LinearGradient
              colors={["#FF931E", "#F58B21", "#F8A917", "#FBA225", "#E27A19"]}
              start={{ x: 0, y: 0.5 }}     
              end={{ x: 1, y: 0.5 }}       
              style={styles.tag}
            >
              <Text style={styles.tagText}>
                Question {state.currentIndex + 1} out of {QuizQuestions.length}
              </Text>
            </LinearGradient>
          {/* </LinearGradient> */}
        </View>

        {/* <View style={styles.timer}>
          <Icon source={require("../assets/clock.png")} size={20} color="#D17800" />
          <Text style={styles.timerText}> 90s</Text>
        </View> */}
      </View>

      {/* Progress bar  .................................. */}
      {/* <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <LinearGradient
            colors={["#FF931E", "#FEB94A", "#FFC117", "#FEB94A", "#E27A19"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={[
              styles.progressFill,
              { width: `${((state.currentIndex + 1) / QuizQuestions.length) * 100}%` }
            ]}
          />
        </View>
      </View> */}


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

          let bg = "#FFF4DD";
          let border = "#FFC988";
          let textColor = "#5A4B39";

          if (state.showAnswer) {
            if (isCorrect) {
              bg = "#D1F3D1";
              border = "#7CC47E";
            } else if (isSelected) {
              bg = "#FFC2BD";
              border = "#E59C9C";
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
                ({opt.serialNumber}).  {opt.value}
              </Text>

              {/* Show Correct */}
              {state.showAnswer && isCorrect && (
                <Image
                  source={require("../assets/correct.png")}
                  style={styles.correctIcon}
                />
              )}
            </TouchableOpacity>
          );
        })}
        </View>
        </View>
      </ScrollView>

      {/* Next Button  .................................. */}
      <View style={styles.nextBtnContainer}>
        {state.showAnswer && (
          <TouchableOpacity onPress={handleNext}>
            <View style={styles.nextBtnWrapper}>
              <LinearGradient
                colors={["#FF931E", "#F58B21", "#FFC117", "#FBA225", "#E27A19"]}
                start={{ x: 0, y: 0.5 }}    
                end={{ x: 1, y: 0.5 }}       
                style={styles.nextBtn}
              >
                <Text style={styles.nextText}>Next Question</Text>
              </LinearGradient>
            </View>
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
    backgroundColor: "#FFF8F0",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },

  title: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#5A3000",
    marginBottom: 15,
    fontFamily: "Poppins-SemiBold",
    verticalAlign: "middle",
    lineHeight: 19.2,
    letterSpacing: -1.2,
    // verticalTrim: "Cap-Height",
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  tagBorder: {
    borderRadius: 12,
    padding: 1, // This creates the 1px border effect
  },
  tag: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 11, 
    borderWidth: 1,
    // overflow: "hidden",
  },

  tagText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
    letterSpacing: -0.3,
    verticalAlign: "middle",
    lineHeight: 12,
  },

  timer: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "#FFF1D6",
    // paddingHorizontal: 10,
    // paddingVertical: 6,
    // borderRadius: 20,
    // borderWidth: 2,
  },

  timerText: {
    color: "#C97800",
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
    letterSpacing: -0.3,
    verticalAlign: "middle",
    lineHeight: 12,
  },

  progressBar: {
    marginTop: 15,
    height: 12,
    borderRadius: 12,
    backgroundColor: "#FFE4CC",
    borderColor: "#915D093D",
    borderWidth: 1,
  },

  progressContainer: {
    marginTop: 15,
  },
  
  progressBackground: {
    height: 12,
    width: "100%",
    backgroundColor: "#FFE4CC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#915D093D", 

  },
  
  progressFill: {
    height: "100%",
    borderRadius: 12,
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
    overflow: "hidden",
  },

  quizBox: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
  },

  image: {
    flex: 1,
    width: "100%",
    height: 140,
    resizeMode: "cover",
  },

  questionTextContainer: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 8,
  },

  questionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#5A3000",
    fontFamily: "Poppins-SemiBold",
    lineHeight: 25.2, // 140% of 18px
    letterSpacing: -0.8,
    width: "100%",
  },

  optionsContainer: {
    paddingHorizontal: 12,
    paddingBottom: 16,
  },

  option: {
    width: "100%",
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  optionText: {
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "Poppins-Regular",
    color: "#5A3000",
    lineHeight: 17,
    letterSpacing: -0.8,
    flex: 1,
  },

  correctIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
 
  nextBtnContainer: {
    paddingVertical: 16,
    justifyContent: "center", 
    alignItems: "center",     
  },

  nextBtnWrapper: {
    borderRadius: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#AF4001",
    overflow: "hidden",
  },
  nextBtn: {
    width: 124,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  nextText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
    letterSpacing: -0.3,
    lineHeight: 12,
  },

  score: {
    textAlign: "center",
    fontSize: 12,
    color: "#F0A52E",
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
    lineHeight: 12,
    letterSpacing: -0.3,
    marginTop: 8,
    marginBottom: 10,
  },
});
