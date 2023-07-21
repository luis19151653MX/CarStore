
import { createStackNavigator } from '@react-navigation/stack';
import Login from "./Login";
import RegisterUser from "./RegisterUser";
import Chat from "./Chat";

export default function Navigation() {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator initialRouteName="Chat" >
            <Stack.Screen name="Login" component={Login}
                options={{
                    headerShown: false,
                }} />
            <Stack.Screen name="RegisterUser" component={RegisterUser}
                options={{
                    title: ""
                }} />
                <Stack.Screen name="Chat" component={Chat}
                options={{
                    title: ""
                }} />
        </Stack.Navigator >
    );
}