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
  const accuracy: number = Number((state.score / QuizQuestions.length) * 100);
  const pointsEarned: number = Number((state.score) * 10);

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
  const animatedAccuracy = useSharedValue(0);
  const animatedPointsEarned = useSharedValue(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [displayAccuracy, setDisplayAccuracy] = useState(0);
  const [displayPointsEarned, setDisplayPointsEarned] = useState(0);

  useEffect(() => {
    console.log("state.score", state.score);
    setTimeout(() => {
      animatedScore.value = withTiming(state.score, {
        duration: 500,
      });
    }, 3000);
  }, []);
  useEffect(() => {
    console.log("accuracy", accuracy);
    setTimeout(() => {
      animatedAccuracy.value = withTiming(accuracy, {
        duration: 500,
      });
    }, 3000);
  }, []);
  useEffect(() => {
    console.log("pointsEarned", pointsEarned);
    setTimeout(() => {
      animatedPointsEarned.value = withTiming(pointsEarned, {
        duration: 500,
      });
    }, 3000);
  }, []);
  // Update displayed score as animation progresses
  useAnimatedReaction(
    () => animatedScore.value,
    (currentValue) => {
      runOnJS(setDisplayScore)(Number(currentValue.toFixed(2))); 
    }
  );

  
  useAnimatedReaction(
    () => animatedAccuracy.value,
    (currentValue) => {
      runOnJS(setDisplayAccuracy)(Number(currentValue.toFixed(2)));
    }
  );

  useAnimatedReaction(
    () => animatedPointsEarned.value,
    (currentValue) => {
      runOnJS(setDisplayPointsEarned)(Number(currentValue.toFixed(2)));
    }
  );
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz Complete!</Text>
       
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

      <View style={styles.scoreRow}>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLarge}>
             {displayScore} 
            </Text>
            <Text style={styles.scoreLarge}>
              Score
            </Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLarge}>
              {displayAccuracy}% 
            </Text>
            <Text style={styles.scoreLarge}>
              Accuracy
            </Text>
          </View>
        </View>
        <View style={styles.pointsEarnedRow}>
          <View style={styles.pointsEarnedItem}>
            <Text style={styles.pointsEarnedLarge}>
             + {displayPointsEarned} Points
            </Text>
            {/* <Text style={styles.pointsEarnedLarge}>
              Points Earned
            </Text> */}
          </View>
      </View>

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
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    gap: 10,
    alignItems: "center",
  },
  scoreItem: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  scoreLarge: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 8,
    color: "#5A3000",
    fontFamily: "Poppins-SemiBold",
    lineHeight: 12,
    letterSpacing: -0.3,
    verticalAlign: "middle",
  },
  pointsEarnedRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    gap: 10,
    alignItems: "center",
  },
  pointsEarnedItem: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  pointsEarnedLarge: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 8,
    color: "#5A3000",
    fontFamily: "Poppins-SemiBold",
    lineHeight: 12,
    letterSpacing: -0.3,
    verticalAlign: "middle",
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
