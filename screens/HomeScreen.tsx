import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Button, TouchableOpacity } from 'react-native';
import { supabase } from '../lib/supabase';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

interface LinkItem {
    id: string;
    url: string;
    title: string | null;
    description: string | null;
    tags: string[] | null;
    favorite: boolean;
}

export default function HomeScreen({ navigation }: Props) {
    const [links, setLinks] = useState<LinkItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchLinks = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('links')
            .select('id, url, title, description, tags, favorite')
            .order('created_at', { ascending: false });
        if (error) {
            console.error('error fetching links', error);
        } else {
            setLinks((data as any) || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchLinks();
        const channel = supabase
            .channel('realtime:links')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'links' }, () => {
                fetchLinks();
            })
            .subscribe();
        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    const renderItem = ({ item }: { item: LinkItem }) => (
        <View style={{ paddingVertical: 8, borderBottomWidth: 1, borderColor: '#eee' }}>
            <Text style={{ fontWeight: 'bold' }}>{item.title ?? item.url}</Text>
            {item.description ? <Text>{item.description}</Text> : null}
            <Text style={{ color: '#007aff' }}>{item.url}</Text>
            {item.tags && item.tags.length > 0 && (
                <Text style={{ fontStyle: 'italic' }}>Etiquetas: {item.tags.join(', ')}</Text>
            )}
            {item.favorite && <Text>★ Favorito</Text>}
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 16 }}>
                <Button title="Añadir enlace" onPress={() => navigation.navigate('AddLink')} />
                <Button title="Cerrar sesión" onPress={signOut} />
            </View>
            <FlatList
                data={links}
                keyExtractor={(item) => item.id}
                refreshing={loading}
                onRefresh={fetchLinks}
                renderItem={renderItem}
                contentContainerStyle={{ paddingHorizontal: 16 }}
            />
        </View>
    );
}