import { TouchableOpacity } from "react-native";
import React from "react";
import { googleLogin } from "../services/UserProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { COLORS } from "../constants";
import { colorWithOpacity } from "../utils";

class LoginScreen extends React.Component {
    render() {
        return (
            <SafeAreaView style={{
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: COLORS.black,
                flex: 1
            }}>
                <TouchableOpacity
                    style={{
                        borderWidth: 10,
                        borderRadius: 100,
                        borderColor: colorWithOpacity(COLORS.white, 0.6),
                        height: 100,
                        width: 100,
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                    onPress={() => googleLogin().catch((error) => { console.log(error) })} >
                    <Icon name="logo-google" size={50} color={COLORS.white} />
                </TouchableOpacity>
            </SafeAreaView>
        );
    }
}

export default LoginScreen;