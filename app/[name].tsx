import { router, useLocalSearchParams } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function ProductScreen() {
    const { name } = useLocalSearchParams<{ name: string }>();

    return (
        <View style={styles.view}>
            <Text style={styles.mainHeader}>PRODUCT</Text>
            <Text style={styles.secondaryHeader}>{name}</Text>
            <Button title="Back" onPress={() => { router.back(); }} />
        </View>
    );
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainHeader: {
        fontSize: 40,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: 'white',
    },
    secondaryHeader: {
        fontSize: 36,
        color: 'white',
    },
});