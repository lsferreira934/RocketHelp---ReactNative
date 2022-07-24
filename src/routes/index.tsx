import { NavigationContainer } from '@react-navigation/native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { Signin } from '../screens/Signin';
import { AppRoutes } from './app.routes';
import { useState, useEffect } from 'react';
import { Loading } from '../components/Loading';

export function Routes() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User>(null);

  useEffect(() => {
    const subscribe = auth().onAuthStateChanged(response => {
      setUser(response);
      setLoading(false);
    });
    return subscribe
  }, [])

  if (loading) return <Loading />

  return (
    <NavigationContainer>
      {user ? <AppRoutes /> : <Signin />}
    </NavigationContainer>
  );
}