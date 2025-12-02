import React, { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { QuizContext } from "../context/QuizContect";
import { QuizQuestions } from "../data/QuizQuestions";
import { RootStackParamList } from "../../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type ResultScreenProps = NativeStackNavigationProp<RootStackParamList, "Result">;

export default function ResultScreen({ navigation }: { navigation: ResultScreenProps }) {
  const { state, dispatch } = useContext(QuizContext);

  const accuracy = ((state.score / QuizQuestions.length) * 100).toFixed(2);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 30, fontWeight: "bold" }}>Quiz Complete!</Text>

      <Text style={{ fontSize: 22, marginTop: 20 }}>
        Score: {state.score} / {QuizQuestions.length}
      </Text>
      <Text style={{ fontSize: 22 }}>Accuracy: {accuracy}%</Text>

      <TouchableOpacity
        onPress={() => {
          dispatch({ type: "RESET" });
          navigation.replace("Question");
        }}
        style={{
          marginTop: 40,
          padding: 15,
          backgroundColor: "green",
          borderRadius: 8
        }}
      >
        <Text style={{ color: "white", textAlign: "center", fontSize: 18 }}>
          Restart Quiz
        </Text>
      </TouchableOpacity>
    </View>
  );
}
