import { View, Text, TextInput, Pressable, StyleSheet, ImageBackground, TouchableOpacity, FlatList } from "react-native";
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import FolderItem from '../components/folder-item';
import BottomNavbar from '../components/BottomNavbar';
import BackButton from "../components/back-Button";
import React, { useMemo, useState } from 'react';

const folders = [
  { id: '1', title: 'Create New Folder', date: '', isAdd: true, image: null },
  { id: '2', title: 'All Memories', date: 'March 18, 2026', isAdd: false, image: require('../../assets/images/Australia-Stamp.png') },
  { id: '3', title: 'Spring Break', date: 'March 24, 2026', isAdd: false, image: require('../../assets/images/star-stamp.png') },
  { id: '4', title: 'Prom', date: 'April 6, 2026', isAdd: false, image: require('../../assets/images/costa-rica-stamp.png') },
  { id: '5', title: 'College grad', date: 'April 6, 2026', isAdd: false, image: require('../../assets/images/costa-rica-stamp.png') },
  { id: '6', title: 'Bestieee', date: 'March 18, 2026', isAdd: false, image: require('../../assets/images/costa-rica-stamp.png') },
];

export default function viewFolder() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFolders = useMemo(
    () =>
      folders.filter((folder) => {
        if (folder.isAdd) return true; // always show the "Create New Folder" tile
        if (!searchQuery.trim()) return true;
        return folder.title.toLowerCase().includes(searchQuery.toLowerCase());
      }),
    [searchQuery]
  );

  return (
    <View style={styles.container}>
      {/* Full green swirl background */}
      <View style={{ flex: 1 }}>
      <ImageBackground
        source={require('../../assets/images/swirly-subtle.png')}
        style={styles.fullBackground}
        imageStyle={{ width: '100%', height: '100%' }}
      >
        {/* Header card (cream/paper colored) */}
        <View style={styles.headerCard}>
        <BackButton color="#557263" />
         <Text style = {styles.headerText}>Name's Memories</Text>
        

        
          </View>

          {/* Search bar */}
          <View style={styles.searchBar}>
            <Ionicons name="search" size={16} color="#999" style={{ marginRight: 6 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search folders"
              placeholderTextColor="#aaa"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
          </View>
        

        {/* Folder grid on paper background */}
        <ImageBackground
          source={require('../../assets/images/paperstrip.png')}
          style={styles.gridBackground}
        >
          <FlatList
            data={filteredFolders}
            numColumns={3}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            columnWrapperStyle={styles.row}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.folderWrapper}
                onPress={() => {
                  if (item.isAdd) {
                    router.push('/create-folder');
                  } else {
                    router.push({
                      pathname: '/bulletin-board',
                      params: { id: item.id, title: item.title },
                    });
                  }
                }}
              >
                <FolderItem
                  title={item.title}
                  imageSource={item.image}
                  isAddButton={item.isAdd}
                />
                {/* + button on non-add folders */}
               
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        </ImageBackground>
      </ImageBackground>
      </View>

      <BottomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  fullBackground: {
    flex: 1,
    width: '100%',
  },

  // Cream header card at the top
  headerCard: {
    backgroundColor: '#F8E5CF',
    borderRadius: 18,
    marginHorizontal: 12,
    marginTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 10,
    zIndex: 10,
  },

 

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },

  headerText: {
    paddingTop:5,
    fontFamily: 'Calistoga',
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5A390E',
    textAlign:'center',
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8E5CF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    width:'70%',
    marginLeft:60,
    marginTop:20,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },

  // Paper-textured grid area
  gridBackground: {
    flex: 1,
    marginTop:-200,
    //marginBottom:100,
    overflow: 'hidden',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width:'100%',
    height:'80%',

  },

  listContainer: {
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingTop: 275,
    paddingBottom: 40,
  },

  row: {
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  folderWrapper: {
    alignItems: 'center',   // remove position:relative and fixed width
  },

  
});