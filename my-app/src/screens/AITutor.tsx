import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AITutor'>;

export default function AITutor({ route, navigation }: Props) {
  const prompt = route.params?.prompt?.trim() || '';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Tutor</Text>
      <Text style={styles.subtitle}>Question from calculator:</Text>
      <View style={styles.promptCard}>
        <Text style={styles.promptText}>
          {prompt || 'No question was provided. Type in the calculator text bar and tap Ask AI.'}
        </Text>
      </View>
      <Text style={styles.note}>
        Next step: connect this screen to your AI API and replace this placeholder output.
      </Text>
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back to Calculator</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1C1E',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 26,
    color: '#B5FF39',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#b1b8b9',
    marginBottom: 12,
    textAlign: 'center',
  },
  promptCard: {
    width: '100%',
    backgroundColor: '#23252B',
    borderColor: '#383B41',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  promptText: {
    color: '#E8EAED',
    fontSize: 15,
    lineHeight: 22,
  },
  note: {
    fontSize: 15,
    color: '#6C757D',
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#B5FF39',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  backButtonText: {
    color: '#1A1C1E',
    fontWeight: '700',
    fontSize: 15,
  },
});