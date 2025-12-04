import React, { useContext, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { QuizContext } from "../context/QuizContect";
import { QuizQuestions } from "../data/QuizQuestions";
import { RootStackParamList } from "../../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useAnimatedProps 
} from "react-native-reanimated";

type ResultScreenProps = NativeStackNavigationProp<RootStackParamList, "Result">;

export default function ResultScreen({ navigation }: { navigation: ResultScreenProps }) {

  const AnimatedText = Animated.createAnimatedComponent(Text);
  const { state, dispatch } = useContext(QuizContext);
  const accuracy = ((state.score / QuizQuestions.length) * 100).toFixed(2);

  let stars = 0;
  if (state.score >= 0 && state.score <= 0.5) stars = 1;
  else if (state.score >= 0.5 && state.score <= 1.5) stars = 2;
  else if (state.score >= 1.5 && state.score <= 3) stars = 3;

  const s1 = useSharedValue(0);
  const s2 = useSharedValue(0);
  const s3 = useSharedValue(0);
  const animatedScore = useSharedValue(0);

  const animatedScoreProps = useAnimatedProps(() => {
    return {
      text: `Score: ${Math.round(animatedScore.value)} / ${QuizQuestions.length}`,
    };
  });
  


  // ⭐ ANIMATED STYLES
  const star1Style = useAnimatedStyle(() => ({
    transform: [{ scale: s1.value }],
  }));

  const star2Style = useAnimatedStyle(() => ({
    transform: [{ scale: s2.value }],
  }));

  const star3Style = useAnimatedStyle(() => ({
    transform: [{ scale: s3.value }],
  }));


  useEffect(() => {
    if (stars >= 1) s1.value = withSpring(1, { damping: 10 });

    if (stars >= 2)
      setTimeout(() => {
        s2.value = withSpring(1, { damping: 10});
      }, 250);

    if (stars === 3)
      setTimeout(() => {
        s3.value = withSpring(1, { damping: 10 });
      }, 500);
    
    animatedScore.value = withSpring(state.score, { damping: 10 });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz Complete!</Text>

      {/* ⭐ STAR ROW */}
      <View style={styles.starRow}>

        {/* STAR 1 */}
        <View style={styles.starWrapper}>
          <Image source={require("../assets/star_grey.png")} style={styles.star} />
          <Animated.Image
            source={require("../assets/star_gold.png")}
            style={[styles.star, styles.absolute, star1Style]}
          />
        </View>

        {/* STAR 2 */}
        <View style={styles.starWrapper}>
          <Image source={require("../assets/star_grey.png")} style={styles.star} />
          <Animated.Image
            source={require("../assets/star_gold.png")}
            style={[styles.star, styles.absolute, star2Style]}
          />
        </View>

        {/* STAR 3 */}
        <View style={styles.starWrapper}>
          <Image source={require("../assets/star_grey.png")} style={styles.star} />
          <Animated.Image
            source={require("../assets/star_gold.png")}
            style={[styles.star, styles.absolute, star3Style]}
          />
        </View>
      </View>

      <AnimatedText
          animatedProps={animatedScoreProps as any}
          style={{ fontSize: 22, fontWeight: "600", marginTop: 20 }}
        />


      <Animated.Text style={[styles.score, { marginTop: 20 }]}>Accuracy: {accuracy}%</Animated.Text>

      <TouchableOpacity
        onPress={() => {
          dispatch({ type: "RESET" });
          navigation.replace("Question");
        }}
        style={{
          marginTop: 40,
          padding: 15,
          backgroundColor: "green",
          borderRadius: 8,
          width: "70%",
        }}
      >
        <Text style={{ color: "white", textAlign: "center", fontSize: 18 }}>
          Restart Quiz
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  score: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
    lineHeight: 12,
    letterSpacing: -0.3,
    verticalAlign: "middle",
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
