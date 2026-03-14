import { View, Text, TextInput, Pressable, StyleSheet, ImageBackground,  Image, TouchableOpacity,FlatList } from "react-native";
import { router } from "expo-router";
import FolderItem from '../components/folder-item';


const folders = [
    
      { id: '1', title: 'New Folder', date: 'March 18, 2026', isAdd: true, image: require('../../assets/images/costa-rica-stamp.png') },
      { id: '2', title: 'Trip to Prague', date: 'March 24, 2026', isAdd: false, image: require('../../assets/images/star-stamp.png') },
      { id: '3', title: 'Garden Log', date: 'April 2, 2026', isAdd: false, image: require('../../assets/images/Australia-Stamp.png') },
      { id: '4', title: 'Prom', date: 'April 6, 2026',isAdd: false, image: require('../../assets/images/costa-rica-stamp.png') },
      { id: '5', title: "Mom's 50th", date: 'April 6, 2026',isAdd: false, image: require('../../assets/images/costa-rica-stamp.png') },
      { id: '6', title: '19th Birthday', date: 'March 18, 2026',isAdd: false, image: require('../../assets/images/costa-rica-stamp.png') },
      { id: '7', title: 'Trip to Prague', date: 'March 24, 2026', isAdd: false, image: require('../../assets/images/star-stamp.png') },
      { id: '8', title: 'Garden Log', date: 'April 2, 2026', isAdd: false, image: require('../../assets/images/Australia-Stamp.png') },
      { id: '9', title: 'Prom', date: 'April 6, 2026', isAdd: false, image: require('../../assets/images/costa-rica-stamp.png') },
      { id: '10', title: "Mom's 50th", date: 'April 6, 2026', isAdd: false, image: require('../../assets/images/costa-rica-stamp.png') },
      { id: '11', title: '19th Birthday', date: 'March 18, 2026',isAdd: false, image: require('../../assets/images/costa-rica-stamp.png') },
      { id: '12', title: 'Trip to Prague', date: 'March 24, 2026', isAdd: false, image: require('../../assets/images/star-stamp.png') },
      { id: '13', title: 'Garden Log', date: 'April 2, 2026', isAdd: false, image: require('../../assets/images/Australia-Stamp.png') },
      { id: '14', title: 'Prom', date: 'April 6, 2026', isAdd: false, image: require('../../assets/images/costa-rica-stamp.png') },
      { id: '15', title: "Mom's 50th", date: 'April 6, 2026', isAdd: false, image: require('../../assets/images/costa-rica-stamp.png') },
    ];

export default function viewFolder() {
    return (
        <View style={styles.container}>
            <ImageBackground
     
                source = {require('../../assets/images/red-swirl-background.png')}
                style = {styles.paperBackground}
                imageStyle = {{ width:'100%', height:'100%' }}>
            
            <View style={styles.swirlBackgroundContainer}>
            <ImageBackground
            source={require('../../assets/images/vintage-paper-background.png')}
            style={styles.swirlBackground}
            >
                <Text style = {styles.headerText}> Name's Memories</Text>
                <FlatList
                    data={folders}
                    numColumns={2}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    columnWrapperStyle={styles.row}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                          activeOpacity={0.7}
                          onPress={() => {
                            if (item.isAdd) {
                              // Navigate to a "Create Folder" screen
                              router.push('/create-folder'); 
                            } else {
                              // Navigate to the folder detail screen and pass the ID
                              router.push({
                                pathname: '/bulletin-board',
                                params: { id: item.id, title: item.title }
                              });
                            }
                          }}
                        >
                          <FolderItem 
                            title={item.title} 
                            imageSource={item.image} 
                            isAddButton={item.isAdd} 
                          />
                        </TouchableOpacity>
                      )}
        showsVerticalScrollIndicator={false}
      />
           
                </ImageBackground>
                </View>
                </ImageBackground>
   

        </View>
    )}



    const styles = StyleSheet.create({
        container:{
            flex:1,
        },

        paperBackground:{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
        },

        swirlBackgroundContainer: {
            flex: 1,
            width: '100%',
            borderRadius: 20,
            overflow: 'hidden',
            marginTop: 100,
          },

          swirlBackground: {
            flex: 1,
            borderRadius: 20,
            resizeMode: 'cover',
          },

          headerText:{
            fontFamily:'Calistoga',
            fontSize: 32,
            fontWeight: 'bold',
            color: '#5A390E',
            textAlign: 'center',
            marginTop:30,
            

          },
          listContainer: {
            paddingHorizontal: 20,
            paddingBottom: 40,
          },
          
          row: {
            justifyContent: 'space-between', 
            //gap:5,
            marginBottom: 10, 
          },


    })