import React from "react";
import { BackHandler, NativeEventSubscription, SafeAreaView, ScrollView, StatusBar, ViewStyle } from "react-native";
import { COLORS, SIZES } from "../../constants";
import AddItemsModal from "./widgets/AddItemsModal";
import ItemListView from "./widgets/ItemListView";
import SummaryWidget from "./widgets/Summary";
import TopBar from "./widgets/TopBar";
import { UserContext } from "../../services/UserProvider";
import { DateTime } from "../../objects";
import { PAGES } from "..";

export interface DashboardProps {
    navigate: (page: PAGES) => void,
    isFocused: boolean
};

interface DashboardState {
    modalVisible: boolean,
    loading: boolean
}

class DashboardScreen extends React.Component<DashboardProps, DashboardState> {
    static contextType = UserContext;
    declare context: React.ContextType<typeof UserContext>;

    backHanlderSubscriber: NativeEventSubscription | undefined;
    modalRef: React.RefObject<AddItemsModal>;

    constructor(props: DashboardProps) {
        super(props);

        this.modalRef = React.createRef<AddItemsModal>();

        this.state = {
            modalVisible: false,
            loading: false
        }
    }

    componentDidMount(): void {
        this.backHanlderSubscriber = BackHandler.addEventListener("hardwareBackPress", () => {
            if (this.props.isFocused) {
                if (this.state.modalVisible) {
                    this.setModalVisible(false);

                    const addedItems = this.modalRef.current?.items!;

                    if (addedItems.length > 0) {
                        this.context!.addItems(addedItems).then(() => this.modalRef.current?.clearItems());
                    }
                } else {
                    BackHandler.exitApp();
                }

                return true;
            } else {
                return false;
            }
        })
    }

    componentWillUnmount(): void {
        this.backHanlderSubscriber!.remove();
    }

    setModalVisible(visible: boolean) {
        this.setState({ modalVisible: visible })
    }

    getSummaryInfo() {
        let total = 0;
        let selfOutcome = 0;
        let diff = 0;

        this.context!.users.forEach((user) => {
            let userOutcome = 0;

            user.getItemsInMonth(DateTime.Month.now).forEach((item) => {
                userOutcome += item.price.value;
            });


            total += userOutcome;

            if (user.uid === this.context?.selfUser?.uid) {
                selfOutcome += userOutcome;
            }
        });

        if (this.context!.users.length != 0) {
            diff = Math.round(selfOutcome - total / this.context!.users.length);
        }

        return { total: total, outcome: selfOutcome, diff: diff };
    }

    getUserItems() {
        const MAX_ITEMS_REVIEW = 10;

        for (let user of this.context!.users) {
            if (user.uid === this.context!.authInfo?.uid) {
                let items = user.getItemsInMonth(DateTime.Month.now);

                if (items.length > MAX_ITEMS_REVIEW) {
                    items = items.slice(0, MAX_ITEMS_REVIEW);
                }

                return items;
            }
        }

        return [];
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar barStyle={"light-content"} backgroundColor={COLORS.black} />
                <TopBar username={this.context!.selfUser?.name ?? "Unknown"} avatar={{ uri: this.context!.authInfo?.photoURL ?? "" }} />
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ marginTop: SIZES.padding }}>
                    <SummaryWidget {...this.getSummaryInfo()} />
                    <ItemListView items={this.getUserItems()} />
                </ScrollView>
                <AddItemsModal
                    ref={this.modalRef}
                    visible={this.state.modalVisible}
                    style={{ position: "absolute", bottom: 0 }}
                />
            </SafeAreaView>
        );
    }
};

export default DashboardScreen;