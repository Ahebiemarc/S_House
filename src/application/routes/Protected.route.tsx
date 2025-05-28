import { useAuth } from '../providers/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { NavigationProp, useNavigation, useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { RootStackParamList } from '../../domain/types/route.types';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  

  useFocusEffect(
    useCallback(() => {
      if (user === null) {
        console.log('User is not logged in. Redirecting to Login...');
        navigation.navigate('Login')
      }
    }, [user, navigation])
  );

  if (user === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (user === null) {
    // Important : return rien si pas connecté
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
