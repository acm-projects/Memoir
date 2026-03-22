import { View, StyleSheet, FlatList, Text, Image, ActivityIndicator, Pressable } from 'react-native' // Importing necessary components from React Native
import React, { useState, useEffect } from 'react' // Importing React and its hooks for managing state and side effects
import { ImageBackground } from 'expo-image'; // Importing ImageBackground component from Expo for using background images in the timeline screen
import Svg, { Path, Circle } from 'react-native-svg'; // Importing components from react-native-svg to create custom SVG graphics for the timeline paths and circles
import { router } from "expo-router"; // Importing router from Expo Router to enable navigation between different screens in the app
import { Ionicons } from '@expo/vector-icons'; // Importing Ionicons from Expo Vector Icons to use icons in the dropdown menus for month and year selection
import BottomNavbar from '../components/BottomNavbar'; // Importing a custom BottomNavbar component, which is likely a navigation bar that appears at the bottom of the timeline screen for easy access to other parts of the app
import { supabase } from '../lib/supabase'; // Importing the Supabase client for interacting with the database, which may be used to fetch timeline data and user information

interface Folder { // Defining a TypeScript interface for a Folder object, which represents a memory folder in the timeline
  id: string;
  name: string;
  event_date: string | null;
  cover_image_url: string | null;
  created_at: string;
  side?: string;
}

interface Profile { // Defining a TypeScript interface for a Profile object, which represents a user's profile information
  full_name: string | null;
  birthday: string | null;
}

export default function Timeline() {
  const [folders, setFolders] = useState<Folder[]>([]); // State to hold the list of memory folders fetched from the database
  const [profile, setProfile] = useState<Profile | null>(null); // State to hold the user's profile information fetched from the database
  const [loading, setLoading] = useState(false); // State to indicate whether the timeline data is still being loaded from the database
  const [monthOpen, setMonthOpen] = useState(false); // State to manage the visibility of the month dropdown menu
  const [yearOpen, setYearOpen] = useState(false); // State to manage the visibility of the year dropdown menu
  const [selectedMonth, setSelectedMonth] = useState(""); // State to hold the currently selected month for filtering the timeline
  const [selectedYear, setSelectedYear] = useState(""); // State to hold the currently selected year for filtering the timeline

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = ["2023", "2024", "2025", "2026"];

  useEffect(() => {
    fetchData(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  async function fetchData(month: string, year: string) {
    setLoading(true); // Set loading state to true while we fetch data from the database

    const { data: { user } } = await supabase.auth.getUser(); // Get the currently authenticated user

    if(!user) return;

    //Fetch profile info
    const { data: profileData } = await supabase.from('profiles').select('full_name, birthday').eq('id', user.id).single(); // Fetch the user's profile information from the 'profiles' table in the database

    if(profileData) { setProfile(profileData); } // If profile data is successfully fetched, update the profile state with the fetched data

    // Build base query for folders
    let query = supabase
      .from('folders')
      .select('id, name, event_date, cover_image_url, created_at')
      .eq('user_id', user.id)
      .eq('is_default', false)
      .order('event_date', { ascending: true });


    // Fetch folders
    if (month && year) {
      const monthIndex = months.indexOf(month) + 1;
      const paddedMonth = monthIndex.toString().padStart(2, '0');
      const startDate = `${year}-${paddedMonth}-01`;
      const endDate = `${year}-${paddedMonth}-31`;
      query = query.gte('event_date', startDate).lte('event_date', endDate);
    }

    const { data: foldersData, error } = await query;

    if (error) {
      console.error('Failed to fetch folders:', error);
    } else if (foldersData) {
      setFolders(foldersData);
    }

    setLoading(false);
    
  }

  const getBirthYear = () => {
    if(!profile?.birthday) return "?";
    return new Date(profile.birthday).getFullYear(); // Helper function to extract the birth year from the user's birthday, which is used in the timeline footer to display a message about making memories since the user's birth year
  };

  const getDisplayDate = (folder: Folder) => {
    if(folder.event_date) {
      return new Date(folder.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); // Helper function to format the event date of a memory folder into a more readable format for display in the timeline
    }

    return new Date(folder.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); // If there is no event date, use the creation date of the folder as a fallback for display in the timeline
  };

  const CurvedTimelinePath = ({ isEven }: { isEven: boolean }) => {
    const circleX = isEven ? 72 : 27;
    return (
      <View style={styles.timeline}>
        <Svg height="220" width="120" viewBox="0 -20 100 140">
          <Path
            d={
              isEven
                ? "M50 -20 C80 30 80 90 44 140"
                : "M50 -20 C20 30 20 90 56 140"
            }
            stroke="#5A390E"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <Circle
            cx={circleX}
            cy="50"
            r="4"
            fill="#5A390E"
          />
        </Svg>
        <Image
          source={require('../../assets/images/folder-line.png')}
          style={[
            styles.brushLine,
            {
              left: isEven ? 175 : 180,
              transform: [{ scaleX: isEven ? -1 : 1 }]
            }
          ]}
        />
      </View>
    );
  };

  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);

  // Show loading indicator while data is being fetched
  if(loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#4A3728" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.redSwirlContainer}
        imageStyle={styles.redSwirl}
        source={require('../../assets/images/RED swirl subtle.png')}
      >
        <Text style={styles.welcomeBackHeader}>
          Welcome Back, {profile?.full_name ?? 'Friend'}! 
        </Text>

        <View style={styles.dropdownRow}>
          <View style={styles.dropdownContainer}>
            <Pressable
              style={styles.dropdownButton}
              onPress={() => setMonthOpen(!monthOpen)}
            >
              <View style={styles.dropdown}>
                <Text style={styles.dropdownText}>{selectedMonth || 'Month'} </Text>
                <Ionicons name="chevron-down" size={16} color="#5A390E" />
              </View>
            </Pressable>

            {monthOpen && (
              <View style={styles.dropdownList}>
                {months.map((month) => (
                  <Pressable
                    key={month}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedMonth(month);
                      setMonthOpen(false);
                    }}
                  >
                    <Text>{month}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          <View style={styles.dropdownContainer}>
            <Pressable
              style={styles.dropdownButton}
              onPress={() => setYearOpen(!yearOpen)}
            >
              <View style={styles.dropdown}>
                <Text style={styles.dropdownText}>{selectedYear || 'Year'} </Text>
                <Ionicons name="chevron-down" size={16} color="#5A390E" />
              </View>
            </Pressable>

            {yearOpen && (
              <View style={styles.dropdownList}>
                {years.map((year) => (
                  <Pressable
                    key={year}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedYear(year);
                      setYearOpen(false);
                    }}
                  >
                    <Text>{year}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        </View>

        <View style={styles.paperBackgroundContainer}>
          <ImageBackground
            source={require('../../assets/images/layered-vintage-paper.png')}
            style={styles.paperBackground}
          >
            <FlatList
              data={folders}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => {
                const isEven = index % 2 === 0;

                return (
                  <View style={styles.row}>
                    <CurvedTimelinePath isEven={isEven} />
                    <View style={[
                      styles.stampGroup,
                      {
                        alignSelf: isEven ? 'flex-start' : 'flex-end',
                        flexDirection: isEven ? 'row' : 'row-reverse'
                      }
                    ]}>
                      <View style={[styles.stampContainer,]}>
                        <Pressable onPress={() => setSelectedFolder(item)}>
                          <Image
                            source={item.cover_image_url ? { uri: item.cover_image_url } : require('../../assets/images/star-stamp.png')} // Display the cover image of the folder if it exists, otherwise display a default stamp image
                            style={styles.stampImage}
                          />
                        </Pressable>
                        {selectedFolder?.id === item.id && (
                          <View style={styles.infoCard}>
                            <Text style={styles.folderTitle}>{item.name}</Text>
                            <Text style={styles.folderDate}>{getDisplayDate(item)}</Text>
                            <Pressable
                              style={styles.openButton}
                              onPress={() => {
                                router.push({
                                  pathname: '/bulletin-board',
                                  params: { id: item.id, title: item.name },
                                });
                              }}
                            >
                              <Text style={styles.openButtonText}>
                                Open Folder
                              </Text>
                            </Pressable>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                );
              }}

              showsVerticalScrollIndicator={false}
              ListEmptyComponent={() => (
                <View style={{ padding: 30, alignItems: 'center' }}>
                  <Text style={{ color: '#4A3728' }}>No folders yet — create one!</Text>
                </View>
              )}

              ListFooterComponent={() => (
                <View style={{ padding: 30 }}>
                  <Text style={{ textAlign: 'center', color: '#4A3728' }}>
                    Making Memories since {getBirthYear()}
                  </Text>
                </View>
              )}
            />
          </ImageBackground>
        </View>
      </ImageBackground>
      <BottomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6D1B12',
    alignItems: 'center',
  },
  redSwirlContainer: {
    width: '100%',
    flex: 1,
    backgroundColor: '#6D1B12',
  },
  redSwirl: {
    resizeMode: 'cover',
    opacity: 0.1,
  },
  paperBackgroundContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 10,
  },
  paperBackground: {
    flex: 1,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  welcomeBackHeader: {
    fontFamily: 'Calistoga',
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F6E5CD',
    textAlign: 'center',
    marginTop: 50,
  },
  row: {
    height: 180,
    justifyContent: 'center'
  },
  timeline: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center"
  },
  stampContainer: {
    paddingHorizontal: 20,
    paddingVertical: 0,
    alignItems: 'center',
    backgroundColor: '#6D1B12',
    height: 120,
    width: 100,
    borderRadius: 10,
  },
  stampImage: {
    width: 100,
    height: 120,
    marginLeft: 20,
  },
  stampText: {
    marginTop: 10,
    fontSize: 16
  },
  line: {
    width: 60,
    height: 20,
    marginHorizontal: 10,
  },
  stampGroup: {
    width: '60%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brushLine: {
    position: 'absolute',
    top: 112,
    width: 45,
    height: 10,
    resizeMode: 'contain',
    tintColor: '#5A390E',
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
  },
  dropdownRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 10,
  },
  dropdownContainer: {
    paddingTop: 20,
    alignItems: "center",
  },
  dropdownButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F6E5CD',
  },
  dropdownText: {
    fontSize: 16,
    color: "#5A390E",
    fontWeight: "600",
    fontFamily: 'Inter',
  },
  dropdownList: {
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: '#F6E5CD',
    overflow: "hidden",
    position: "absolute",
    top: 40,
    zIndex: 10,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  infoCard: {
    backgroundColor: '#F6F0E4',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    width: 180,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    zIndex: 3,
  },
  folderTitle: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 4,
  },
  folderDate: {
    color: "#666",
    marginBottom: 8,
  },
  openButton: {
    backgroundColor: "#5A390E",
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
  },
  openButtonText: {
    color: "white",
    fontWeight: "600",
  },
});