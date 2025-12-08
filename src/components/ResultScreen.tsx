import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, } from "react-native";
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
import LinearGradient from "react-native-linear-gradient";

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
    if (state.stars >= 2) setTimeout(() => (s2.value = withSpring(1.5, { damping: 30 })), 250);
    if (state.stars >= 3) setTimeout(() => (s3.value = withSpring(1, { damping: 30 })), 500);
  }, [state.stars]);

  const animatedScore = useSharedValue(0);
  const animatedAccuracy = useSharedValue(0);
  const animatedPointsEarned = useSharedValue(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [displayAccuracy, setDisplayAccuracy] = useState(0);
  const [displayPointsEarned, setDisplayPointsEarned] = useState(0);
  const [showEarned, setShowEarned] = useState(false);
  const [showPoints, setShowPoints] = useState(false);
  const [showContinue, setShowContinue] = useState(false);


  useEffect(() => {
    setTimeout(() => {
      animatedScore.value = withTiming(state.score, { duration: 500 });
    }, 2000);
  }, []);
  useEffect(() => {
    setTimeout(() => {
      animatedAccuracy.value = withTiming(state.accuracy, { duration: 500 });
    }, 3000);

    setTimeout(() => setShowEarned(true), 4000);
    setTimeout(() => setShowPoints(true), 5000);
    setTimeout(() => setShowContinue(true), 7000);
  }, []);
  useEffect(() => {
    setTimeout(() => {
      animatedPointsEarned.value = withTiming(
        state.pointsEarned,
        { duration: 500 }
      );
    }, 6000);
  }, []);

  // Reaction updates
  useAnimatedReaction(
    () => animatedScore.value,
    (v) => runOnJS(setDisplayScore)(Number(v.toFixed(2)))
  );
  useAnimatedReaction(
    () => animatedAccuracy.value,
    (v) => runOnJS(setDisplayAccuracy)(Number(v.toFixed(2)))
  );
  useAnimatedReaction(
    () => animatedPointsEarned.value,
    (v) => runOnJS(setDisplayPointsEarned)(Number(v.toFixed(2)))
  );

  // --------------------------------------------------------
  // ⭐ SMOOTH FADE + SLIDE ANIMATIONS (ONLY THIS IS ADDED)
  // --------------------------------------------------------

  const fadeEarned = useSharedValue(0);
  const fadePoints = useSharedValue(0);
  const fadeContinue = useSharedValue(0);

  useEffect(() => {
    if (showEarned)
      fadeEarned.value = withTiming(1, { duration: 500 });

    if (showPoints)
      fadePoints.value = withTiming(1, { duration: 500 });

    if (showContinue)
      fadeContinue.value = withTiming(1, { duration: 600 });
  }, [showEarned, showPoints, showContinue]);

  const earnedStyle = useAnimatedStyle(() => ({
    opacity: fadeEarned.value,
    transform: [
      { translateY: withTiming(fadeEarned.value === 1 ? 15 : 20) },
    ],
  }));

  const pointsStyle = useAnimatedStyle(() => ({
    opacity: fadePoints.value,
    transform: [
      { translateY: withTiming(fadePoints.value === 1 ? 15 : 20) },
    ],
  }));

  const continueStyle = useAnimatedStyle(() => ({
    opacity: fadeContinue.value,
    transform: [
      { translateY: withTiming(fadeContinue.value === 1 ? 20 : 25) },
    ],
  }));

  // --------------------------------------------------------

  return (
    <View style={styles.container}>
      {/* ⭐ Stars */}
      <View style={styles.starsContainer}>
        <View style={styles.starWrapper}>
          <Image
            source={require("../assets/star_grey.png")}
            style={styles.star}
          />
          <Animated.Image
            source={require("../assets/star_gold.png")}
            style={[styles.star, styles.absolute, star1Style]}
          />
        </View>

        <View style={styles.starWrapper}>
          <Image
            source={require("../assets/star_grey.png")}
            style={styles.star}
          />
          <Animated.Image
            source={require("../assets/star_gold.png")}
            style={[styles.star, styles.absolute, star2Style]}
          />
        </View>

        <View style={styles.starWrapper}>
          <Image
            source={require("../assets/star_grey.png")}
            style={styles.star}
          />
          <Animated.Image
            source={require("../assets/star_gold.png")}
            style={[styles.star, styles.absolute, star3Style]}
          />
        </View>
      </View>

      {/* Score + Accuracy */}
      <View style={styles.scoreAccuracyRow}>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreMain}>{displayScore}</Text>
          <Text style={styles.scoreLabel}>
            Correct{"\n"}Answers
          </Text>
        </View>

        <View style={styles.verticalDivider} />

        <View style={styles.scoreBox}>
          <Text style={styles.scoreMain}>{displayAccuracy}%</Text>
          <Text style={styles.scoreLabel}>Accuracy</Text>
        </View>
      </View>

      {/* Earned + Points */}
      <View style={styles.pointsTitleContainer}>
        {showEarned && (
          <Animated.View style={earnedStyle}>
            <Text style={styles.pointsTitle}>You've earned:</Text>
          </Animated.View>
        )}

        {showPoints && (
          <Animated.View style={[styles.pointsContainer, pointsStyle]}>
            <Image
              source={require("../assets/earnedcoins.png")}
              style={styles.pointsIcon}
            />
            <Text style={styles.pointsText}>
              + {displayPointsEarned} Points
            </Text>
          </Animated.View>
        )}
      </View>

      {/* Continue Button */}
      {showContinue && (
        <Animated.View style={continueStyle}>
          <TouchableOpacity
            style={styles.tryBtnWrapper}
            onPress={() => navigation.replace("ResultLeaderScreen")}
          >
            <LinearGradient
              colors={[
                "#FF931E",
                "#F58B21",
                "#FFC117",
                "#FBA225",
                "#E27A19",
              ]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.tryBtn}
            >
              <Text style={styles.tryBtnText}>Continue</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      )}
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
    width: 1.5,
    height: 60,
    backgroundColor: "#5A3000",
    marginHorizontal: 10,
  },

  pointsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFE9C7",
    paddingVertical: 14,
    paddingHorizontal: 10,
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
  pointsTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#5A3000",
    textAlign: "center",
    marginBottom: 10,
  },
  pointsTitleContainer: {
    alignItems: "center",
  },
  tryBtnWrapper: {
    width: "100%",
    alignItems: "center",
  },
  tryBtn: {
    marginTop: 20,
    width: 124,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#AF4001",
  },
  tryBtnText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#fff",
  },
});
