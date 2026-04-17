// screens/PinEntryScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Vibration,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { useMultiAccount } from '@/context/MultiAccountContext';

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  onSuccess: (accountId: string) => void; // appelé après switch réussi
  onSkip?: () => void;                     // optionnel : ignorer le PIN
  onUsePassword?: () => void;             // aller à l'écran login classique
};

// ─── Constantes ───────────────────────────────────────────────────────────────

const PIN_LENGTH = 4;
const MAX_ATTEMPTS = 5;

const KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', '⌫'],
];

// ─── Composant ────────────────────────────────────────────────────────────────

const PinEntryScreen: React.FC<Props> = ({ onSuccess, onSkip, onUsePassword }) => {
  const { verifyPinAndSwitch, accountsWithPin } = useMultiAccount();

  const [pin, setPin] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [matchedAccount, setMatchedAccount] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const dotsScale = useRef(
    Array.from({ length: PIN_LENGTH }, () => new Animated.Value(1))
  ).current;

  // Animation de saisie d'un chiffre
  const animateDot = (index: number) => {
    Animated.sequence([
      Animated.spring(dotsScale[index], {
        toValue: 1.3,
        useNativeDriver: true,
        speed: 50,
      }),
      Animated.spring(dotsScale[index], {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
      }),
    ]).start();
  };

  // Animation d'erreur (shake)
  const shakeError = () => {
    Vibration.vibrate(300);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  // Appuyer sur une touche
  const handleKey = async (key: string) => {
    if (isVerifying) return;
    if (key === '') return;

    if (key === '⌫') {
      setPin((p) => p.slice(0, -1));
      setErrorMsg('');
      return;
    }

    const newPin = pin + key;
    setPin(newPin);
    animateDot(newPin.length - 1);

    if (newPin.length === PIN_LENGTH) {
      await verifyPin(newPin);
    }
  };

  const verifyPin = async (enteredPin: string) => {
    setIsVerifying(true);
    try {
      const account = await verifyPinAndSwitch(enteredPin);
      if (account) {
        setMatchedAccount(account.id);
        setErrorMsg('');
        // Petit délai visuel avant navigation
        setTimeout(() => onSuccess(account.id), 400);
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        shakeError();
        setErrorMsg(
          newAttempts >= MAX_ATTEMPTS
            ? 'Trop de tentatives. Utilisez votre mot de passe.'
            : `PIN incorrect (${newAttempts}/${MAX_ATTEMPTS})`
        );
        setPin('');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const blocked = attempts >= MAX_ATTEMPTS;

  // Aperçu des avatars des comptes protégés par PIN
  const avatarPreview = accountsWithPin.slice(0, 3);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appName}>Connexion rapide</Text>
          <Text style={styles.subtitle}>Entrez votre PIN pour accéder à votre compte</Text>

          {/* Avatars des comptes disponibles */}
          {avatarPreview.length > 0 && (
            <View style={styles.avatarRow}>
              {avatarPreview.map((acc) => (
                <View
                  key={acc.id}
                  style={[styles.avatarBubble, { backgroundColor: acc.avatarColor }]}
                >
                  <Text style={styles.avatarInitial}>
                    {acc.user.firstname?.charAt(0)?.toUpperCase() ?? '?'}
                  </Text>
                </View>
              ))}
              {accountsWithPin.length > 3 && (
                <View style={[styles.avatarBubble, { backgroundColor: '#334155' }]}>
                  <Text style={styles.avatarInitial}>+{accountsWithPin.length - 3}</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Points PIN */}
        <Animated.View
          style={[styles.dotsRow, { transform: [{ translateX: shakeAnim }] }]}
        >
          {Array.from({ length: PIN_LENGTH }).map((_, i) => {
            const filled = i < pin.length;
            return (
              <Animated.View
                key={i}
                style={[
                  styles.dot,
                  filled && styles.dotFilled,
                  { transform: [{ scale: dotsScale[i] }] },
                  matchedAccount && filled && styles.dotSuccess,
                  errorMsg && styles.dotError,
                ]}
              />
            );
          })}
        </Animated.View>

        {/* Message d'erreur */}
        {errorMsg ? (
          <Text style={styles.errorText}>{errorMsg}</Text>
        ) : (
          <Text style={styles.errorPlaceholder}> </Text>
        )}

        {/* Clavier */}
        <View style={[styles.keyboard, blocked && styles.keyboardBlocked]}>
          {KEYS.map((row, ri) => (
            <View key={ri} style={styles.keyRow}>
              {row.map((key, ki) => (
                <TouchableOpacity
                  key={ki}
                  style={[
                    styles.key,
                    key === '' && styles.keyEmpty,
                    key === '⌫' && styles.keyBackspace,
                    blocked && styles.keyDisabled,
                  ]}
                  onPress={() => handleKey(key)}
                  activeOpacity={0.7}
                  disabled={blocked || key === ''}
                >
                  <Text
                    style={[
                      styles.keyText,
                      key === '⌫' && styles.keyBackspaceText,
                    ]}
                  >
                    {key}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        {/* Liens alternatifs */}
        <View style={styles.footer}>
          {onUsePassword && (
            <TouchableOpacity onPress={onUsePassword} style={styles.footerBtn}>
              <Text style={styles.footerLink}>Utiliser le mot de passe</Text>
            </TouchableOpacity>
          )}
          {onSkip && (
            <TouchableOpacity onPress={onSkip} style={styles.footerBtn}>
              <Text style={[styles.footerLink, styles.footerSkip]}>
                Ignorer
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    gap: 8,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F8FAFC',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 4,
  },
  avatarRow: {
    flexDirection: 'row',
    marginTop: 20,
    gap: -10,
  },
  avatarBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0F172A',
  },
  avatarInitial: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 20,
    marginVertical: 10,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#475569',
    backgroundColor: 'transparent',
  },
  dotFilled: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  dotSuccess: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  dotError: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#F87171',
    fontSize: 13,
    textAlign: 'center',
    minHeight: 18,
  },
  errorPlaceholder: {
    minHeight: 18,
  },
  keyboard: {
    width: '100%',
    gap: 12,
  },
  keyboardBlocked: {
    opacity: 0.4,
  },
  keyRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  key: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  keyEmpty: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  keyBackspace: {
    backgroundColor: '#1E293B',
  },
  keyDisabled: {
    opacity: 0.4,
  },
  keyText: {
    fontSize: 26,
    fontWeight: '500',
    color: '#F1F5F9',
  },
  keyBackspaceText: {
    fontSize: 22,
    color: '#94A3B8',
  },
  footer: {
    flexDirection: 'row',
    gap: 24,
  },
  footerBtn: {
    padding: 8,
  },
  footerLink: {
    color: '#6366F1',
    fontSize: 14,
    fontWeight: '500',
  },
  footerSkip: {
    color: '#64748B',
  },
});

export default PinEntryScreen;