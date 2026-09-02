import { StyleSheet, Text, View } from 'react-native';

export default function PageScreen() {
    return (
        <>
            <View style={[styles.container, styles.contBlue]}>
                <Text style={styles.titles}>Hello world!</Text>
            </View>
            <View style={[styles.container, styles.contYellow]}>
                <Text style={styles.titles}>Hello world!</Text>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contBlue: {
        backgroundColor: 'blue',
    },
    contYellow: {
        backgroundColor: 'yellow',
    },
    titles: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
});