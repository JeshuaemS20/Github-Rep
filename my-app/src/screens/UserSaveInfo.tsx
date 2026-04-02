import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "UserSaveInfo">;

export default function UserSaveInfo({ navigation, route }: Props) {
  // route params are already properly typed by NativeStackScreenProps, so no need for custom interface
  const equations = route.params?.calculations ?? [];
  // The UserSaveInfo route does not receive a userEmail param, so we provide a generic welcome.
  const userEmail = "User";


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {userEmail}!</Text>
      <Text style={styles.infoMsg}>Your equations have been saved.</Text>
      <Text style={styles.equationsLabel}>Saved Equations:</Text>
      {equations.length === 0 ? (
        <Text style={styles.noEquations}>No equations saved yet.</Text>
      ) : (
        <View style={styles.equationsList}>
          {equations.map((eq, idx) => (
            <Text style={styles.equationItem} key={idx}>
              {eq.expression} = {eq.result}
            </Text>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={styles.calculatorButton}
        onPress={() => navigation.navigate("Calculator")}
      >
        <Text style={styles.buttonText}>Back to Calculator</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#23252A",
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#B5FF39",
    marginBottom: 10,
    textAlign: "center",
    letterSpacing: 0.18,
  },
  infoMsg: {
    color: "#FFF",
    fontSize: 16,
    marginBottom: 18,
    textAlign: "center",
    opacity: 0.92,
  },
  equationsLabel: {
    fontWeight: "600",
    color: "#B5FF39",
    fontSize: 18,
    alignSelf: "flex-start",
    marginBottom: 6,
    marginTop: 12,
  },
  equationsList: {
    marginBottom: 14,
    alignSelf: "stretch",
    paddingHorizontal: 6,
  },
  equationItem: {
    color: "#FFF",
    backgroundColor: "#31343a",
    borderRadius: 7,
    padding: 8,
    marginVertical: 4,
    fontSize: 15.5,
    letterSpacing: 0.09,
  },
  noEquations: {
    color: "#bdbdbd",
    fontStyle: "italic",
    marginBottom: 16,
  },
  calculatorButton: {
    marginTop: 24,
    backgroundColor: "#B5FF39",
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 28,
    alignItems: "center",
    shadowColor: "#B5FF39",
    shadowOffset: { width: 0, height: 1.6 },
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: "#172219",
    fontWeight: "700",
    fontSize: 19,
    textAlign: "center",
    letterSpacing: 0.19,
  },
});