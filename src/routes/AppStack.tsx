import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Account } from "../screens/Account";
import { Signin } from "../screens/Signin";

const { Navigator, Screen } = createNativeStackNavigator();


export function AppStack() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="singin" component={Signin} />
      <Screen name="account" component={Account} />
    </Navigator>
  );
}