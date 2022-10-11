import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearContainer, PercentageIndicator } from "../../../components";
import { COLORS, FONTS, SIZES } from "../../../constants";
import { currencyFormatter } from "../../../utils";
import { rootStyles } from "../styles";
import { getTopBarHeight } from "./TopBar";


export type SummaryProps = {
    total: number,
    outcome: number,
    diff: number
}

const SummaryWidget: React.FC<SummaryProps> = ({
    total, outcome, diff
}) => {
    let percentage = 0;
    if (total != 0) {
        percentage = Math.round(outcome * 100 / total);
    }

    return (
        <LinearContainer
            start={[0, 0]}
            end={[0.5, 0.5]}
            colors={[COLORS.lightGray, COLORS.darkGray]}
            style={summaryWidgetStyles.container}
        >
            <PercentageIndicator percentage={percentage} radius={55} strokeWidth={20} color={COLORS.darkBlue} textColor={COLORS.white} textStyle={FONTS.body2} />
            <View style={summaryWidgetStyles.expenseContainer}>
                <View style={{ justifyContent: "space-around" }}>
                    <Text style={{ ...FONTS.h3, color: COLORS.white }}>Total:</Text>
                    <Text style={{ ...FONTS.h3, color: COLORS.white }}>My outcome:</Text>
                    <Text style={{ ...FONTS.h3, color: COLORS.white }}>Difference:</Text>
                </View>
                <View style={{ justifyContent: "space-around", alignItems: "flex-end" }}>
                    <Text style={{ ...FONTS.body3, color: COLORS.white, opacity: 0.6 }}>{currencyFormatter(total)}</Text>
                    <Text style={{ ...FONTS.body3, color: COLORS.white, opacity: 0.6 }}>{currencyFormatter(outcome)}</Text>
                    <Text style={{ ...FONTS.h3, color: COLORS.lightBlue }}>{currencyFormatter(diff)}</Text>
                </View>
            </View>
        </LinearContainer>
    );
};

export default SummaryWidget;

const summaryWidgetStyles = StyleSheet.create({
    container: {
        ...rootStyles.container,
        height: SIZES.WINDOW_HEIGHT * 0.2,
        flexDirection: "row",
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "space-around"
    },
    expenseContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        height: SIZES.WINDOW_HEIGHT * 0.15,
        width: SIZES.WINDOW_WIDTH * 0.5
    }
});