import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Modal,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../navigation/types';

const logoSource = require('../../assets/StudyCalc AI logo app.png');

type Props = NativeStackScreenProps<RootStackParamList, 'Calculator'>;

// Micheal 
const lime = '#B5FF39';
const darkGrey = '#212325';
const mediumGrey = '#35373a';
const lightGrey = '#e8eae8';

const LOGO_SIZE = 38;

const buttons = [
  ['C', '±', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '−'],
  ['1', '2', '3', '+'],
  ['0', '.', '='],
];

function operate(a: string, b: string, op: string): string {
  // Show max 12 digits, proper formatting for floating point results.
  const x = parseFloat(a);
  const y = parseFloat(b);
  let result: number | string;
  switch (op) {
    case '+':
      result = x + y;
      break;
    case '−':
      result = x - y;
      break;
    case '×':
      result = x * y;
      break;
    case '÷':
      if (y === 0) return 'Error';
      result = x / y;
      break;
    default:
      return b;
  }
  if (typeof result === 'number') {
    if (!isFinite(result)) return 'Error';
    let s: string;
    // If the result is too small, too big, or too many digits, use scientific notation
    if (
      (Math.abs(result) !== 0 && (Math.abs(result) < 1e-6 || Math.abs(result) >= 1e12)) ||
      result.toString().replace(/[-.]/g, '').length > 12
    ) {
      // Use exponential, remove trailing zeros in mantissa
      s = result.toExponential(6).replace(/(\.\d+?)0+e/, '$1e').replace(/\.0+e/, 'e');
    } else {
      // Round to at most 10 decimal places, remove trailing zeros/decimal
      s = parseFloat(result.toFixed(10)).toString();
    }
    if (s.length > 14) s = s.slice(0, 14); // Emergency crop for display
    return s;
  }
  return result;
}
//Micheal
export default function CalculatorScreen({ navigation }: Props) {
  const [display, setDisplay] = useState('0');
  const [operator, setOperator] = useState<string | null>(null);
  const [first, setFirst] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [calculations, setCalculations] = useState<{ expression: string, result: string }[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  // Only save if result is finite number (don't save 'Error', 'NaN', blank, etc.)
  const saveCalculation = (expression: string, result: string) => {
    if (
      result !== 'Error'
      && result !== ''
      && result !== undefined
      && result !== null
      && !/nan|NaN/i.test(result)
      && result !== '-Infinity'
      && result !== 'Infinity'
    ) {
      setCalculations((prev) => [
        { expression, result },
        ...prev.slice(0, 49)
      ]);
    }
  };

  const handlePress = (symbol: string) => {
    if (/^\d$/.test(symbol)) { // Digit pressed
      // Replace error, -Infinity, or waiting with digit, else append if under limit
      if (
        display === 'Error'
        || display === 'NaN'
        || display === '-Infinity'
        || display === 'Infinity'
        || waitingForOperand
      ) {
        setDisplay(symbol);
        setWaitingForOperand(false);
      } else if (display.replace(/[^0-9]/g, '').length < 12) {
        setDisplay(display === '0' ? symbol : display + symbol);
      }
    } else if (symbol === '.') {
      if (
        display === 'Error'
        || display === 'NaN'
        || display === '-Infinity'
        || display === 'Infinity'
        || waitingForOperand
      ) {
        setDisplay('0.');
        setWaitingForOperand(false);
      } else if (!display.includes('.')) {
        setDisplay(display + '.');
      }
    } else if (['+', '−', '×', '÷'].includes(symbol)) {
      if (
        display === 'Error'
        || display === 'NaN'
        || display === '-Infinity'
        || display === 'Infinity'
      ) {
        setFirst(null);
        setOperator(symbol);
        setDisplay('0');
        setWaitingForOperand(true);
        return;
      }
      if (operator && !waitingForOperand && first !== null) {
        const result = operate(first, display, operator);
        saveCalculation(`${first} ${operator} ${display}`, result);
        setDisplay(result);
        setFirst(result === 'Error' ? null : result);
      } else {
        setFirst(display);
      }
      setOperator(symbol);
      setWaitingForOperand(true);
    } else if (symbol === '=') {
      if (
        operator
        && first
        && display !== 'Error'
        && display !== 'NaN'
        && display !== '-Infinity'
        && display !== 'Infinity'
      ) {
        const result = operate(first, display, operator);
        saveCalculation(`${first} ${operator} ${display}`, result);
        setDisplay(result);
        setFirst(null);
        setOperator(null);
        setWaitingForOperand(true);
      }
    } else if (symbol === 'C') {
      setDisplay('0');
      setOperator(null);
      setFirst(null);
      setWaitingForOperand(false);
    } else if (symbol === '±') {
      if (
        display !== '0'
        && display !== 'Error'
        && display !== 'NaN'
        && display !== '-Infinity'
        && display !== 'Infinity'
      ) {
        setDisplay(display.startsWith('-') ? display.slice(1) : '-' + display);
      }
    } else if (symbol === '%') {
      if (
        display !== 'Error'
        && display !== 'NaN'
        && display !== '-Infinity'
        && display !== 'Infinity'
        && !isNaN(Number(display))
      ) {
        let percentValue = parseFloat((parseFloat(display) / 100).toFixed(10)).toString();
        saveCalculation(`${display}%`, percentValue);
        setDisplay(percentValue);
      }
    }
  };

  const handleLogout = () => {
    setMenuVisible(false);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }]
    });
  };

  /** New: handleAskAI triggers dialog and navigation **/
  const handleAskAI = () => {
    setMenuVisible(false);
    // You could use a React Native prompt library here for an actual input dialog,
    // but for simplicity, we use an Alert as an example. In production, a custom modal is suggested.
    Alert.prompt(
      'Ask StudyCalc AI',
      'What would you like to ask?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Ask',
          onPress: (promptInput?: string) => {
            if (promptInput && promptInput.trim().length > 0) {
              navigation.navigate('AITutor', { prompt: promptInput.trim() });
            }
          }
        }
      ],
      'plain-text'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Hamburger Menu Modal */}
      <Modal
        visible={menuVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuModal} pointerEvents="box-none">
            <Pressable
              style={({ pressed }) => [styles.menuItem, pressed && styles.buttonPressed]}
              onPress={() => {
                setMenuVisible(false);
                setShowHistory(true);
              }}
            >
              <Text style={styles.menuItemText}>My Calculations</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.menuItem, pressed && styles.buttonPressed]}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('UserSaveInfo', {
                  calculations,
                  latestDisplay: display,
                });
              }}
            >
              <Text style={styles.menuItemText}>Save User Info</Text>
            </Pressable>
            {/* New: Ask StudyCalc AI */}
            <Pressable
              style={({ pressed }) => [styles.menuItem, pressed && styles.buttonPressed]}
              onPress={handleAskAI}
            >
              <Text style={styles.menuItemText}>Ask StudyCalc AI</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.menuItem, pressed && styles.buttonPressed]}
              onPress={handleLogout}
            >
              <Text style={[styles.menuItemText, { color: '#FF6262' }]}>Log Out</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.menuClose, pressed && styles.buttonPressed]}
              onPress={() => setMenuVisible(false)}
            >
              <Text style={styles.menuCloseText}>Close Menu</Text>
            </Pressable>
          </View>
        </TouchableOpacity>
      </Modal>
      {/* End Hamburger Menu Modal */}

      {/* My Calculations Modal */}
      <Modal
        visible={showHistory}
        animationType="slide"
        transparent
        onRequestClose={() => setShowHistory(false)}
      >
        <View style={styles.historyModalOverlay}>
          <View style={styles.historyModal}>
            <Text style={styles.historyTitle}>My Calculations</Text>
            <ScrollView
              style={styles.historyScroll}
              contentContainerStyle={styles.historyList}
            >
              {calculations.length === 0 ? (
                <Text style={styles.historyEmpty}>No calculations yet.</Text>
              ) : (
                calculations.map((calc, idx) => (
                  <View key={idx} style={styles.historyItem}>
                    <Text style={styles.historyExpr}>{calc.expression}</Text>
                    <Text style={styles.historyResult}>= {calc.result}</Text>
                  </View>
                ))
              )}
            </ScrollView>
            <Pressable
              style={({ pressed }) => [
                styles.closeHistoryButton,
                pressed && styles.buttonPressed
              ]}
              onPress={() => setShowHistory(false)}
            >
              <Text style={styles.closeHistoryText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {/* End modals */}

      {/* Top bar with hamburger and StudyCalc AI logo/title on right */}
      <View style={styles.topBar}>
        <Pressable
          onPress={() => setMenuVisible(true)}
          style={({ pressed }) => [
            styles.hamburgerButton,
            pressed && styles.buttonPressed
          ]}
        >
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
        </Pressable>
        <View style={{ flex: 1 }} />
        <View style={styles.aiLabelLogoContainer}>
          <Text style={styles.aiLabelText}>StudyCalc AI</Text>
          <Image
            source={logoSource}
            style={styles.aiLogo}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={styles.calculatorBox}>
        <View style={styles.displayContainer}>
          <Text style={styles.displayText} numberOfLines={1} adjustsFontSizeToFit>
            {display}
          </Text>
        </View>
        <View style={styles.buttonRows}>
          {buttons.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((symbol) => (
                <Pressable
                  key={symbol}
                  style={({ pressed }) => [
                    styles.button,
                    symbol === '=' && styles.equalsButton,
                    symbol === '0' && styles.zeroButton,
                    ['÷', '×', '−', '+', '='].includes(symbol) && styles.operatorButton,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={() => handlePress(symbol)}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      (['÷', '×', '−', '+', '='].includes(symbol) && styles.operatorButtonText) ||
                        (symbol === 'C' && styles.clearButtonText)
                    ]}
                  >
                    {symbol}
                  </Text>
                </Pressable>
              ))}
            </View>
          ))}
        </View>
      </View>
      {/* Removed bottom Ask AI bar -- now in menu only */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkGrey,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 0,
  },
  topBar: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    backgroundColor: darkGrey,
    paddingTop: 28,
    paddingBottom: 20,
    paddingHorizontal: 10,
    justifyContent: 'flex-start',
  },
  hamburgerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
    backgroundColor: mediumGrey,
    borderRadius: 22,
    borderWidth: 1.2,
    borderColor: '#202223',
  },
  hamburgerLine: {
    width: 22,
    height: 3,
    backgroundColor: lightGrey,
    marginVertical: 2,
    borderRadius: 2,
  },
  aiLabelLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // gap is not fully supported on all mobile devices. Fix:
    // gap: 7,
    marginRight: 5,
  },
  aiLabelText: {
    color: lime,
    fontWeight: '800',
    fontSize: 18,
    marginRight: 7,
  },
  aiLogo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
  calculatorBox: {
    width: '97%',
    maxWidth: 350,
    borderRadius: 20,
    backgroundColor: mediumGrey,
    padding: 18,
    alignItems: 'center',
    shadowColor: 'transparent',
    elevation: 0,
    borderWidth: 0,
    marginBottom: 18,
  },
  displayContainer: {
    width: '100%',
    minHeight: 60,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: '#25282a',
    borderRadius: 15,
    marginBottom: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderWidth: 0,
  },
  displayText: {
    fontSize: 38,
    color: '#ececec',
    fontWeight: '700',
    letterSpacing: 1,
  },
  buttonRows: {
    width: '100%',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#28292a',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    paddingVertical: 20,
    borderRadius: 13,
    borderWidth: 0,
  },
  buttonPressed: {
    opacity: 0.68,
  },
  buttonText: {
    color: '#ececec',
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: 1,
  },
  operatorButton: {
    backgroundColor: '#35373a',
  },
  operatorButtonText: {
    color: lime,
    fontWeight: '700',
  },
  equalsButton: {
    backgroundColor: '#303330',
    flex: 1,
  },
  clearButtonText: {
    color: '#92A894',
    fontWeight: '700',
  },
  zeroButton: {
    flex: 2,
    alignItems: 'flex-start',
    paddingLeft: 26,
  },
  aiBottomBarWrapper: {
    // Hidden, as Ask AI now in the menu
    display: 'none',
  },
  textBarBottom: {
    display: 'none',
  },
  aiButtonBottom: {
    display: 'none',
  },
  aiButtonTextBottom: {
    display: 'none',
  },
  textBarWrapper: {
    display: 'none',
  },
  textBar: {
    display: 'none',
  },
  aiButton: {
    display: 'none',
  },
  aiButtonText: {
    display: 'none',
  },
  bottomButtonsContainer: {
    display: 'none',
  },
  backButton: {
    display: 'none',
  },
  backButtonText: {
    display: 'none',
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(34,36,37,0.55)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  menuModal: {
    marginTop: 45,
    marginLeft: 15,
    width: 220,
    backgroundColor: mediumGrey,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 8,
    alignItems: 'stretch',
    borderWidth: 1.5,
    borderColor: '#222325',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.09,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  menuItem: {
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#292a2b',
  },
  menuItemText: {
    color: lime,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
    textAlign: 'left',
  },
  menuClose: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuCloseText: {
    color: '#bbbbbb',
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0.6,
  },
  historyModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(34,36,37,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyModal: {
    width: '92%',
    maxHeight: '75%',
    backgroundColor: mediumGrey,
    borderRadius: 17,
    padding: 24,
    alignItems: 'center',
  },
  historyTitle: {
    fontSize: 22,
    color: lime,
    fontWeight: '700',
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  historyScroll: {
    width: '100%',
  },
  historyList: {
    paddingBottom: 10,
  },
  historyEmpty: {
    color: '#b1b8b9',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 18,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#313335',
  },
  historyExpr: {
    color: '#ececec',
    fontSize: 17,
    flex: 1,
    fontWeight: '500',
  },
  historyResult: {
    color: lime,
    fontSize: 17,
    fontWeight: '700',
    marginLeft: 12,
  },
  closeHistoryButton: {
    marginTop: 18,
    backgroundColor: darkGrey,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: '#292929',
    alignSelf: 'center',
  },
  closeHistoryText: {
    color: lime,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
});