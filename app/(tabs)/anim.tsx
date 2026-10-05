import { useEffect, useRef, useState } from 'react';
import { Animated, Button, StyleSheet, Text, View } from 'react-native';

export default function AnimScreen() {
    const blockAnim = useRef(new Animated.Value(0)).current;
    const titleAnim = useRef(new Animated.Value(0)).current;
    const [blockVisible, setBlockVisible] = useState(false);
    const blockTranslateYAnim = blockAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 200]
    })
    const blockTranslateXAnim = blockAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 200, 0]
    })
    const blockColorAnim = blockAnim.interpolate({
        inputRange: [0, 0.25, 0.5, 0.75, 1],
        outputRange: ['#f54242', '#f58a42', '#4e42f5', '#4ef542', '#42f5f5']
    })
    const titleTranslateYAnim = titleAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [50, 0]
    })

    function blockAppear() {
        Animated.timing(blockAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
        }).start()
    }

    function titleAppear() {
        Animated.timing(titleAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start()
    }

    function blockToggle() {
        if(blockVisible) {
            setBlockVisible(false);
            Animated.timing(blockAnim, {
                toValue: 0,
                duration: 2500,
                useNativeDriver: true,
            }).start()
            
        }
        else {
            setBlockVisible(true);
            Animated.timing(blockAnim, {
                toValue: 1,
                duration: 2500,
                useNativeDriver: true,
            }).start()
        }
    }

    useEffect(() => {
        blockAppear()
        titleAppear()
    }, [])

    return (
        <View style={styles.container}>
            <Animated.Text style={[styles.title, {
                opacity: titleAnim,
                transform: [
                    { translateY: titleTranslateYAnim },
                    { scale: titleAnim },
                ],
            }]}>
                Заголовок
            </Animated.Text>

            <Button title='Show block' onPress={ blockAppear } />
            <Button title='Toggle block' onPress={ blockToggle } />
            <Animated.View style={[styles.block, { 
                opacity: blockAnim, 
                transform: [
                    {translateX: blockTranslateXAnim},
                    {translateY: blockTranslateYAnim},
                    {scale: blockAnim},
                ],
                backgroundColor: blockColorAnim,
            }]}>

            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },

    block: {
        width: 100,
        height: 100,
        backgroundColor: 'red',
    },

    container: {
        flex: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
});