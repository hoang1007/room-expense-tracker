import React from "react";
import { Text, TextStyle } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import LinearGradient from "react-native-linear-gradient";
import { BlurEffectTypes } from "react-native-screens";

export type Props = {
    colors: string[];
    start: [number, number];
    end: [number, number];
    style?: TextStyle;
    children: React.ReactNode;
};

const TextGradient: React.FC<Props> = ({
    colors,
    start = [0, 0],
    end = [0, 1],
    style,
    children
}) => {
    return (
        <MaskedView maskElement={<Text children={children} style={style} />}>
            <LinearGradient
                colors={colors}
                start={{ x: start[0], y: start[1] }}
                end={{ x: end[0], y: end[1] }}
            >
                <Text children={children} style={{ ...style, opacity: 0 }} />
            </LinearGradient>
        </MaskedView>
    );
};

export default TextGradient;