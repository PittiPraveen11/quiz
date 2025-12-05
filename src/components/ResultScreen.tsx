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
  // shared values for stars
  const s1 = useSharedValue(0);
  const s2 = useSharedValue(0);
  const s3 = useSharedValue(0);

  // styles for star animations
  const star1Style = useAnimatedStyle(() => ({ transform: [{ scale: s1.value }] }));
  const star2Style = useAnimatedStyle(() => ({ transform: [{ scale: s2.value }] }));
  const star3Style = useAnimatedStyle(() => ({ transform: [{ scale: s3.value }] }));

  useEffect(() => {
    if (state.stars >= 1) s1.value = withSpring(1, { damping: 30 });
    if (state.stars >= 2) setTimeout(() => (s2.value = withSpring(1, { damping: 30 })), 250);
    if (state.stars >= 3) setTimeout(() => (s3.value = withSpring(1, { damping: 30 })), 500);
  }, [state.stars]);

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
    console.log("accuracy", state.accuracy);
    setTimeout(() => {
      animatedAccuracy.value = withTiming(state.accuracy, {
        duration: 500,
      });
    }, 3000);
  }, []);
  useEffect(() => {
    console.log("pointsEarned", state.pointsEarned);
    setTimeout(() => {
      animatedPointsEarned.value = withTiming(state.pointsEarned, {
        duration: 500,
      });
    }, 3000);
  }, []);
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

      <View style={styles.starsContainer}>
        {/* star 1 */}
        <View style={styles.starWrapper}>
          <Image source={require("../assets/star_grey.png")} style={styles.star} />
          <Animated.Image
            source={require("../assets/star_gold.png")}
            style={[styles.star, styles.absolute, star1Style]}
          />
        </View>
  
        {/* star 2 */}
        <View style={styles.starWrapper}>
          <Image source={require("../assets/star_grey.png")} style={styles.star} />
          <Animated.Image
            source={require("../assets/star_gold.png")}
            style={[styles.star, styles.absolute, star2Style]}
          />
        </View>
  
        {/* star 3 */}
        <View style={styles.starWrapper}>
          <Image source={require("../assets/star_grey.png")} style={styles.star} />
          <Animated.Image
            source={require("../assets/star_gold.png")}
            style={[styles.star, styles.absolute, star3Style]}
          />
        </View>
      </View>
  
      {/* Score + Accuracy row */}
      <View style={styles.scoreAccuracyRow}>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreMain}>{displayScore}</Text>
          <Text style={styles.scoreLabel}>Correct{"\n"}Answers</Text>
        </View>
  
        <View style={styles.verticalDivider} />
  
        <View style={styles.scoreBox}>
          <Text style={styles.scoreMain}>{displayAccuracy}%</Text>
          <Text style={styles.scoreLabel}>Accuracy</Text>
        </View>
      </View>
  
      {/* Earned Points */}
      <View style={styles.pointsContainer}>
        <Image
          source={require("../assets/earnedcoins.png")}
          style={styles.pointsIcon}
        />
        <Text style={styles.pointsText}>+ {displayPointsEarned} Points</Text>
      </View>
  
      {/* Restart / Continue button */}
      <TouchableOpacity
        onPress={() => {
          navigation.replace("ResultLeaderScreen");
        }}
        style={styles.continueBtn}
      >
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </View>
  ); 
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF7EB",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 120,
  },

  /* ⭐ STARS */
  starsContainer: {
    flexDirection: "row",
    marginBottom: 40,
  },
  starWrapper: {
    width: 70,
    height: 70,
    marginHorizontal: 10,
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

  /* Score + Accuracy row */
  scoreAccuracyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
    width: "80%",
    justifyContent: "center",
  },
  scoreBox: {
    flex: 1,
    alignItems: "center",
  },
  scoreMain: {
    fontSize: 32,
    fontWeight: "700",
    color: "#3A2A1A",
  },
  scoreLabel: {
    marginTop: 6,
    fontSize: 13,
    textAlign: "center",
    color: "#8E7A62",
    lineHeight: 16,
    fontWeight: "600",
  },
  verticalDivider: {
    width: 1,
    height: 60,
    backgroundColor: "#CBB9A2",
    marginHorizontal: 10,
  },

  /* Points earned section */
  pointsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFE9C7",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
    marginBottom: 50,
  },
  pointsIcon: {
    width: 26,
    height: 26,
    marginRight: 10,
    resizeMode: "contain",
  },
  pointsText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#B97A13",
  },

  /* Continue Button */
  continueBtn: {
    backgroundColor: "#F6A024",
    paddingVertical: 16,
    paddingHorizontal: 100,
    borderRadius: 20,
    elevation: 5,
  },
  continueText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
});

