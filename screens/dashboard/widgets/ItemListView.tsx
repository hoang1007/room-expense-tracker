import { StyleSheet, Text, View } from "react-native";
import { LinearContainer, TextGradient } from "../../../components";
import { COLORS, FONTS, SIZES } from "../../../constants";
import { bottomBarHeight } from "../../../navigation/BottomBar";
import { Item } from "../../../objects";
import { rootStyles } from "../styles";


export type ItemListViewProps = {
    items: Item[]
}

const ItemListView: React.FC<ItemListViewProps> = ({ items }) => {
    const renderItemViewWidget = (item: Item, key: number) => {
        return (
            <View key={key}>
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: 20
                }}>
                    <View style={{ maxWidth: "66%" }}>
                        <Text style={{ ...FONTS.h3, color: COLORS.white }}>{item.name}</Text>
                        <Text style={{ ...FONTS.body4, color: COLORS.white, opacity: 0.6 }}>
                            {item.buyDate.toLocaleDateString("en-US", {
                                weekday: "long", month: "short", day: "numeric", hour: "numeric",
                                hour12: true
                            })}
                        </Text>
                    </View>
                    <View>
                        <Text style={{ ...FONTS.h4, color: COLORS.lightBlue }} children={item.price.toString()} />
                    </View>
                </View>
                <View style={{
                    height: 1,
                    backgroundColor: COLORS.white,
                    opacity: 0.3,
                    marginTop: 10
                }} />
            </View>
        );
    }

    return (
        <LinearContainer
            start={[0, 0]}
            end={[0.5, 0.5]}
            colors={[COLORS.lightGray, COLORS.darkGray]}
            style={recentItemsWidgetStyles.container}
        >
            <View
                style={recentItemsWidgetStyles.indicator}
            />
            <View style={{
                width: "80%",
                marginTop: 55,
            }}>
                <TextGradient
                    colors={[COLORS.lightBlue, COLORS.darkBlue]}
                    start={[0, 0]}
                    end={[1, 0]}
                    style={FONTS.h2}>
                    Recents
                </TextGradient>
                {items.map((item, index) => renderItemViewWidget(item, index))}
            </View>
        </LinearContainer >
    );
};



export default ItemListView;

const recentItemsWidgetStyles = StyleSheet.create({
    container: {
        ...rootStyles.container,
        minHeight: SIZES.WINDOW_HEIGHT * 0.8,
        alignItems: "center",
        alignSelf: "center",
        marginTop: SIZES.margin,
        paddingBottom: 100
    },
    indicator: {
        position: "absolute",
        top: 8,
        height: 6,
        width: "30%",
        borderRadius: rootStyles.container.borderRadius,
        backgroundColor: COLORS.white,
        opacity: 0.5
    }
});