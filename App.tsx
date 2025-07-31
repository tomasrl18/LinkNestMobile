import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { supabase } from './utils/supabase';

// Import screens
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import AddLinkScreen from './screens/AddLinkScreen';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  SignUp: undefined;
  AddLink: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Root component for the mobile application.
 *
 * The app sets up Supabase authentication and a simple navigation tree.  If
 * there is a valid session the home screen is shown; otherwise the user is
 * prompted to log in or register.  Once authenticated the user can navigate
 * between the home screen and a form to add new links.
 */
export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch the current session on mount
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {session ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Tus enlaces' }} />
            <Stack.Screen name="AddLink" component={AddLinkScreen} options={{ title: 'Añadir enlace' }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Iniciar sesión' }} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Registrarse' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}