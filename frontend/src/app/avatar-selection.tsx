//INTEGRATED
import React, { useState, useEffect, use } from "react"; // Importing React and the useState hook to manage state within the component, allowing us to track which avatar the user has selected.
import { View, Text, FlatList, StyleSheet, Pressable, Image, ImageBackground, ActivityIndicator, Alert } from "react-native"; // Importing necessary components and hooks from React and React Native.
import { router } from "expo-router"; // Importing the router from Expo Router to enable navigation between different screens in the app, allowing for programmatic navigation based on user actions such as selecting an avatar and continuing to the next screen.
import { useSafeAreaInsets } from "react-native-safe-area-context"; // Importing the useSafeAreaInsets hook to get the safe area insets of the device, which helps in ensuring that the UI elements are not obscured by notches, status bars, or other screen cutouts, providing a better user experience across different devices.
import { supabase } from "../lib/supabase"; // importing supabase client for database interactions
import { AvatarOptions } from '../components/avatarOptions'; // importing AvatarOptions component for rendering avatar options

interface Avatar {
  id: string;
  name: string;
  image_url: string;
  color: string;
  tint: string;
}

export default function AvatarSelection() {
  const { top } = useSafeAreaInsets(); // Using the useSafeAreaInsets hook to get the top inset value, which will be used to add padding to the header area of the avatar selection screen, ensuring that it is displayed correctly on devices with notches or status bars.
  const [avatars, setAvatars] = useState<Avatar[]>([]); // State variable to hold the list of avatars fetched from the database, allowing us to render them in the UI and manage the user's selection.
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState<string | null>(null); // State variable to hold the URL of the currently selected avatar, which will be used to update the user's profile in the database and determine whether the continue button should be enabled.
  const [fetching, setFetching] = useState(true); // State variable to indicate whether the avatars are currently being fetched from the database, which can be used to show a loading indicator or disable interactions until the data is ready.
  const [loading, setLoading] = useState(false); // State variable to indicate whether the avatars are still being loaded from the database, which can be used to show a loading indicator or disable interactions until the data is ready.

  //Fetch avatars from Supabase on component mount
  useEffect(() => {
    fetchAvatars();
  }, []);

  async function fetchAvatars() {
    setFetching(true); // Set fetching state to true to indicate that the app is currently fetching the list of avatars from the database, which can be used to show a loading indicator or disable interactions until the data is ready.
    try {
      const { data, error } = await supabase
        .from('avatars')
        .select('id, name, image_url, color, tint'); // Fetching all avatars from the 'avatars' table in the database, selecting the id, name, image_url, color, and tint fields for each avatar to be used in rendering the avatar options in the UI.
      if (error) throw error;
      if (data) { setAvatars(data); } // If the data is successfully fetched from the database, update the avatars state variable with the retrieved list of avatars, allowing the UI to render the avatar options for the user to select from.
    } catch (error: any) {
      console.error('Failed to fetch avatars:', error); // Logging any errors that occur during the fetch operation to the console for debugging purposes, allowing developers to identify and fix issues with the database query or connection.
    } finally {
      setFetching(false); // Set fetching state to false to indicate that the app has finished fetching the list of avatars from the database.
    }
  }

  async function handleContinue() {
    if(!selectedAvatarUrl) {
      Alert.alert('Selection Required', 'Please select an avatar before continuing.'); // Show an alert if the user tries to continue without selecting an avatar, prompting them to make a selection before proceeding.
      return;
    }

    setLoading(true); // Set loading state to true to indicate that the app is processing the avatar selection and preparing to navigate to the next screen, which can be used to show a loading indicator or disable the continue button to prevent multiple submissions.

    try {
      // Get the currently authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if(userError || !user) throw new Error("User session not found.");

      // Update the user's profile with the selected avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: selectedAvatarUrl })
        .eq('id', user.id); // Update the user's profile in the 'profiles' table with the selected avatar URL, matching the profile by the user's id to ensure that the correct profile is updated with the new avatar selection.

      if(updateError) throw updateError;

      //Success: Navigate to the next screen
      router.push('/timelineScreen'); // Navigate to the timeline screen after successfully updating the avatar, allowing the user to proceed with their personalized experience in the app now that they have selected an avatar.
    } catch (error: any) {
      console.error('Update failed:', error.message);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false); // Set loading to false after the update is complete, allowing the UI to re-enable interactions and hide any loading indicators that were shown while processing the avatar selection.
    }
  }

  const renderAvatar = ({ item }: { item: Avatar }) => {
    const isSelected = item.image_url === selectedAvatarUrl; // Determine if the current avatar item being rendered is the one that the user has selected by comparing its image URL to the selectedAvatarUrl state variable, which allows us to apply different styles to the selected avatar option in the UI for visual feedback.

    return (
      <Pressable
        onPress={() => setSelectedAvatarUrl(item.image_url)}
        style={styles.avatarContainer}
      >
        <View
          style={[
            styles.outerCircle,
            { backgroundColor: item.color },
            isSelected && styles.outerCircleSelected,
          ]}
        >
          <View style={styles.stitchShadow}>
            <View style={styles.dashedRing}>
              <View
                style={[
                  styles.innerCircle,
                  { backgroundColor: item.tint },
                ]}
              >
                <Image
                  source={{ uri: item.image_url }}
                  style={styles.avatarImage}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };
  
  return (
    <View style={styles.root}>
      <View style={[styles.headerArea, { paddingTop: top + 20 }]}>
        <Text style={styles.headerTitle}>Choose your Avatar</Text>
      </View>

      <ImageBackground
        source={require("../../assets/images/layered-vintage-paper.png")}
        style={styles.sheetArea}
        imageStyle={styles.paperImageStyle}
      >
        {fetching ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#6D1B12" />
            <Text style={styles.loadingText}>Fetching Avatars...</Text>
          </View>
        ) : (
          <FlatList
            data={avatars}
            renderItem={renderAvatar}
            keyExtractor={(item) => item.id}
            numColumns={3}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            style={{ marginTop: 40 }}
          />
        )}

        <View style={styles.buttonWrapper}>
          <Pressable
            onPress={handleContinue}
            style={[
              styles.loginButton,
              !selectedAvatarUrl ? styles.loginButtonDisabled : styles.loginButtonActive
            ]}
            disabled={loading || !selectedAvatarUrl}
          >
            {loading ? (
              <ActivityIndicator color="#E8DCDC" />
            ) : (
              <Text style={styles.loginText}>Continue</Text>
            )}
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#557263",
  },
  headerArea: {
    alignItems: "center",
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontFamily: "Calistoga",
    fontSize: 36,
    color: "#EDE8D9",
    textAlign: "center",
  },
  sheetArea: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  paperImageStyle: {
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
  },
  listContent: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 28,
  },
  avatarContainer: {
    width: "30%",
    alignItems: "center",
  },
  outerCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    padding:.5,
  },
  stitchShadow: {
    width: "100%",
    height: "100%",
    borderRadius: 46,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
  },
  dashedRing: {
    width: "100%",
    height: "100%",
    borderRadius: 42,
    borderWidth: 1.5,
    borderColor: "#F3EBDD",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  innerCircle: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  outerCircleSelected: {
    transform: [{ scale: 1.06 }],
  },
  avatarImage: {
    width: 50,
    height: 50,
  },
  center: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: { 
    marginTop: 10,
    color: "#5A390E",
    fontFamily: "Inter",
  },
  buttonWrapper: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 50,
  },
  loginButton: {
    borderRadius: 20,
    width: "60%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 130,
  },
  loginButtonActive: {
    backgroundColor: "#6D1B12",
  },
  loginButtonDisabled: {
    opacity: 0.45,
    backgroundColor: "#6D1B12",
  },
  loginText: {
    fontFamily: "Inter",
    fontSize: 16,
    color: "#E8DCDC",
    textAlign: "center",
    fontWeight: "bold",
  },
});