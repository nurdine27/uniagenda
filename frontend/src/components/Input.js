import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const Input = ({ label, error, secureTextEntry, icon, ...props }) => {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrap}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputWrap, focused && styles.focused, error && styles.errorBorder]}>
        {icon && <Ionicons name={icon} size={20} color={focused ? colors.primary : colors.gray500} style={styles.icon} />}
        <TextInput
          style={styles.input}
          secureTextEntry={secureTextEntry && !show}
          placeholderTextColor={colors.gray400}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShow(!show)}>
            <Ionicons name={show ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.gray500} />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: colors.gray700, marginBottom: 6 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: 12, borderWidth: 1.5, borderColor: colors.border, paddingHorizontal: 14, paddingVertical: 12 },
  focused: { borderColor: colors.primary },
  errorBorder: { borderColor: colors.danger },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: colors.text },
  error: { fontSize: 12, color: colors.danger, marginTop: 4 },
});

export default Input;
