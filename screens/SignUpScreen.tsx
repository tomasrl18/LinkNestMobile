import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { supabase } from '../utils/supabase';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

/**
 * Registration screen component.
 *
 * Allows a new user to register with an email and password.  After
 * successfully creating an account Supabase may require email verification,
 * so the user is informed accordingly.
 */
export default function SignUpScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      Alert.alert('Error', error.message);
      return;
    }
    // Insert a profile row for the new user.  This matches the web implementation
    // where the profile is created on sign up.  The user ID is returned on
    // successful sign up.  Note: table names must match your Supabase schema.
    if (data?.user?.id) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({ id: data.user.id, email });
      if (profileError) {
        Alert.alert('Error al crear perfil', profileError.message);
      }
    }
    Alert.alert(
      'Cuenta creada',
      'Hemos enviado un correo de verificación. Por favor revisa tu bandeja de entrada.'
    );
    navigation.navigate('Login');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20, fontWeight: 'bold' }}>Crear cuenta</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 8 }}
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 20, padding: 8, borderRadius: 8 }}
      />
      <Button title="Registrar" onPress={handleSignUp} />
      <View style={{ height: 12 }} />
      <Button title="Volver" onPress={() => navigation.goBack()} />
    </View>
  );
}