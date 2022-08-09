import { NavigationContainer } from "@react-navigation/native"
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useState, useEffect, useContext } from 'react';
import { Loading } from '../components/Loading';
import { AppAuth } from "./AppAuth";
import { AppStack } from "./AppStack";

export function Router() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<FirebaseAuthTypes.User>(null);

   // const authContext = useContext();
  
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
          {user ?  <AppAuth /> : <AppStack/>}
        </NavigationContainer>
    )
}
