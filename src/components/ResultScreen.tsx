import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { QuizContext } from "../context/QuizContect";
import { QuizQuestions } from "../data/QuizQuestions";
import { RootStackParamList } from "../../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withSpring,
  useAnimatedReaction,
  runOnJS,
} from "react-native-reanimated";

type ResultScreenProps = NativeStackNavigationProp<RootStackParamList, "Result">;

export default function ResultScreen({ navigation }: { navigation: ResultScreenProps }) {
  const { state, dispatch } = useContext(QuizContext);


  let stars = 0;
  if (state.score >= 0 && state.score <= 0.5) stars = 1;
  else if (state.score >= 0.5 && state.score <= 1.5) stars = 2;
  else if (state.score >= 1.5 && state.score <= 3) stars = 3;

  // shared values for stars
  const s1 = useSharedValue(0);
  const s2 = useSharedValue(0);
  const s3 = useSharedValue(0);

  // styles for star animations
  const star1Style = useAnimatedStyle(() => ({ transform: [{ scale: s1.value }] }));
  const star2Style = useAnimatedStyle(() => ({ transform: [{ scale: s2.value }] }));
  const star3Style = useAnimatedStyle(() => ({ transform: [{ scale: s3.value }] }));

  useEffect(() => {
    if (stars >= 1) s1.value = withSpring(1, { damping: 30 });
    if (stars >= 2) setTimeout(() => (s2.value = withSpring(1, { damping: 30 })), 250);
    if (stars >= 3) setTimeout(() => (s3.value = withSpring(1, { damping: 30 })), 500);
  }, [stars]);

  const animatedScore = useSharedValue(0);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    console.log("state.score", state.score);
    setTimeout(() => {
      animatedScore.value = withTiming(state.score, {
        duration: 500,
      });
    }, 3000);
  }, [state.score]);

  // Update displayed score as animation progresses
  useAnimatedReaction(
    () => animatedScore.value,
    (currentValue) => {
      runOnJS(setDisplayScore)(Math.round(currentValue));
    }
  );

  const accuracy = ((state.score / QuizQuestions.length) * 100).toFixed(2);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz Complete!</Text>

      {/* ⭐ ANIMATED SCORE */}
      <Text style={styles.scoreLarge}>
        Score: {displayScore} / {QuizQuestions.length}
      </Text>

      {/* ⭐ STAR ROW */}
      <View style={styles.starRow}>

        <View style={styles.starWrapper}>
          <Image source={require("../assets/star_grey.png")} style={styles.star} />
          <Animated.Image
            source={require("../assets/star_gold.png")}
            style={[styles.star, styles.absolute, star1Style]}
          />
        </View>

        <View style={styles.starWrapper}>
          <Image source={require("../assets/star_grey.png")} style={styles.star} />
          <Animated.Image
            source={require("../assets/star_gold.png")}
            style={[styles.star, styles.absolute, star2Style]}
          />
        </View>

        <View style={styles.starWrapper}>
          <Image source={require("../assets/star_grey.png")} style={styles.star} />
          <Animated.Image
            source={require("../assets/star_gold.png")}
            style={[styles.star, styles.absolute, star3Style]}
          />
        </View>

      </View>

      <Text style={[styles.smallText, { marginTop: 20 }]}>Accuracy: {accuracy}%</Text>

      {/* Restart button */}
      <TouchableOpacity
        onPress={() => {
          dispatch({ type: "RESET" });
          navigation.replace("Question");
        }}
        style={styles.restartBtn}
      >
        <Text style={{ color: "white", textAlign: "center", fontSize: 18 }}>
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  scoreLarge: {
    fontSize: 26,
    fontWeight: "700",
    marginTop: 8,
    color: "#333",
  },
  smallText: {
    fontSize: 14,
    fontWeight: "600",
  },
  restartBtn: {
    marginTop: 40,
    padding: 15,
    backgroundColor: "green",
    borderRadius: 8,
    width: "70%",
  },

  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },
  starRow: {
    flexDirection: "row",
    marginTop: 30,
    gap: 15,
  },
  starWrapper: {
    width: 70,
    height: 70,
  },
  star: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
  },
});
