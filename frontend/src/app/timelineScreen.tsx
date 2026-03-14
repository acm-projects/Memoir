import { View, StyleSheet, FlatList, Text, Image, ActivityIndicator, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import { ImageBackground } from 'expo-image';
import Svg, { Path, Circle } from 'react-native-svg';
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

const MOCK_API = {
  data: [
    { id: '1', title: '19th Birthday', date: 'March 18, 2026', side: 'left', image: require('../../assets/images/costa-rica-stamp.png') },
    { id: '2', title: 'Trip to Prague', date: 'March 24, 2026', side: 'right', image: require('../../assets/images/star-stamp.png') },
    { id: '3', title: 'Garden Log', date: 'April 2, 2026', side: 'left', image: require('../../assets/images/Australia-Stamp.png') },
    { id: '4', title: 'Prom', date: 'April 6, 2026', side: 'left', image: require('../../assets/images/costa-rica-stamp.png') },
    { id: '5', title: "Mom's 50th", date: 'April 6, 2026', side: 'left', image: require('../../assets/images/costa-rica-stamp.png') },
    { id: '6', title: '19th Birthday', date: 'March 18, 2026', side: 'left', image: require('../../assets/images/costa-rica-stamp.png') },
    { id: '7', title: 'Trip to Prague', date: 'March 24, 2026', side: 'right', image: require('../../assets/images/star-stamp.png') },
    { id: '8', title: 'Garden Log', date: 'April 2, 2026', side: 'left', image: require('../../assets/images/Australia-Stamp.png') },
    { id: '9', title: 'Prom', date: 'April 6, 2026', side: 'left', image: require('../../assets/images/costa-rica-stamp.png') },
    { id: '10', title: "Mom's 50th", date: 'April 6, 2026', side: 'left', image: require('../../assets/images/costa-rica-stamp.png') },
    { id: '11', title: '19th Birthday', date: 'March 18, 2026', side: 'left', image: require('../../assets/images/costa-rica-stamp.png') },
    { id: '12', title: 'Trip to Prague', date: 'March 24, 2026', side: 'right', image: require('../../assets/images/star-stamp.png') },
    { id: '13', title: 'Garden Log', date: 'April 2, 2026', side: 'left', image: require('../../assets/images/Australia-Stamp.png') },
    { id: '14', title: 'Prom', date: 'April 6, 2026', side: 'left', image: require('../../assets/images/costa-rica-stamp.png') },
    { id: '15', title: "Mom's 50th", date: 'April 6, 2026', side: 'left', image: require('../../assets/images/costa-rica-stamp.png') },
  ],
  metadata: {
    currentPage: 1,
    hasNextPage: true,
    totalPages: 5
  }
};

interface Stamp {
  id: string;
  title: string;
  date: string;
  side: string;
  image: any;
}

export default function Timeline() {
  const [items, setItems] = useState<Stamp[]>([]);
  const [loading, setLoading] = useState(false);
  const [monthOpen, setMonthOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("March");
  const [selectedYear, setSelectedYear] = useState("2026");

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = ["2023", "2024", "2025", "2026"];

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

  const [selectedStamp, setSelectedStamp] = useState<Stamp | null>(null);

  useEffect(() => {
    const firstBatch = MOCK_API.data.slice(0, 5);
    setItems(firstBatch);
  }, []);

  const fetchNextPage = async () => {
    if (loading || items.length >= MOCK_API.data.length) {
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const start = items.length;
      const end = start + 5;
      const nextBatch = MOCK_API.data.slice(start, end);

      setItems((existingItems) => {
        return [...existingItems, ...nextBatch];
      });

      setLoading(false);
    }, 100);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.redSwirlContainer}
        imageStyle={styles.redSwirl}
        source={require('../../assets/images/red-swirl.jpg')}
      >
        <Text style={styles.welcomeBackHeader}>
          Welcome Back, Name
        </Text>
        <View style={styles.dropdownRow}>
          <View style={styles.dropdownContainer}>
            <Pressable
              style={styles.dropdownButton}
              onPress={() => setMonthOpen(!monthOpen)}
            >
              <View style={styles.dropdown}>
                <Text style={styles.dropdownText}>{selectedMonth} </Text>
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
                <Text style={styles.dropdownText}>{selectedYear} </Text>
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
            source={require('../../assets/images/vintage-paper-background.png')}
            style={styles.paperBackground}
          >
            <FlatList
              data={items}
              keyExtractor={(item, index) => item.id + index}
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
                        <Pressable onPress={() => setSelectedStamp(item)}>
                          <Image
                            source={item.image}
                            style={styles.stampImage}
                          />
                        </Pressable>
                        {selectedStamp?.id === item.id && (
                          <View style={styles.infoCard}>
                            <Text style={styles.folderTitle}>{item.title}</Text>
                            <Text style={styles.folderDate}>
                              {item.date}
                            </Text>
                            <Pressable
                              style={styles.openButton}
                              onPress={() => { router.replace('/view-folder2') }}
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
              onEndReached={fetchNextPage}
              onEndReachedThreshold={0.5}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={() => (
                <View style={{ padding: 30 }}>
                  {loading ? (
                    <ActivityIndicator size="large" color="#4A3728" />
                  ) : (
                    <Text style={{ textAlign: 'center', color: '#4A3728' }}>
                      {items.length >= MOCK_API.data.length ? "Making Memories since *Birth Year* " : "Scroll for more"}
                    </Text>
                  )}
                </View>
              )}
            />
          </ImageBackground>
        </View>
      </ImageBackground>
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
    backgroundColor: '#9D4D48',
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