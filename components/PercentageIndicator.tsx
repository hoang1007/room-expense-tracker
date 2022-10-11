import { Text, View, StyleSheet, TextStyle, ViewStyle, ColorValue } from "react-native";
import SVG, { G, Circle } from "react-native-svg";
import { FONTS } from "../constants";


type Props = {
    percentage: number;
    radius: number;
    stroke?: number;
    strokeWidth?: number;
    color?: ColorValue;
    textColor?: string;
    textStyle?: TextStyle;
    style?: ViewStyle;
};


const PercentageIndicator: React.FC<Props> = ({
    percentage = 75,
    radius = 10,
    stroke = 10,
    strokeWidth = 1,
    color = "red",
    textColor = "white",
    textStyle = FONTS.h2,
    style
}) => {
    const styles = StyleSheet.create({
        text: {
            fontWeight: '800',
            textAlign: 'center',
            color: textColor
        },

        container: {
            width: radius * 2,
            height: radius * 2,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column"
        }
    });

    const halfCircle = radius + stroke;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - percentage / 100);

    return (
        <View style={[styles.container, { ...style }]}>
            <SVG width={radius * 2} height={radius * 2} viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}>
                <G rotation={-90} origin={[halfCircle, halfCircle]}>
                    <Circle cx="50%"
                        cy="50%"
                        r={radius}
                        fill="transparent"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDashoffset={strokeDashoffset}
                        strokeDasharray={circumference} />

                    <Circle cx="50%"
                        cy="50%"
                        r={radius}
                        fill="transparent"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeLinejoin="round"
                        strokeOpacity={0.2} />
                </G>
            </SVG>
            <View style={{
                position: "absolute",
            }}><Text style={[styles.text, textStyle]}>{percentage}%</Text></View>
        </View>
    );
}

export default PercentageIndicator;