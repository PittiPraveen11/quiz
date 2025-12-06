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

  const left = topThree[1];
  const center = topThree[0];
  const right = topThree[2];

  const rankIcons = {
    1: require("../assets/firstrank.png"),
    2: require("../assets/secondrank.png"),
    3: require("../assets/thirdrank.png"),
  };

  return (
    <View style={styles.container}>
      
      {/* 🔶 TOP CARD — NOT SCROLLABLE */}
      <View style={styles.topCardWrapper}>
        <LinearGradient
          colors={["#FFB71B", "#FFC446", "#FFA930", "#FFB71B"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.cardBorder}
        >
          <LinearGradient
            colors={["#361E02", "#A26721"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.topCard}
          >
            <Text style={styles.headerTitle}>Leaderboard</Text>

            {/* 🔶 TOP THREE */}
            <View style={styles.topThreeRow}>
              
              {/* LEFT - 2ND */}
              <View style={styles.smallRankBox}>
                <Image source={rankIcons[2]} style={styles.rankBadgeSmall} />
                <Image source={left.avatar} style={styles.smallAvatar} />
                <Text style={styles.smallName} numberOfLines={1}>{left.userName}</Text>
                <Text style={styles.smallScore}>{left.totalScore}</Text>
              </View>

              {/* CENTER - 1ST */}
              <View style={styles.centerRankBox}>
                <Image source={rankIcons[1]} style={styles.rankBadgeBig} />
                <Image source={center.avatar} style={styles.bigAvatar} />
                <Text style={styles.bigName} numberOfLines={1}>{center.userName}</Text>
                <Text style={styles.bigScore}>{center.totalScore}</Text>
              </View>

              {/* RIGHT - 3RD */}
              <View style={styles.smallRankBox}>
                <Image source={rankIcons[3]} style={styles.rankBadgeSmall} />
                <Image source={right.avatar} style={styles.smallAvatar} />
                <Text style={styles.smallName} numberOfLines={1}>{right.userName}</Text>
                <Text style={styles.smallScore}>{right.totalScore}</Text>
              </View>

            </View>
          </LinearGradient>
        </LinearGradient>
      </View>

      {/* 🔶 SCROLLABLE LIST */}
      <ScrollView 
        style={styles.listScroll}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      >
        {leaderboardData.slice(3).map((item) => (
          <View key={item.rank} style={styles.rowItem}>
            
            <Text style={styles.rankText}>{item.rank}</Text>

            <Image source={item.avatar} style={styles.rowAvatar} />

            <Text style={styles.rowName} numberOfLines={1}>
              {item.userName}
            </Text>

            <Text style={styles.rowScore}>{item.totalScore}</Text>

          </View>
        ))}
      </ScrollView>

    </View>
  );
};

export default LeaderboardScreen;




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF7EB",
  },

  // 🔶 TOP FIXED CARD
  topCardWrapper: {
    width: "100%",
    // paddingHorizontal: 20,
    // marginTop: 20,
  },

  cardBorder: {
    padding: 3,
    // borderTopLeftRadius: 40,
    // borderTopRightRadius: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },

  topCard: {
    // borderRadius: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingVertical: 20,
    paddingHorizontal: 20,
    // minHeight: 225,
  },

  headerTitle: {
    textAlign: "center",
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
  },

  topThreeRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 20,
  },
  
  smallRankBox: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  
  centerRankBox: {
    alignItems: "center",
    justifyContent: "flex-end",
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
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2.5,
    borderColor: "#FFB71B",
    marginBottom: 8,
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

  // 🔶 LIST
  listScroll: {
    flex: 1,
    marginTop: 10,
  },

  listContainer: {
    paddingBottom: 40,
  },

  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "#FFECD5",
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 18,
  },

  rankText: {
    fontSize: 14,
    fontWeight: "600",
    width: 20,
    textAlign: "center",
    color: "#5A3000",
  },

  rowAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 50,
  },

  rowName: {
    flex: 1,
    fontSize: 12,
    textAlign: "center",
    
    color: "#5A3000",
    fontWeight: "600",
  },

  rowScore: {
    fontSize: 12,
    fontWeight: "600",
    color: "#E78B25",
    textAlign: "center",
    marginRight: 10,
  },
});
