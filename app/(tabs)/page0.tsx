import { Image } from 'expo-image';
import { useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, TextInput } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function Page1() {
  const [count, setCount] = useState(0);
  const [products, setProducts] = useState([
    {id: '1', text: "Banana"},
    {id: '2', text: "Apple"},
    {id: '3', text: "Lemon"},
    {id: '4', text: "Kiwi"},
  ]);

  const [shoppingItems, setShoppingItems] = useState<{ id: string; text: string }[]>([]);
  const [newItemText, setNewItemText] = useState('');

  const [targetNumber] = useState(() => Math.floor(Math.random() * 100) + 1);
  const [guessInput, setGuessInput] = useState('');
  const [guessHistory, setGuessHistory] = useState<{ id: string; text: string }[]>([]);
  const [guessError, setGuessError] = useState('');

  const handleAddItem = () => {
    const trimmed = newItemText.trim();
    if (trimmed.length === 0) return;

    setShoppingItems(prev => [
      ...prev,
      { id: Date.now().toString(), text: trimmed },
    ]);
    setNewItemText('');
  };

  const handleDeleteItem = (id: string) => {
    Alert.alert("Notification", "Are you sure delete this product?",[
        {text: "Yes", onPress: () => { setShoppingItems(prev => prev.filter(item => item.id !== id)) }},
        {text: "No", onPress: () => {}},
    ])
  };

  function handleCheckGuess() {
    const trimmed = guessInput.trim();

    if (trimmed.length === 0) {
        setGuessError('Будь ласка, введіть число');
        return;
    }

    setGuessError('');
    const num = Number(trimmed);
    let resultText = '';

    if (num > targetNumber) resultText = `${num} - менше загаданого`;
    else if (num < targetNumber) resultText = `${num} - більше загаданого`;
    else resultText = `${num} - вірно!`;

    setGuessHistory(prev => [...prev, { id: Date.now().toString(), text: resultText }]);
    setGuessInput('');
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
      >

      <ThemedView style={[styles.container, styles.text]}>
        <ThemedText  style={styles.title}>
          Mathematical formulas
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.text}>
        <ThemedText style={styles.smallTitle}>Linear Equations</ThemedText>
      </ThemedView>

      <ThemedView style={styles.text}>
        <ThemedText>A linear equation is any equation that can be written in the form</ThemedText>
      </ThemedView>

      <ThemedView style={[styles.container, styles.text]}>
        <ThemedText style={styles.marked}>ax + b = 0</ThemedText>
      </ThemedView>

      <ThemedView style={styles.text}>
        <ThemedText>where <ThemedText style={styles.textColorfull}>a</ThemedText> and <ThemedText style={styles.textColorfull}>b</ThemedText> are real numbers and <ThemedText style={styles.textColorfull}>x</ThemedText> is a variable. This form is sometimes called the standard form of a linear equation. Note that most linear equations will not start off in this form. Also, the variable may or may not be an <ThemedText style={styles.textColorfull}>x</ThemedText> so don&apos;t get too locked into always seeing an <ThemedText style={styles.textColorfull}>x</ThemedText> there.</ThemedText>
      </ThemedView>
      <Pressable onPress={() => {Alert.alert('Next page')}} style={[styles.button, styles.text]}>
        <ThemedText style={[styles.smallTitle, styles.text]}>Next</ThemedText>
      </Pressable>
      <ThemedView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 20 }}>
        <Pressable onPress={() => {if (count < 20) { setCount(count + 1)}}} style={[styles.button, styles.text]}>
          <ThemedText style={[styles.smallTitle, styles.text]}>+1</ThemedText>
        </Pressable>
        <ThemedText>{count}</ThemedText>
        <Pressable onPress={() => {if (count > 0) { setCount(count - 1)}}} style={[styles.button, styles.text]}>
          <ThemedText style={[styles.smallTitle, styles.text]}>-1</ThemedText>
        </Pressable>
      </ThemedView>
      <ThemedView>
        <FlatList 
          data = {products}
          renderItem={ ({item}) => (
          <Pressable onPress={() => Alert.alert("Notification", "Are you sure delete this product?",[
                {text: "Yes", onPress: () => { setProducts(prev => prev.filter(todo => todo.id !== item.id)) }},
                {text: "No", onPress: () => {}},
              ])} style={styles.button}>
            <ThemedText>{item.text}</ThemedText>
          </Pressable>
        )}
        keyExtractor={ item => item.id }
        />
      </ThemedView>

      <ThemedView style={[styles.text, { marginTop: 30 }]}>
        <ThemedText style={styles.title}>Список покупок</ThemedText>
      </ThemedView>

      <ThemedView style={[styles.container, styles.text, { paddingHorizontal: 16 }]}>
        <TextInput
          style={styles.input}
          placeholder="Назва товару"
          placeholderTextColor="#999"
          value={newItemText}
          onChangeText={setNewItemText}
          onSubmitEditing={handleAddItem}
        />
        <Pressable onPress={handleAddItem} style={styles.button}>
          <ThemedText style={styles.smallTitle}>Додати</ThemedText>
        </Pressable>
      </ThemedView>

      <ThemedView style={{ paddingHorizontal: 16, marginTop: 10 }}>
        {shoppingItems.length === 0 ? (
          <ThemedText style={{ textAlign: 'center', opacity: 0.6 }}>
            Список порожній
          </ThemedText>
        ) : (
          <FlatList
            data={shoppingItems}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <Pressable onPress={() => handleDeleteItem(item.id)} style={styles.button}>
                <ThemedText>{item.text}</ThemedText>
              </Pressable>
            )}
            keyExtractor={item => item.id}
          />
        )}
      </ThemedView>

      <ThemedView style={[styles.text, { marginTop: 30 }]}>
        <ThemedText style={styles.title}>Вгадай число</ThemedText>
      </ThemedView>

      <ThemedView style={[styles.container, styles.text, { paddingHorizontal: 16 }]}>
        <TextInput
            style={styles.input}
            placeholder="Число від 1 до 100"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={guessInput}
            onChangeText={setGuessInput}
            onSubmitEditing={handleCheckGuess}
        />
        <Pressable onPress={handleCheckGuess} style={styles.button}>
          <ThemedText style={styles.smallTitle}>Перевірити</ThemedText>
        </Pressable>
      </ThemedView>

      {guessError.length > 0 && (
        <ThemedText style={styles.errorText}>{guessError}</ThemedText>
      )}

      <ThemedView style={{ paddingHorizontal: 16, marginTop: 10 }}>
        <FlatList
          data={guessHistory}
          scrollEnabled={false}
          renderItem={({ item }) => <ThemedText style={styles.card}>{item.text}</ThemedText>}
          keyExtractor={item => item.id}
        />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  rotate:{
    transform: [{ rotate: '270deg' }],
    zIndex: -1,
    bottom: 20,
    left: 100,
  },
  text: {
    backgroundColor: "#00000000"
  },
  container: {
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
  },
  smallTitle:{
    fontSize: 20,
    fontWeight: "bold",
  },
  marked: {
    padding: 8,
    paddingHorizontal: 16,
    backgroundColor: "#c23d3da6",
    borderRadius: 10,
  },
  textColorfull:{
    color: "#ab2f2f",
    fontStyle: "italic",
  },
  button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#c23d3da6",
    borderRadius: 5,
    padding: 10,
    margin: 10,
  },
  notPressed: {
    color: "red",
    opacity: 0.5,
  },
  pressed: {
    color: "green",
    opacity: 1,
  },
  card: {
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#c23d3da6",
    borderRadius: 5,
    padding: 10,
    color: "#fff",
    minWidth: 150,
  },

  errorText: {
    color: "#ff4d4d",
    textAlign: "center",
    marginTop: 5,
  },
});