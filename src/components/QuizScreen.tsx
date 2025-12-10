import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { PlayQuizModel, CategoryModel, UserRankModel } from "../QuizInterface";
import LinearGradient from "react-native-linear-gradient";

type QuizScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  "QuizScreen"
>;

const QuizScreen = ({ navigation }: { navigation: QuizScreenProps }) => {
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [userDetails, setUserDetails] = useState<UserRankModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const USER_ID = 268; 


  const getCategories = async () => {
    try {
      setLoading(true);
      console.log("Fetching categories");
      const response = await fetch(
        "https://devgateway.techxrdev.in/api/quiz/category",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setLoading(false);
      console.log("Categories response:", response);
      const data = (await response.json()) as CategoryModel[];
      console.log("Categories fetched:", data);
      // console.log("Number of categories:", data?.length);
      setCategories(data || []);
      setError(null);
    } catch (e) {
      setLoading(false);
      console.log("Category Fetch Error", e);
      setError(`Failed to load categories: ${e}`);
    }
  };

  const getUserDetails = async () => {
    try {
      console.log("Fetching user details for user ID:", USER_ID);
      const response = await fetch(
        `https://devgateway.techxrdev.in/api/quiz/userRank?userId=268`
      );
      console.log("User details response:", response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = (await response.json()) as UserRankModel;
      console.log("User details fetched:", data);
      setUserDetails(data);
    }
     catch (e) {
      console.log("User details error", e);
      // Don't set error for user details as it's not critical
    }
  };


  const playQuiz = async (categoryId: string, categoryName: string) => {
    try {
      const response = await fetch(
        `https://devgateway.techxrdev.in/api/quiz/quizCategory?categoryId=${categoryId}&userId=${USER_ID}`
      );

      const data = (await response.json()) as PlayQuizModel;

      // Navigate to Questions Screen with required data
      navigation.navigate("QuestionScreen", {
        categoryName: categoryName,
        questions: data.questions,
      });
    } catch (error) {
      console.log("Play quiz error", error);
    }
  };

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([getCategories(), getUserDetails()]);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF931E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Section */}
        {userDetails && (
          <View style={styles.userProfileSection}>
            <Image
              source={require("../assets/person1.png")}
              style={styles.avatar}
              resizeMode="cover"
            />
            <Text style={styles.userName}>{userDetails.userName}</Text>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Image
                  source={require("../assets/crown.png")}
                  style={styles.statIcon}
                  resizeMode="contain"
                />
                <View style={styles.statTextContainer}>
                  <Text style={styles.statValue}>{userDetails.rank}</Text>
                  <Text style={styles.statLabel}>Rank</Text>
                </View>
              </View>

              <View style={[styles.statItem, { marginLeft: 16 }]}>
                <Image
                  source={require("../assets/star-card.png")}
                  style={styles.statIcon}
                  resizeMode="contain"
                />
                <View style={styles.statTextContainer}>
                  <Text style={styles.statValue}>
                    {userDetails.totalScore.toFixed(0)}
                  </Text>
                  <Text style={styles.statLabel}>Score</Text>
                </View>
              </View>

              <TouchableOpacity 
              style={[styles.leaderboardButton, { marginLeft: 16 }]}
              onPress={() => navigation.navigate("LeaderboardScreen")}
              >
                <Image
                  source={require("../assets/winnercup.png")}
                  style={styles.leaderboardIcon}
                  resizeMode="contain"
                />
                <Text style={styles.leaderboardButtonText}>Leaderboard</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Category Cards */}
        <View style={styles.categoriesContainer}>
          {error && !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => {
                  setLoading(true);
                  getCategories();
                  setLoading(false);
                }}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : categories.length > 0 && (
            categories.map((category) => (
              <View key={category.id} style={styles.categoryCard}>
                <Image
                  source={{ uri: category.imageUrl }}
                  style={styles.categoryImage}
                  resizeMode="cover"
                  onError={(e) => {
                    console.log("Image load error for category:", category.name.en, e.nativeEvent.error);
                  }}
                  onLoad={() => {
                    console.log("Image loaded successfully for:", category.name.en);
                  }}
                />
                <View style={styles.categoryContent}>
                  <View style={styles.categoryNameContainer}>
                    <Image
                      source={require("../assets/leaderboard.png")}
                      style={styles.categoryNameBackground}
                      resizeMode="stretch"
                    />
                    <Text style={styles.categoryName}>
                      {category.name.en}
                    </Text>
                  </View>
                  <View style={styles.categoryFooter}>
                    <View style={styles.categoryCoins}>
                      <Text style={styles.coinValue}>50</Text>
                      <Image
                        source={require("../assets/lotus-coin.png")}
                        style={styles.categoryCoinIcon}
                        resizeMode="contain"
                      />
                      <Text style={styles.coinValue}>10</Text>
                      <Image
                        source={require("../assets/lotus-coin.png")}
                        style={styles.categoryCoinIcon}
                        resizeMode="contain"
                      />
                    </View>
                    <TouchableOpacity
                      style={styles.playButton}
                      onPress={() => playQuiz(category.id, category.name.en)}
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
                        style={styles.playButtonGradient}
                      >
                        <Text style={styles.playButtonText}>Play</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )
          }
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F0",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF8F0",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#5A3000",
    marginRight: 8,
    fontFamily: "Poppins-SemiBold",
  },
  headerIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  coinContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF4DD",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FFC988",
  },
  coinText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#5A3000",
    marginRight: 4,
    fontFamily: "Poppins-SemiBold",
  },
  coinIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  bellContainer: {
    marginLeft: 12,
  },
  bellIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  titleSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  backIcon: {
    fontSize: 24,
    color: "#5A3000",
    marginRight: 12,
    fontWeight: "600",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#5A3000",
    fontFamily: "Poppins-SemiBold",
  },
  userProfileSection: {
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#5A3000",
    marginBottom: 16,
    fontFamily: "Poppins-SemiBold",
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF4DD",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFC988",
  },
  statIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
    marginRight: 8,
  },
  statTextContainer: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#5A3000",
    fontFamily: "Poppins-SemiBold",
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "400",
    color: "#5A3000",
    fontFamily: "Poppins-Regular",
  },
  leaderboardButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF4DD",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFC988",
  },
  leaderboardIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    marginRight: 6,
  },
  leaderboardButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#5A3000",
    fontFamily: "Poppins-SemiBold",
  },
  categoriesContainer: {
    paddingHorizontal: 12,
  },
  categoryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FEEFDD",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  categoryContent: {
    padding: 12,
  },
  categoryNameContainer: {
    position: "relative",
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 40,
  },
  categoryNameBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
    opacity: 0.3,
    top: 0,
    left: 0,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#5A3000",
    fontFamily: "Poppins-SemiBold",
    paddingVertical: 8,
    paddingHorizontal: 12,
    textAlign: "center",
    zIndex: 1,
  },
  categoryFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryCoins: {
    flexDirection: "row",
    alignItems: "center",
  },
  coinValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#5A3000",
    fontFamily: "Poppins-SemiBold",
  },
  categoryCoinIcon: {
    width: 18,
    height: 18,
    resizeMode: "contain",
    marginLeft: 4,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#5A3000",
    fontFamily: "Poppins-Regular",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: "#FF0000",
    fontFamily: "Poppins-Regular",
    marginBottom: 8,
    textAlign: "center",
  },
  debugText: {
    fontSize: 12,
    color: "#999",
    fontFamily: "Poppins-Regular",
    marginTop: 4,
  },
  retryButton: {
    backgroundColor: "#FF931E",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
  },
  playButton: {
    borderRadius: 12,
    overflow: "hidden",
    borderBottomWidth: 2,
    borderBottomColor: "#AF4001",
  },
  playButtonGradient: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  playButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
  },
});

export default QuizScreen;
