import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type Product = {
	id: string;
	name: string;
};

export default function Shop() {
	const [productName, setProductName] = useState('');
	const [products, setProducts] = useState<Product[]>([]);

	function addProduct() {
		const name = productName.trim();
		if (!name) return;

		setProducts((currentProducts) => [
			...currentProducts,
			{ id: `${Date.now()}-${name}`, name },
		]);
		setProductName('');
	}

	return (
		<ThemedView style={styles.screen}>
			<ThemedText style={styles.title}>Список покупок</ThemedText>
			<View style={styles.inputRow}>
				<TextInput
					style={styles.input}
					placeholder="Назва товару"
					placeholderTextColor="#888"
					value={productName}
					onChangeText={setProductName}
					onSubmitEditing={addProduct}
					returnKeyType="done"
				/>
				<Pressable style={styles.addButton} onPress={addProduct}>
					<ThemedText style={styles.buttonText}>Додати</ThemedText>
				</Pressable>
			</View>

			<FlatList
				contentContainerStyle={styles.list}
				data={products}
				keyExtractor={(item) => item.id}
				ListEmptyComponent={<ThemedText style={styles.empty}>Список порожній</ThemedText>}
				renderItem={({ item }) => (
					<Pressable
						style={({ pressed }) => [styles.product, pressed && styles.pressed]}
						onPress={() => router.push({ pathname: '/[name]', params: { name: item.name } })}>
						<ThemedText style={styles.productText}>{item.name}</ThemedText>
					</Pressable>
				)}
			/>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		paddingTop: 72,
		paddingHorizontal: 20,
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	inputRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	input: {
		flex: 1,
		minWidth: 0,
		borderWidth: 1,
		borderColor: '#c23d3d',
		borderRadius: 5,
		padding: 12,
		color: '#fff',
	},
	addButton: {
		padding: 12,
		borderRadius: 5,
		backgroundColor: '#c23d3d',
	},
	buttonText: {
		fontWeight: 'bold',
	},
	list: {
		gap: 10,
		paddingVertical: 20,
	},
	product: {
		padding: 16,
		borderRadius: 5,
		backgroundColor: '#c23d3d',
	},
	productText: {
		fontSize: 18,
	},
	pressed: {
		opacity: 0.65,
	},
	empty: {
		textAlign: 'center',
		opacity: 0.6,
	},
});
