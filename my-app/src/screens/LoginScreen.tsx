import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";

const { width } = Dimensions.get("window");

const appLogo = require("../../assets/StudyCalc AI logo app.png");

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const slideAnim = useRef(new Animated.Value(-150)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPwd, setShowPwd] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        speed: 2,
        bounciness: 12,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
        easing: Easing.bounce,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: 120,
        useNativeDriver: true,
        friction: 8,
      }),
    ]).start();
  }, [slideAnim, fadeAnim, scaleAnim]);

  const validateEmail = (testEmail: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail);

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      Alert.alert("Please enter a valid email address.");
      return;
    }
    if (!password) {
      Alert.alert("Please enter your password.");
      return;
    }
    setLoading(true);
    // TODO: Implement actual login logic here (API call)
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Logged in (demo)", "Welcome!");
      navigation.navigate("Calculator" as never);
    }, 900);
  };

  const handleSignUp = () => {
    navigation.navigate("SignUp" as never);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#111213" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
    >
      <Animated.View
        style={[
          styles.headerContainer,
          {
            transform: [{ translateY: slideAnim }],
            opacity: fadeAnim,
          },
        ]}
      >
        <Animated.Image
          source={appLogo}
          style={[
            styles.logo,
            {
              transform: [{ scale: scaleAnim }],
              shadowOpacity: scaleAnim.interpolate({
                inputRange: [0.7, 1],
                outputRange: [0, 0.35],
              }),
            },
          ]}
          resizeMode="contain"
        />
        <Text style={styles.brand}>StudyCalc AI</Text>
        <Text style={styles.slogan}>
          Fast, smart, and fun math for students
        </Text>
      </Animated.View>
      <Animated.View
        style={{
          flex: 1,
          padding: 26,
          justifyContent: "flex-start",
          opacity: fadeAnim,
        }}
      >
        <Animated.View
          style={{
            backgroundColor: "#23252A",
            borderRadius: 18,
            padding: 18,
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [-150, 0],
                  outputRange: [150, 0],
                }),
              },
            ],
            opacity: fadeAnim,
            shadowOpacity: 0.3,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
            shadowColor: "#53ffb5",
            elevation: 8,
          }}
        >
          <Text style={styles.inputLabelLarge}>Email</Text>
          <TextInput
            style={[
              styles.inputField,
              styles.emailInputFieldLarge,
              {
                color: "#ffffff",
                backgroundColor: "#27282c",
                fontStyle: 'italic',
                letterSpacing: 0.6,
                fontSize: 19,
                elevation: 2,
                borderColor: "#B5FF39",
                borderWidth: 1.8,
                paddingVertical: 22,
                paddingHorizontal: 15,
              }
            ]}
            value={email}
            placeholderTextColor="#b5ff39"
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            returnKeyType="next"
            editable={!loading}
            selectionColor="#B5FF39"
            textContentType="username"
            importantForAutofill="yes"
            allowFontScaling
            underlineColorAndroid="#B5FF39"
            accessibilityLabel="Email Input Field"
          />
          <Text style={[styles.inputLabel, { marginTop: 16 }]}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[
                styles.inputField,
                {
                  color: "#ffffff",
                  backgroundColor: "#27282c",
                  fontStyle: 'italic',
                  letterSpacing: 0.5,
                  fontSize: 19,
                  elevation: 2,
                  borderColor: "#B5FF39",
                  borderWidth: 1.3,
                }
              ]}
              value={password}
              placeholderTextColor="#aaffcc"
              onChangeText={setPassword}
              secureTextEntry={!showPwd}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
              returnKeyType="go"
              onSubmitEditing={handleLogin}
              selectionColor="#B5FF39"
              textContentType="password"
              importantForAutofill="yes"
              allowFontScaling
              underlineColorAndroid="#B5FF39"
              accessibilityLabel="Password Input Field"
            />
            <TouchableOpacity
              onPress={() => setShowPwd((prev) => !prev)}
              style={styles.eyeButton}
              accessible={true}
              accessibilityLabel={showPwd ? "Hide password" : "Show password"}
              disabled={loading}
            >
              <Text style={{ color: "#B5FF39", fontSize: 21 }}>
                {showPwd ? "🙈" : "👁️"}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={handleLogin}
            style={[styles.loginButton, loading && { opacity: 0.8 }]}
            disabled={loading}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Sign In"
          >
            <Animated.View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                opacity: scaleAnim,
              }}
            >
              {loading ? (
                <ActivityIndicator color="#B5FF39" size="small" />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
        <View style={styles.footerInline}>
          <Text style={{ color: "#999", fontSize: 14 }}>
            {"Don't have an account?"}
          </Text>
          <TouchableOpacity
            onPress={handleSignUp}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Sign Up"
          >
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    marginTop: width > 370 ? 78 : 54,
    marginBottom: 26,
  },
  logo: {
    width: 98,
    height: 98,
    marginBottom: 8,
  },
  brand: {
    fontSize: 29,
    color: "#B5FF39",
    fontWeight: "bold",
    letterSpacing: 1.1,
    textAlign: "center",
    marginBottom: 2,
  },
  slogan: {
    color: "#CCCCCC",
    fontSize: 15.4,
    fontWeight: "500",
    fontStyle: "italic",
    letterSpacing: 0.13,
    textAlign: "center",
  },
  inputLabel: {
    color: "#B5FF39",
    fontWeight: "700",
    fontSize: 14.6,
    marginBottom: 7,
    marginLeft: 2,
    letterSpacing: 0.13,
  },
  inputLabelLarge: {
    color: "#B5FF39",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
    marginLeft: 2,
    letterSpacing: 0.16,
  },
  inputField: {
    borderWidth: 1.2,
    borderColor: "#35373a",
    borderRadius: 9,
    color: "#EDEEF0",
    paddingVertical: 12,
    paddingHorizontal: 13,
    backgroundColor: "#191C1E",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: -2,
    minWidth: 90,
    flex: 1,
  },
  emailInputField: {
    fontSize: 18,
    paddingVertical: 15,
    color: "#EDEEF0",
    backgroundColor: "#23252A",
  },
  // Larger, more prominent email input style
  emailInputFieldLarge: {
    fontSize: 24,
    paddingVertical: 22,
    paddingHorizontal: 15,
    color: "#EDEEF0",
    backgroundColor: "#23252A",
    borderRadius: 12,
    minHeight: 60,
    marginBottom: 4,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  eyeButton: {
    marginLeft: -32,
    padding: 6,
    zIndex: 1,
  },
  loginButton: {
    backgroundColor: "#B5FF39",
    borderRadius: 10,
    paddingVertical: 13,
    marginTop: 24,
    marginBottom: 6,
    alignItems: "center",
    shadowColor: "#B5FF39",
    shadowOffset: { width: 0, height: 1.6 },
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 4,
  },
  loginButtonText: {
    color: "#172219",
    fontWeight: "700",
    fontSize: 17.2,
    letterSpacing: 0.21,
    textAlign: "center",
  },
  footerInline: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    gap: 8,
  },
  footerLink: {
    color: "#B5FF39",
    fontWeight: "700",
    fontSize: 15,
    marginLeft: 6,
    textDecorationLine: "underline",
  },
});
