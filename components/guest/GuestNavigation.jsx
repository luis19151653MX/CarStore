
import { createStackNavigator } from '@react-navigation/stack';
import Login from "./Login";
import RegisterUser from "./RegisterUser";

export default function Navigation() {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator initialRouteName="Login" >
            <Stack.Screen name="Login" component={Login}
                options={{
                    headerShown: false,
                }} />
            <Stack.Screen name="RegisterUser" component={RegisterUser}
                options={{
                    title: ""
                }} />
        </Stack.Navigator >
    );
}