import { StyleSheet, Text, View } from "react-native";
import { LinearContainer } from "../../../components";
import { COLORS, FONTS, SIZES } from "../../../constants";
import { DateTime, Item } from "../../../objects";
import Icon from "react-native-vector-icons/Ionicons";
import { groupByDate } from "../../../utils/query";
import { getBottomUserBarHeight } from "./UserBottomBar";


export type ItemListViewProps = {
    items: Item[]
}


const ItemListView: React.FC<ItemListViewProps> = ({ items }) => {
    const renderItem = (item: Item, index: number) => {
        return (
            <View key={index} style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 10,
                paddingHorizontal: SIZES.padding / 2,
                width: "100%"
            }}>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    maxWidth: "55%"
                }}>
                    <Icon name="cart-outline" size={30} color={COLORS.lightBlue} style={{ paddingRight: SIZES.padding }} />
                    <View>
                        <Text style={{ ...FONTS.h3, color: COLORS.white }}>{item.name}</Text>
                        <Text style={{ ...FONTS.body4, color: COLORS.white, opacity: 0.6 }}>
                            {item.buyDate.toLocaleString("en-US", {
                                hour: "numeric", hour12: true
                            })}
                        </Text>
                    </View>
                </View>
                <View style={{
                    alignItems: "flex-end"
                }}>
                    <Text style={{ ...FONTS.body3, color: COLORS.lightBlue }} children={item.price.toString()} />
                </View>
            </View>
        );
    }

    const renderItemGroup = (groupName: string, itemGroup: Item[]) => {
        return (
            <View key={groupName} style={{
                alignItems: "center",
                marginVertical: SIZES.margin / 2
            }}>
                <Text style={{ ...FONTS.h3, color: COLORS.white, opacity: 0.7 }}>{groupName}</Text>
                {itemGroup.map((value, index) => renderItem(value, index))}
            </View>
        );
    };

    return (
        <LinearContainer
            colors={[COLORS.lightGray, COLORS.darkGray]}
            start={[0, 0]}
            end={[0.5, 0.5]}
            style={boughtItemsStyles.container}
        >
            {Object.entries(groupByDate(items, (date) => date.toLocaleString(
                "en-US", { month: "short", year: "numeric", day: "numeric" }
            ))).map((item) => renderItemGroup(item[0], item[1]))}
        </LinearContainer>
    );
};


export default ItemListView;

const boughtItemsStyles = StyleSheet.create({
    container: {
        flex: 1,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderBottomWidth: 0,
        minHeight: SIZES.WINDOW_HEIGHT * 0.8,
        padding: SIZES.padding,
        paddingBottom: getBottomUserBarHeight()
    }
});