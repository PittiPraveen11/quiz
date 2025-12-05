import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { QuizContext } from "../context/QuizContect";
import { leaderboardData } from "../data/leaderboardjson";

/**
 * ResultLeaderScreen.tsx
 * - Top 3 layout: 2nd (left), 1st (center bigger), 3rd (right)
 * - Stars from context (filled + grey placeholders)
 * - Cup pulse animation
 * - Leaderboard preview card pinned at bottom with curved look
 */

export default function ResultLeaderScreen({ navigation }: any) {
  const { state, dispatch } = useContext(QuizContext);

  // context values (dynamic)
  const correctAnswers = state.score ?? 0;
  const accuracy = state.accuracy ?? 0;
  const points = state.pointsEarned ?? 0;
  const stars = state.stars ?? 0; // number 0..3 (or more)

  // top 3 from JSON (safe fallback)
  const topThree = leaderboardData.slice(0, 3);
  const leftPerson = topThree[1] ?? topThree[0] ?? { avatar: require("../assets/person1.png"), userName: "", totalScore: 0, rank: 2 };
  const centerPerson = topThree[0] ?? topThree[1] ?? { avatar: require("../assets/person1.png"), userName: "", totalScore: 0, rank: 1 };
  const rightPerson = topThree[2] ?? topThree[1] ?? { avatar: require("../assets/person1.png"), userName: "", totalScore: 0, rank: 3 };

  // cup pulse animation
  const scale = useSharedValue(1);
  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.12, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedCupStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // stars rendering: show up to 3 placeholders (gold or grey)
  const renderStars = () => {
    const arr = [0, 1, 2]; // three positions
    return (
      <View style={styles.starsRow}>
        {arr.map((i) => {
          const filled = i < stars;
          return (
            <Image
              key={i}
              source={filled ? require("../assets/star.png") : require("../assets/star_grey.png")}
              style={styles.starIcon}
            />
          );
        })}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Cup (animated) */}
      <Animated.View style={[styles.cupWrapper, animatedCupStyle]}>
        <Image source={require("../assets/winnercup.png")} style={styles.cup} />
      </Animated.View>

      {/* Stars (gold + grey placeholders) */}
      {renderStars()}

      {/* Title + subtitle */}
      <Text style={styles.title}>Quiz Complete!</Text>
      <Text style={styles.subtitle}>Perfect! You have mastered divine knowledge!</Text>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statCol}>
          <Text style={styles.statNumber}>{correctAnswers}</Text>
          <Text style={styles.statLabel}>Correct{"\n"}Answers</Text>
        </View>

        <View style={styles.verticalDivider} />

        <View style={styles.statCol}>
          <Text style={styles.statNumber}>{accuracy}%</Text>
          <Text style={styles.statLabel}>Accuracy</Text>
        </View>
      </View>

      {/* Earned */}
      <View style={styles.earnedWrap}>
        <Text style={styles.earnedTitle}>You've earned:</Text>

        <View style={styles.earnedItem}>
          <View style={styles.pointsPill}>
            <Text style={styles.pointsPillText}>+{points} Points</Text>
            <Image source={require("../assets/earnedcoins.png")} style={styles.pointsIcon} />
          </View>
        </View>
      </View>

      {/* Try another button */}
      <TouchableOpacity
        style={styles.tryBtnWrapper}
        onPress={() => {
          dispatch({ type: "RESET" });
          navigation.replace("Question");
        }}
      >
        <LinearGradient colors={["#FFB444", "#FF9500"]} style={styles.tryBtn}>
          <Text style={styles.tryBtnText}>Try another</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Spacer so content above leaves room for bottom card */}
      <View style={{ height: 36 }} />

      {/* -------------------------
          Leaderboard Card (bottom curved)
         ------------------------- */}
      <View style={styles.bottomCardWrapper}>
        <LinearGradient colors={["#2A0E05", "#A26721", "#361E02"]} style={styles.bottomCard}>
          {/* Decorative header notch for "Leaderboard" */}
          <View style={styles.notch}>
            <Text style={styles.notchText}>Leaderboard</Text>
          </View>

          {/* Top three layout: left(2nd), center(1st big), right(3rd) */}
          <View style={styles.topThreeContainer}>
            {/* LEFT - 2nd */}
            <View style={styles.smallRank}>
              <View style={styles.rankBadgeSmall}><Text style={styles.rankBadgeText}>2nd</Text></View>
              <Image source={leftPerson.avatar} style={styles.smallAvatar} />
              <Text style={styles.smallName} numberOfLines={1}>{leftPerson.userName}</Text>
              <Text style={styles.smallScore}>{leftPerson.totalScore}</Text>
            </View>

            {/* CENTER - 1st (bigger) */}
            <View style={styles.centerRank}>
              <View style={styles.rankBadgeBig}><Text style={styles.rankBadgeText}>1st</Text></View>
              <Image source={centerPerson.avatar} style={styles.bigAvatar} />
              <Text style={styles.bigName} numberOfLines={1}>{centerPerson.userName}</Text>
              <Text style={styles.bigScore}>{centerPerson.totalScore}</Text>
            </View>

            {/* RIGHT - 3rd */}
            <View style={styles.smallRank}>
              <View style={styles.rankBadgeSmall}><Text style={styles.rankBadgeText}>3rd</Text></View>
              <Image source={rightPerson.avatar} style={styles.smallAvatar} />
              <Text style={styles.smallName} numberOfLines={1}>{rightPerson.userName}</Text>
              <Text style={styles.smallScore}>{rightPerson.totalScore}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Make the whole card touchable to go to big leaderboard */}
        <TouchableOpacity style={styles.cardTouchArea} onPress={() => navigation.navigate("Result")} />
      </View>

    </ScrollView>
  );
}

/* ===================== STYLES ===================== */
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFF6EC",
    alignItems: "center",
    paddingTop: 18,
    paddingHorizontal: 16,
    paddingBottom: 0,
  },

  cupWrapper: {
    marginTop: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cup: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },

  starsRow: {
    flexDirection: "row",
    marginTop: 6,
    alignItems: "center",
  },
  starIcon: {
    width: 34,
    height: 34,
    marginHorizontal: 6,
    resizeMode: "contain",
  },

  title: {
    marginTop: 10,
    fontSize: 26,
    fontWeight: "800",
    color: "#3D1F00",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: "#6B4E2E",
    textAlign: "center",
    marginBottom: 12,
  },

  statsRow: {
    flexDirection: "row",
    width: "85%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  statCol: {
    alignItems: "center",
    width: "40%",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "800",
    color: "#3D1F00",
  },
  statLabel: {
    marginTop: 6,
    fontSize: 13,
    color: "#C4842D",
    fontWeight: "700",
    textAlign: "center",
  },

  verticalDivider: {
    width: 1,
    height: 56,
    backgroundColor: "#C8B090",
    marginHorizontal: 8,
  },

  earnedWrap: {
    marginTop: 18,
    alignItems: "center",
    width: "100%",
  },
  earnedTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3D1F00",
    marginBottom: 8,
  },
  earnedItem: {
    alignItems: "center",
  },
  pointsPill: {
    backgroundColor: "#FFF1D1",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 1,
  },
  pointsPillText: {
    color: "#C48A1C",
    fontWeight: "700",
    fontSize: 16,
    marginRight: 8,
  },
  pointsIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },

  tryBtnWrapper: {
    marginTop: 18,
    width: "80%",
    alignItems: "center",
  },
  tryBtn: {
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 14,
    elevation: 3,
  },
  tryBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },

  /* bottom card wrapper to allow notch overlap and touch area */
  bottomCardWrapper: {
    width: "100%",
    alignItems: "center",
    marginTop: 18,
    paddingBottom: 28, // bottom safe area
  },

  bottomCard: {
    width: "100%",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingTop: 22,
    paddingBottom: 26,
    paddingHorizontal: 18,
    // mimic depth and curved shape
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },

  notch: {
    position: "absolute",
    top: -18,
    alignSelf: "center",
    backgroundColor: "#FFF6EC",
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    // create small white-ish notch by drawing a small rounded box with same bg as screen
    zIndex: 5,
  },
  notchText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#3D1F00",
    paddingHorizontal: 6,
  },

  topThreeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 6,
  },

  /* small (left/right) */
  smallRank: {
    width: "28%",
    alignItems: "center",
  },
  rankBadgeSmall: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 16,
    marginBottom: -16,
    zIndex: 10,
  },
  rankBadgeText: {
    color: "#8C4A1F",
    fontSize: 12,
    fontWeight: "700",
  },
  smallAvatar: {
    width: 82,
    height: 82,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: "#CC8A2F",
    marginTop: -6,
  },
  smallName: {
    color: "#FFFFFF",
    marginTop: 8,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  smallScore: {
    color: "#FFD38A",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 2,
  },

  /* big center */
  centerRank: {
    width: "34%",
    alignItems: "center",
  },
  rankBadgeBig: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: -22,
    zIndex: 10,
  },
  bigAvatar: {
    width: 128,
    height: 128,
    borderRadius: 999,
    borderWidth: 4,
    borderColor: "#FFCC66",
    marginTop: -10,
  },
  bigName: {
    color: "#FFFFFF",
    marginTop: 10,
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },
  bigScore: {
    color: "#FFD38A",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 4,
  },

  /* transparent touch area above card so whole card clickable */
  cardTouchArea: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "100%",
  },
});
