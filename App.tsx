import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import QuestionScreen from "./src/components/QuestionScreen";
import ResultScreen from "./src/components/ResultScreen";
import { QuizProvider } from "./src/context/QuizContect";
import { SafeAreaView } from "react-native-safe-area-context";
import ResultLeaderScreen from "./src/components/ResultLeaderScreen";
import LeaderboardScreen from "./src/components/LeaderboardScreen";
import QuizScreen from "./src/components/QuizScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  Question: undefined;
  Result: undefined;
  ResultLeaderScreen: undefined;
  LeaderboardScreen: undefined;
  QuizScreen: undefined;
};
export default function App() {
  return (
    <QuizProvider>
      <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Question"
          screenOptions={{
            headerShown: false,
          }}
          >
            <Stack.Screen name="Question" component={QuestionScreen} />
            <Stack.Screen name="Result" component={ResultScreen} />
            <Stack.Screen name="ResultLeaderScreen" component={ResultLeaderScreen} />
            <Stack.Screen name="LeaderboardScreen" component={LeaderboardScreen} />
            <Stack.Screen name="QuizScreen" component={QuizScreen} />
            
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </QuizProvider>
  );
}
