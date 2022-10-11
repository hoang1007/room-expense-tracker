import { OpaqueColorValue, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearContainer } from "../../../components";
import { COLORS, FONTS, SIZES } from "../../../constants";
import Icon from "react-native-vector-icons/Ionicons";
import { colorWithOpacity, currencyFormatter } from "../../../utils";


export type SummaryWidgetProps = {
    expense: number,
    total: number,
    diff: number,
    paid: boolean,
    setPaid: (paid: boolean) => void
}

const SummaryWidget: React.FC<SummaryWidgetProps> = ({
    expense, total, diff, paid, setPaid
}) => {
    const renderComponent = (title: string, value: string, icon?: { name: string, color: string | OpaqueColorValue }) => (
        <LinearContainer
            colors={[COLORS.lightGray, COLORS.darkGray]}
            start={[0, 0]}
            end={[1, 1]}
            style={summaryStyles.childContainer}
        >
            {icon ? <Icon name={icon.name} color={icon.color.toString()} size={30} /> : null}
            <View>
                <Text style={{ ...FONTS.h3, color: COLORS.white }}>{title}</Text>
                <Text style={{ ...FONTS.body3, color: colorWithOpacity(COLORS.white, 0.6) }}>{value}</Text>
            </View>
        </LinearContainer>
    );

    return (
        <View style={summaryStyles.container}>
            <View
                key={"row-1"}
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                {renderComponent("Expense", currencyFormatter(expense), { name: "trending-down-outline", color: COLORS.red })}
                {renderComponent("Total", currencyFormatter(total), { name: "people-outline", color: colorWithOpacity(COLORS.lightBlue, 0.9).toString() })}
            </View>
            <View
                key={"row-2"}
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                {renderComponent("Difference", currencyFormatter(diff), { name: "swap-vertical-outline", color: colorWithOpacity(COLORS.lightBlue, 0.9) })}
                <TouchableOpacity
                    onPress={() => setPaid(!paid)}
                    children={renderComponent("Status", paid ? "Paid" : "Unpaid", paid ? { name: "thumbs-up-outline", color: COLORS.green } : { name: "thumbs-down-outline", color: COLORS.red })} />
            </View>
        </View>
    );
}

export default SummaryWidget;

const summaryStyles = StyleSheet.create({
    container: {
        margin: SIZES.margin,
        marginBottom: 0
    },
    childContainer: {
        flexDirection: "row",
        width: SIZES.WINDOW_WIDTH * 0.44,
        height: 80,
        paddingHorizontal: SIZES.padding,
        marginBottom: SIZES.margin,
        alignItems: "center",
        justifyContent: "space-around",
        borderWidth: 0,
        borderRadius: 15
    }
});