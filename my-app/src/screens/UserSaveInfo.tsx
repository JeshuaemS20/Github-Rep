import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'UserSaveInfo'>;

export default function UserSaveInfo({ route, navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { calculations, latestDisplay } = route.params;

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Missing Info', 'Please enter both your name and email.');
      return;
    }
    setIsSaving(true);
    try {
      // Example for email format validation (simple)
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(email.trim())) {
        Alert.alert('Invalid Email', 'Please enter a valid email address.');
        setIsSaving(false);
        return;
      }

      Alert.alert(
        'Saved!',
        `Thank you, ${name.trim()}!\nSaved with ${calculations.length} calculations.\nLatest display: ${latestDisplay}`
      );
      setName('');
      setEmail('');
    } catch (err) {
      Alert.alert('Error', 'An error occurred while saving your info.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.outer}
    >
      <View style={styles.container}>
        <Text style={styles.header}>Save Your Info</Text>
        <Text style={styles.metaText}>Calculations linked: {calculations.length}</Text>
        <Text style={styles.metaText}>Current result: {latestDisplay}</Text>
        <ScrollView style={styles.calcList} contentContainerStyle={styles.calcListContent}>
          {calculations.slice(0, 5).map((calc, idx) => (
            <Text key={`${calc.expression}-${idx}`} style={styles.calcItem}>
              {calc.expression} = {calc.result}
            </Text>
          ))}
        </ScrollView>
        <TextInput
          style={styles.input}
          placeholder="Your Name"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
          editable={!isSaving}
          autoCapitalize="words"
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Your Email"
          placeholderTextColor="#888"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          editable={!isSaving}
          autoCorrect={false}
        />
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            isSaving && styles.buttonDisabled,
          ]}
          onPress={handleSave}
          disabled={isSaving}
        >
          <Text style={styles.buttonText}>{isSaving ? 'Saving...' : 'Save Info'}</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.secondaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.secondaryButtonText}>Back to Calculator</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.secondaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.secondaryButtonText}>Back to Login</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    backgroundColor: '#232323',
    borderRadius: 12,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 24,
    elevation: 4,
  },
  header: {
    fontSize: 22,
    color: '#B5FF39',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  metaText: {
    color: '#b1b8b9',
    fontSize: 14,
    marginBottom: 6,
  },
  calcList: {
    width: '100%',
    maxHeight: 120,
    marginBottom: 10,
  },
  calcListContent: {
    gap: 6,
  },
  calcItem: {
    color: '#f3f3f3',
    fontSize: 13,
    backgroundColor: '#2d2f33',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  input: {
    width: 260,
    padding: 12,
    marginVertical: 8,
    borderRadius: 6,
    backgroundColor: '#35373a',
    color: '#f3f3f3',
    fontSize: 16,
  },
  button: {
    marginTop: 18,
    backgroundColor: '#B5FF39',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#232323',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    marginTop: 10,
    backgroundColor: '#2d3139',
  },
  secondaryButtonText: {
    color: '#E8EAED',
    fontSize: 16,
    fontWeight: 'bold',
  },
});