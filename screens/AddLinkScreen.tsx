import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Switch } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { supabase } from '../lib/supabase';
import type { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'AddLink'>;

export default function AddLinkScreen({ navigation }: Props) {
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [favorite, setFavorite] = useState(false);

    const handleAdd = async () => {
        if (!url) {
            Alert.alert('Error', 'La URL es obligatoria');
            return;
        }
        const payload: any = {
            url,
            title: title ? title : null,
            description: description ? description : null,
            tags: tags ? tags.split(',').map((t) => t.trim()) : null,
            favorite,
        };
        const { error } = await supabase.from('links').insert(payload).single();
        if (error) {
            Alert.alert('Error', error.message);
        } else {
            Alert.alert('Éxito', 'Enlace guardado');
            navigation.goBack();
        }
    };

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text style={{ marginBottom: 4 }}>URL *</Text>
            <TextInput
                value={url}
                onChangeText={setUrl}
                style={{ borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 8 }}
                autoCapitalize="none"
                keyboardType="url"
            />
            <Text style={{ marginBottom: 4 }}>Título</Text>
            <TextInput
                value={title}
                onChangeText={setTitle}
                style={{ borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 8 }}
            />
            <Text style={{ marginBottom: 4 }}>Descripción</Text>
            <TextInput
                value={description}
                onChangeText={setDescription}
                multiline
                style={{ borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 8, height: 80 }}
            />
            <Text style={{ marginBottom: 4 }}>Etiquetas (separadas por coma)</Text>
            <TextInput
                value={tags}
                onChangeText={setTags}
                style={{ borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 8 }}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <Switch value={favorite} onValueChange={setFavorite} />
                <Text style={{ marginLeft: 8 }}>Favorito</Text>
            </View>
            <Button title="Guardar" onPress={handleAdd} />
        </View>
    );
}