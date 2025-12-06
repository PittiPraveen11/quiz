import { StyleSheet, Text, View, Image ,TouchableOpacity, ScrollView} from 'react-native'
import React, { useContext, useEffect , useState} from 'react'
import LinearGradient from "react-native-linear-gradient";
import { leaderboardData } from "../data/leaderboardjson";
import { QuizContext } from "../context/QuizContect";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type LeaderboardScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  "Leaderboard"
>;

const LeaderboardScreen = ({ navigation }: { navigation: LeaderboardScreenProps }) => {
  const { state, dispatch } = useContext(QuizContext);

  const topThree = leaderboardData.slice(0, 3);
  const leftPerson = topThree[1] ?? topThree[0] ?? { avatar: require("../assets/person1.png"), userName: "", totalScore: 0, rank: 2 };
  const centerPerson = topThree[0] ?? topThree[1] ?? { avatar: require("../assets/person1.png"), userName: "", totalScore: 0, rank: 1 };
  const rightPerson = topThree[2] ?? topThree[1] ?? { avatar: require("../assets/person1.png"), userName: "", totalScore: 0, rank: 3 };

  const rankIcons = {
    1: require("../assets/firstrank.png"),
    2: require("../assets/secondrank.png"),
    3: require("../assets/thirdrank.png"),
  };

  return (
    <View style={styles.bottomCardWrapper}>
        <LinearGradient
          colors={["#FFB71B", "#FFC446", "#FFA930", "#FFB71B", "#FF9500"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.borderGradient}
        >
          <LinearGradient
            colors={[ "#361E02", "#A26721"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.bottomCard}
          > 
            <View style={styles.notch}>
              <Text style={styles.notchText}>Leaderboard</Text>
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

      </View>
  )
}

export default LeaderboardScreen

const styles = StyleSheet.create({

    bottomCardWrapper: {
        position: "absolute",
        top: 0,
        // left: 0,
        // right: 0,
        width: "100%",
      },
      borderGradient: {
        width: "100%",
        borderRadius: 40,
        padding: 3, // This creates the 3px border effect
      },
      bottomCard: {
        width: "100%",
        minHeight: 225,
        borderRadius: 40,
        paddingTop: 24,
        paddingBottom: 24,
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
        // height :170,
        // width : 304,
        marginTop : 20,
        alignSelf: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 0,
        backgroundColor: "green",
      },
      smallRank: {
        marginTop : 28,
        alignItems: "center",
        backgroundColor: "red",
        flex: 1,
        justifyContent: "flex-end",
        
      },
      centerRank: {
        alignItems: "center",
        flex: 1.15,
        backgroundColor: "blue",
        justifyContent: "flex-end",
        marginHorizontal: 18,
      },
      rankBadgeSmall: {
        width: 32,
        height: 32,
        resizeMode: "contain",
        marginBottom: 6,
      },
      rankBadgeBig: {
        width: 38,
        height: 38,
        resizeMode: "contain",
        marginBottom: 6,
      },
      smallAvatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2.5,
        borderColor: "#FFB71B",
      },
      bigAvatar: {
        width: 88,
        height: 88,
        borderRadius: 44,
        borderWidth: 3,
        borderColor: "#FFB71B",
        marginBottom: 8,
      },
      smallName: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 4,
        maxWidth: 85,
      },
      bigName: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 4,
        maxWidth: 105,
      },
      smallScore: {
        color: "#FFB71B",
        fontSize: 15,
        fontWeight: "700",
      },
      bigScore: {
        color: "#FFB71B",
        fontSize: 17,
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


})