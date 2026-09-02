import { StyleSheet, Text, View } from 'react-native';

export default function PageScreen() {
    return (
        <>
            <View style={styles.container}>
                <Text style={styles.mainTitle}>Mathematical formulas</Text>
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Linear Equations</Text>
                    <Text style={styles.paragraph}>
                        A linear equation is any equation that can be written in the form
                    </Text>
                    <View style={styles.formulaContainer}>
                        <Text>ax + b = 0</Text>
                    </View>
                    <Text style={styles.paragraph}>Where <Text style={styles.italicBoldRed}>a</Text> and <Text style={styles.italicBoldRed}>b</Text> are real numbers, and <Text style={styles.italicBoldRed}>x</Text> is the variable.This form is
                        sometimes called the standard form of a linear equation. Note that
                        most linear equations will not start off in this form. Also, the
                        variable may or may not be an <Text style={styles.italicBoldRed}>x</Text> so 
                        don’t get too locked into always seeing an <Text style={styles.italicBoldRed}>x</Text> there.
                    </Text>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#F9F9F9',
        padding: 20,
        paddingTop: 60,
    },
    mainTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        color: '#000',
    },
    card: {
        backgroundColor: '#FAF9F6',
        borderRadius: 8,
        padding: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 15,
    },
    paragraph: {
        fontSize: 15,
        lineHeight: 22,
        color: '#333',
        textAlign: 'justify',
    },
    formulaContainer: {
        backgroundColor: '#FFB6B6',
        alignSelf: 'center',
        paddingVertical: 8,
        paddingHorizontal: 25,
        borderRadius: 4,
        marginVertical: 15,
        maxHeight: 40,
        justifyContent: 'center',
    },
    italicBoldRed: {
        fontStyle: 'italic',
        fontWeight: 'bold',
        color: '#D32F2F',
    },
});
