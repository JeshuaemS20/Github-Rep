import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View, TextInput, Image, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../navigation/types';

// Import the logo (make sure the path and file exist)
const appLogo = require('../../assets/StudyCalc AI logo app.png');

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // Here you would normally validate input and perform login logic
    // For now, just navigate to Calculator
    navigation.navigate('Calculator');
  };

  return (
    <KeyboardAvoidingView
      style={styles.outer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.gradientBG} />
      <View style={styles.container}>
        <Image source={appLogo} style={styles.logoHolder} resizeMode="contain" />
        <Text style={styles.brand}>StudyCalc AI</Text>
        <Text style={styles.subtitle}>
          <Text style={{ color: '#B5FF39' }}> Unlock advanced AI features!</Text>
        </Text>
        <View style={styles.formCard}>
          <Text style={styles.label}>School Email</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. you@myschool.edu"
            placeholderTextColor="#737986"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            textAlign="left"
            selectionColor="#B5FF39"
          />
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordField}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="Password"
              placeholderTextColor="#737986"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              textAlign="left"
              selectionColor="#B5FF39"
            />
            <TouchableOpacity
              onPress={() => setShowPassword((show) => !show)}
              style={styles.eyeButton}
              hitSlop={12}
            >
              <Text style={styles.eyeIcon}>{showPassword ? "🙈" : "👁️"}</Text>
            </TouchableOpacity>
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed
            ]}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </Pressable>
          <View style={styles.orContainer}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.orLine} />
          </View>
          <TouchableOpacity style={styles.altButton}>
            <Text style={styles.altButtonText}>Sign in with Google</Text>
          </TouchableOpacity>
          <View style={styles.footerRow}>
            <Text style={{ color: '#8C9299' }}>Don't have an account? </Text>
            <Pressable onPress={() => {/* handle create account */}}>
              <Text style={styles.footerAction}>Sign up</Text>
            </Pressable>
          </View>
          <View style={styles.footerRow}>
            <Pressable onPress={() => {/* handle forgot password */}}>
              <Text style={styles.footerForgot}>Forgot password?</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: '#1A1C1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientBG: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    zIndex: 0,
    // Simulate a subtle gradient w/ linear-gradient hack using a View overlay
    // Ideally, use expo-linear-gradient for real gradients in a real app
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    // Removed invalid 'background' property for native styles
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingBottom: 20,
    zIndex: 2,
  },
  logoHolder: {
    width: 120,
    height: 120,
    marginBottom: 16,
    borderRadius: 24,
    backgroundColor: '#212325',
    borderWidth: 2,
    borderColor: '#B5FF39',
    shadowColor: '#B5FF39',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.21,
    shadowRadius: 12,
  },
  title: {
    fontSize: 29,
    fontWeight: '800',
    color: '#E8EAED',
    textAlign: 'center',
    width: '100%',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  brand: {
    color: '#B5FF39',
    fontWeight: 'bold',
    fontSize: 32, // made StudyCalc AI bigger
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: 0.4,
  },
  subtitle: {
    fontSize: 16,
    color: '#9AA0A6',
    marginBottom: 22,
    textAlign: 'center',
    width: '100%',
  },
  formCard: {
    width: '100%',
    maxWidth: 375,
    backgroundColor: '#23252B',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#383B41',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 9,
    marginBottom: 18,
  },
  label: {
    color: '#B5FF39',
    fontSize: 14,
    marginBottom: 7,
    marginTop: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  input: {
    width: '100%',
    backgroundColor: '#181A1B',
    color: '#E8EAED',
    borderRadius: 8,
    paddingVertical: 13,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#2F3136',
    shadowColor: '#181B1E',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 1.5 },
    shadowRadius: 2,
  },
  passwordField: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  eyeButton: {
    marginLeft: 8,
    padding: 4,
  },
  eyeIcon: {
    fontSize: 20,
    color: '#8C9299',
  },
  button: {
    backgroundColor: '#B5FF39',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 3,
    marginBottom: 5,
    shadowColor: '#B5FF39',
    shadowOpacity: 0.17,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  buttonPressed: {
    opacity: 0.82,
    backgroundColor: '#96df27'
  },
  buttonText: {
    color: '#212325',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 17,
    marginBottom: 8,
  },
  orLine: {
    flex: 1,
    height: 1.4,
    backgroundColor: '#313438',
    borderRadius: 12,
    marginHorizontal: 7,
  },
  orText: {
    color: '#6C707A',
    fontSize: 14,
    fontWeight: '600',
  },
  altButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1.4,
    borderColor: '#35373a',
    paddingVertical: 12,
    paddingHorizontal: 9,
    marginTop: 8,
    backgroundColor: '#191C1E',
  },
  altButtonText: {
    color: '#E8EAED',
    fontWeight: 'bold',
    marginLeft: 12,
    fontSize: 16,
    letterSpacing: 0.1
  },
  altIcon: {
    width: 28,
    height: 28,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  footerAction: {
    color: '#B5FF39',
    fontWeight: '700',
    fontSize: 15,
    textDecorationLine: 'underline',
    marginLeft: 2,
    letterSpacing: 0.1
  },
  footerForgot: {
    color: '#A9E3A1',
    fontWeight: '600',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});