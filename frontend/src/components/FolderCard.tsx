import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';

type Folder = { id: string | number; name: string; thumbnail?: any };

export default function FolderCard({ folder, selected, onSelect }: { folder: Folder; selected: boolean; onSelect: (id: any) => void }) {
  return (
    <TouchableOpacity onPress={() => onSelect(folder.id)} style={[styles.card, selected && styles.selected]}>
      <Image source={folder.thumbnail} style={styles.thumb} />
      <Text style={styles.name} numberOfLines={1}>{folder.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { width: 96, height: 120, marginRight: 12, backgroundColor: '#8e2f2f', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  selected: { borderWidth: 3, borderColor: '#ffd6d3' },
  thumb: { width: 64, height: 64, borderRadius: 6, backgroundColor: '#fff' },
  name: { color: '#fff', marginTop: 6, fontSize: 12, textAlign: 'center' },
});
