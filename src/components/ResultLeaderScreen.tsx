import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
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
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  const correctAnswers = state.score ?? 0;
  const accuracy = state.accuracy ?? 0;
  const points = state.pointsEarned ?? 0;
  const stars = state.stars ?? 0;
  
  // Calculate responsive leaderboard card height (increased)
  const leaderboardCardHeight = Math.max(200, screenHeight * 0.25);

  
  const topThree = leaderboardData.slice(0, 3);
  const leftPerson = topThree[1] ?? topThree[0] ?? { avatar: require("../assets/person1.png"), userName: "", totalScore: 0, rank: 2 };
  const centerPerson = topThree[0] ?? topThree[1] ?? { avatar: require("../assets/person1.png"), userName: "", totalScore: 0, rank: 1 };
  const rightPerson = topThree[2] ?? topThree[1] ?? { avatar: require("../assets/person1.png"), userName: "", totalScore: 0, rank: 3 };

  const rankIcons = {
    1: require("../assets/firstrank.png"),
    2: require("../assets/secondrank.png"),
    3: require("../assets/thirdrank.png"),
  };

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

  const renderStars = () => {
    const arr = [0, 1, 2]; 
    return (
      <View style={styles.starsRow}>
        {arr.map((i) => {
          const filled = i < stars;
          const isCenter = i === 1;
          return (
            <Image
              key={i}
              source={filled ? require("../assets/star.png") : require("../assets/star_grey.png")}
              style={[
                styles.starIcon,
                isCenter && styles.starCenter,
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.contentContainer, { paddingBottom: leaderboardCardHeight + 10 }]}>
        <Animated.View style={[styles.cupWrapper, animatedCupStyle]}>
          <Image 
            source={require("../assets/winnercup.png")} 
            style={[
              styles.cup,
              {
                width: Math.min(85, screenWidth * 0.23),
                height: Math.min(85, screenWidth * 0.23),
              }
            ]} 
          />
        </Animated.View>

        {renderStars()}

        <Text style={styles.title}>Quiz Complete!</Text>
        <Text style={styles.subtitle}>Perfect! You have mastered divine knowledge!</Text>

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

        <View style={styles.earnedWrap}>
          <Text style={styles.earnedTitle}>You've earned:</Text>

          <View style={styles.earnedItem}>
            <View style={styles.pointsPill}>
              <Text style={styles.pointsPillText}>+{points} Points</Text>
              <Image source={require("../assets/earnedcoins.png")} style={styles.pointsIcon} />
            </View>
          </View>
        </View>

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={styles.buttonWrapper}
            onPress={() => {
              dispatch({ type: "RESET" });
              navigation.replace("Question");
            }}
          >
            {/* Border gradient wrapper */}
            <LinearGradient
              colors={["#FBD500", "#B75000"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonBorder}
            >
              {/* Inner fill gradient */}
              <LinearGradient 
                colors={["#FF931E", "#F58B21", "#FFC117", "#FBA225", "#E27A19"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Try another</Text>
              </LinearGradient>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonWrapper}
            onPress={() => {
              // TODO: Implement share functionality
              console.log("Share score");
            }}
          >
            {/* Border gradient wrapper */}
            <LinearGradient
              colors={["#FBD500", "#B75000"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonBorder}
            >
              {/* Inner fill gradient */}
              <LinearGradient 
                colors={["#FF931E", "#F58B21", "#FFC117", "#FBA225", "#E27A19"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Share Score</Text>
              </LinearGradient>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>


      <View style={styles.bottomCardWrapper}>
        <LinearGradient
          colors={["#FFB71B", "#FFC446", "#FFA930", "#FFB71B", "#FF9500"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.borderGradient}
        >
          <LinearGradient
            colors={[ "#361E02", "#A26721"]}
            // locations={[ 0.2, 0.9]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            // angle={90}
            // useAngle={true}
            // angleCenter={{ x: 0.5, y: 0.5 }}
            style={styles.bottomCard}
          > 

            <View style={styles.bannerWrapper}>
                <Image
                  source={require("../assets/leaderboard.png")}
                  style={styles.bannerImage}
                />

                <Text style={styles.bannerTitle}>Leaderboard</Text>
              </View>

            <View style={styles.topThreeContainer}>
              <View style={styles.smallRank}>
                <Image source={rankIcons[2]} style={styles.rankBadgeSmall} />
                <Image source={leftPerson.avatar} style={styles.smallAvatar} />
                <Text style={styles.smallName} numberOfLines={1}>{leftPerson.userName}</Text>
                <Text style={styles.smallScore}>{leftPerson.totalScore}</Text>
              </View>

              <View style={styles.centerRank}>
                <Image source={rankIcons[1]} style={styles.rankBadgeBig} />
                <Image source={centerPerson.avatar} style={styles.bigAvatar} />
                <Text style={styles.bigName} numberOfLines={1}>{centerPerson.userName}</Text>
                <Text style={styles.bigScore}>{centerPerson.totalScore}</Text>
              </View>

              <View style={styles.smallRank}>
                <Image source={rankIcons[3]} style={styles.rankBadgeSmall} />
                <Image source={rightPerson.avatar} style={styles.smallAvatar} />
                <Text style={styles.smallName} numberOfLines={1}>{rightPerson.userName}</Text>
                <Text style={styles.smallScore}>{rightPerson.totalScore}</Text>
              </View>
            </View>
          </LinearGradient>
        </LinearGradient>

        <TouchableOpacity style={styles.cardTouchArea} onPress={() => navigation.navigate("Leaderboard")} />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF6EC",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: 12,
    paddingHorizontal: 16,
  },

  cupWrapper: {
    marginTop: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cup: {
    resizeMode: "contain",
  },

  starsRow: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  starIcon: {
    width: 28,
    height: 28,
    marginHorizontal: 5,
    resizeMode: "contain",
  },
  starCenter: {
    marginTop: -10, 
  },

  title: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: "800",
    color: "#3D1F00",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 4,
    color: "#7A4E2B",
    fontSize: 12,
    textAlign: "center",
  },

  statsRow: {
    flexDirection: "row",
    marginTop: 16,
    alignItems: "center",
  },
  statCol: {
    alignItems: "center",
    flex: 1,
    maxWidth: 130,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2A2E05",
    lineHeight: 24,
  },

  statLabel: {
    fontSize: 12,
    color: "#A27A52",
    textAlign: "center",
    lineHeight: 16,
    marginTop: 4,
  },

  verticalDivider: {
    width: 1.5,
    height: 50,
    backgroundColor: "#5A3000",
    marginHorizontal: 10,
  },

  earnedWrap: {
    marginTop: 14,
    alignItems: "center",
    width: "100%",
  },
  earnedTitle: {
    marginTop: 14,
    fontSize: 14,
    color: "#2A2E05",
    fontWeight: "600",
  },
  earnedItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  pointsPill: {
    backgroundColor: "#FFF1D1",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    elevation: 1,
  },
  pointsPillText: {
    color: "#C48A1C",
    fontWeight: "700",
    fontSize: 14,
    marginRight: 6,
  },
  pointsIcon: {
    width: 18,
    height: 18,
  },
  leaderboardImage: {
    width: 180,     
    height: 50,     
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: -10,
    marginBottom: -4,
  },
  

  buttonsRow: {
    flexDirection: "row",
    marginTop: 14,
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 6,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  buttonBorder: {
    borderRadius: 8,
    padding: 1, // Creates 1px gradient border
    borderBottomWidth: 2,
    borderBottomColor: "#AF4001",
  },
  button: {
    width: "100%",
    height: 40,
    borderRadius: 7, // 8 - 1 (border width)
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  buttonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },

  bottomCardWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
  },
  borderGradient: {
    width: "100%",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 3, // This creates the 3px border effect
  },
  bottomCard: {
    width: "100%",
    minHeight: 200,
    borderTopLeftRadius: 37, // 40 - 3 (border width)
    borderTopRightRadius: 37,
    paddingTop: 18,
    paddingBottom: 18,
    paddingHorizontal: 20,
  },
  notch: {
    alignSelf: "center",
    backgroundColor: "transparent",
    marginTop: -12,
    marginBottom: 16,
  },
  notchText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  topThreeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 4,
    marginTop: 6,
  },
  smallRank: {
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
  },
  centerRank: {
    alignItems: "center",
    flex: 1.15,
    justifyContent: "flex-end",
  },
  rankBadgeSmall: {
    width: 24,
    height: 24,
    resizeMode: "contain",
    marginBottom: 4,
  },
  rankBadgeBig: {
    width: 28,
    height: 28,
    resizeMode: "contain",
    marginBottom: 4,
  },
  smallAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#FFB71B",
    marginBottom: 6,
  },
  bigAvatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2.5,
    borderColor: "#FFB71B",
    marginBottom: 6,
  },
  smallName: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 3,
    maxWidth: 70,
  },
  bigName: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 3,
    maxWidth: 85,
  },
  smallScore: {
    color: "#FFB71B",
    fontSize: 13,
    fontWeight: "700",
  },
  bigScore: {
    color: "#FFB71B",
    fontSize: 15,
    fontWeight: "700",
  },
  cardTouchArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  bannerWrapper: {
    // width: "100%",
    // marginTop: -20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -45,     
    marginBottom: 6,    
  },
  
  bannerImage: {
    width: 180,
    height: 55,
    resizeMode: "contain",
  },
  
  bannerTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    position: "absolute",
    top: 18,            
  } 
});
