import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Image,
  ActivityIndicator,
  Pressable,
  ImageBackground,
  SafeAreaView,
  Dimensions,
  
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';
import BottomNavbar from '../components/BottomNavbar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const MOCK_API = {
  data: [
    {
      id: '1',
      title: '19th Birthday',
      date: 'March 18, 2026',
      side: 'left',
      image: require('../../assets/images/deer-stamp.png'),
    },
    {
      id: '2',
      title: 'Trip to Prague',
      date: 'March 24, 2026',
      side: 'right',
      image: require('../../assets/images/bird-stamp.png'),
    },
    {
      id: '3',
      title: 'Garden Log',
      date: 'April 2, 2026',
      side: 'left',
      image: require('../../assets/images/brasil-stamp.png'),
    },
    {
      id: '4',
      title: 'Prom',
      date: 'April 6, 2026',
      side: 'left',
      image: require('../../assets/images/blueFlower-stamp.png'),
    },
    {
      id: '5',
      title: "Mom's 50th",
      date: 'April 6, 2026',
      side: 'left',
      image: require('../../assets/images/butterfly-stamp.png'),
    },
    {
      id: '6',
      title: '19th Birthday',
      date: 'March 18, 2026',
      side: 'left',
      image: require('../../assets/images/costa-rica-stamp.png'),
    },
    {
      id: '7',
      title: 'Trip to Prague',
      date: 'March 24, 2026',
      side: 'right',
      image: require('../../assets/images/star-stamp.png'),
    },
    {
      id: '8',
      title: 'Garden Log',
      date: 'April 2, 2026',
      side: 'left',
      image: require('../../assets/images/Australia-Stamp.png'),
    },
    {
      id: '9',
      title: 'Prom',
      date: 'April 6, 2026',
      side: 'left',
      image: require('../../assets/images/costa-rica-stamp.png'),
    },
    {
      id: '10',
      title: "Mom's 50th",
      date: 'April 6, 2026',
      side: 'left',
      image: require('../../assets/images/costa-rica-stamp.png'),
    },
    {
      id: '11',
      title: '19th Birthday',
      date: 'March 18, 2026',
      side: 'left',
      image: require('../../assets/images/costa-rica-stamp.png'),
    },
    {
      id: '12',
      title: 'Trip to Prague',
      date: 'March 24, 2026',
      side: 'right',
      image: require('../../assets/images/star-stamp.png'),
    },
    {
      id: '13',
      title: 'Garden Log',
      date: 'April 2, 2026',
      side: 'left',
      image: require('../../assets/images/Australia-Stamp.png'),
    },
    {
      id: '14',
      title: 'Prom',
      date: 'April 6, 2026',
      side: 'left',
      image: require('../../assets/images/costa-rica-stamp.png'),
    },
    {
      id: '15',
      title: "Mom's 50th",
      date: 'April 6, 2026',
      side: 'left',
      image: require('../../assets/images/costa-rica-stamp.png'),
    },
  ],
  metadata: {
    currentPage: 1,
    hasNextPage: true,
    totalPages: 5,
  },
};

interface Stamp {
  id: string;
  title: string;
  date: string;
  side: string;
  image: any;
}

const CurvedTimelinePath = ({ isEven }: { isEven: boolean }) => {
  return (
    <View style={styles.timeline}>
      <Svg height="200" width="100%" viewBox="0 0 100 200">
        <Path
          d={
            isEven
              ? 'M50 0 C75 50 75 150 50 200'
              : 'M50 0 C25 50 25 150 50 200'
          }
          stroke="#C8B89A"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <Circle
          cx={isEven ? '68' : '32'}
          cy="100"
          r="5"
          fill="#7B1D1D"
          stroke="#C8B89A"
          strokeWidth="1.5"
        />
      </Svg>
    </View>
  );
};

export default function Timeline() {
  const [items, setItems] = useState<Stamp[]>([]);
  const [loading, setLoading] = useState(false);
  const [monthOpen, setMonthOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('March');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedStamp, setSelectedStamp] = useState<Stamp | null>(null);

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const years = ['2023', '2024', '2025', '2026'];

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

  const renderTimelineItem = ({ item, index }: { item: Stamp; index: number }) => {
    const isEven = index % 2 === 0; // even -> left, odd -> right

    const stampWidth = SCREEN_WIDTH * 0.27;
    const isSelected = selectedStamp?.id === item.id;

    return (
      <View style={styles.row}>
        {/* Curved timeline path */}
        <CurvedTimelinePath isEven={isEven} />

        {/* Stamp group (card + date + popup) */}
        <View
          style={[
            styles.stampGroup,
            {
              alignSelf: isEven ? 'flex-start' : 'flex-end',
            },
          ]}
        >
          {/* Stamp card */}
          <View
            style={[
              styles.stampCard,
              {
                width: stampWidth,
              },
            ]}
          >
            <Pressable onPress={() => setSelectedStamp(isSelected ? null : item)}>
              <View style={styles.stampImageWrapper}>
                <Image source={item.image} style={styles.stampImage} />
              </View>
              <View style={styles.labelBar}>
                <Text style={styles.labelTitle} numberOfLines={1}>
                  {item.title}
                </Text>
              </View>
            </Pressable>
          </View>

          {/* Date badge centered below card */}
          <View style={styles.dateBadge}>
            <Text style={styles.dateBadgeText}>{item.date}</Text>
          </View>

          {/* Info popup centered relative to stamp */}
          {isSelected && (
            <View style={styles.infoPopup}>
              <Text style={styles.infoTitle}>{item.title}</Text>
              <Text style={styles.infoDate}>{item.date}</Text>
              <Pressable
                style={styles.infoButton}
                onPress={() => {
                  router.push({
                    pathname: '/bulletin-board',
                    params: { id: item.id, title: item.title },
                  });
                }}
              >
                <Text style={styles.infoButtonText}>Open Folder</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    );
  };

  const closeAllDropdowns = () => {
  setMonthOpen(false);
  setYearOpen(false);
  };

  return (
    <View style={styles.root}>
      <ImageBackground
        source={require('../../assets/images/RED swirl subtle.png')}
        style={styles.outerBackground}
        imageStyle={styles.outerBackgroundImage}
      >
        <Pressable 
        style={{ flex: 1 }} 
        onPress={closeAllDropdowns}
        accessible={false}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header section */}
          <View style={styles.header}>
            <Text style={styles.welcomeBackHeader}>Welcome Back, Name</Text>

            <View style={styles.dropdownRow}>
              {/* Month dropdown */}
              <View style={styles.dropdownWrapper}>
                <Pressable
                  style={styles.dropdownButton}
                  onPress={() => {
                    setMonthOpen(!monthOpen);
                    if (yearOpen) setYearOpen(false);
                  }}
                >
                  <View style={styles.dropdownInner}>
                    <Text style={styles.dropdownText}>{selectedMonth}</Text>
                    <Text style={styles.dropdownArrow}>▾</Text>
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
                        <Text style={styles.dropdownItemText}>{month}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              {/* Year dropdown */}
              <View style={styles.dropdownWrapper}>
                <Pressable
                  style={styles.dropdownButton}
                  onPress={() => {
                    setYearOpen(!yearOpen);
                    if (monthOpen) setMonthOpen(false);
                  }}
                >
                  <View style={styles.dropdownInner}>
                    <Text style={styles.dropdownText}>{selectedYear}</Text>
                    <Text style={styles.dropdownArrow}>▾</Text>
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
                        <Text style={styles.dropdownItemText}>{year}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Paper content area */}
          <View style={styles.paperContainer}>
            <ImageBackground
              source={require('../../assets/images/layered-vintage-paper.png')}
              style={styles.paperBackground}
            >
              <FlatList
                data={items}
                keyExtractor={(item, index) => item.id + index}
                renderItem={renderTimelineItem}
                onEndReached={fetchNextPage}
                onEndReachedThreshold={0.5}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                ListFooterComponent={() => (
                  <View style={styles.footerContainer}>
                    {loading ? (
                      <ActivityIndicator size="large" color="#7B1D1D" />
                    ) : (
                      <Text style={styles.footerText}>
                        {items.length >= MOCK_API.data.length
                          ? 'Making Memories since *Birth Year* ✦'
                          : 'Scroll for more'}
                      </Text>
                    )}
                  </View>
                )}
              />
            </ImageBackground>
          </View>
          
        </SafeAreaView>
        </Pressable>
        <View style={styles.navbarWrapper}>
          <BottomNavbar />
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#7B1D1D',
  },
  outerBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  outerBackgroundImage: {
    resizeMode: 'cover',
    opacity: 0.12,
  },
  safeArea: {
    flex: 1,
    paddingTop: 12,
    paddingHorizontal: 20,
  },
  header: {
    paddingBottom: 8,
  },
  welcomeBackHeader: {
    fontFamily: 'Calistoga',
    fontSize: 28,
    color: '#F6E5CD',
    marginBottom: 14,
    textAlign: 'center',
  },
  dropdownRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  dropdownWrapper: {
    flexShrink: 0,
  },
  dropdownButton: {
    backgroundColor: 'rgba(246,229,205,0.15)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(246,229,205,0.3)',
  },
  dropdownInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownText: {
    color: '#F6E5CD',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Inter',
    marginRight: 4,
  },
  dropdownArrow: {
    color: '#F6E5CD',
    fontSize: 14,
  },
  dropdownList: {
    marginTop: 6,
    borderRadius: 12,
    backgroundColor: '#EDE8D9',
    position: 'absolute',
    top: 44,
    minWidth: 140,
    zIndex: 100,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  dropdownItemText: {
    color: '#5A390E',
    fontSize: 14,
  },
  paperContainer: {
    flex: 1,
    marginTop: 16,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  paperBackground: {
    flex: 1,
  },
  row: {
    height: 200,
    justifyContent: 'center',
  },
  timeline: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
  },
  stampGroup: {
    width: '60%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stampCard: {
    backgroundColor: '#7B1D1D',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  stampImageWrapper: {
    width: '90%',
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7B1D1D',
    marginLeft:5,
  },
  stampImage: {
    width: '100%',
    height: 80,
    resizeMode: 'contain',
  },
  labelBar: {
    backgroundColor: '#5C1010',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  labelTitle: {
    color: '#F6E5CD',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  dateBadge: {
    marginTop: 6,
    alignSelf: 'center',
    backgroundColor: 'rgba(237,232,217,0.9)',
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  dateBadgeText: {
    color: '#5A390E',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    alignSelf: 'center',
  },
  infoPopup: {
    marginTop: 10,
    alignSelf: 'center',
    backgroundColor: '#EDE8D9',
    borderRadius: 14,
    padding: 14,
    zIndex: 20,
  },
  infoTitle: {
    fontWeight: '700',
    color: '#3B2C1A',
    fontSize: 14,
  },
  infoDate: {
    color: '#8B7355',
    fontSize: 12,
    marginTop: 2,
  },
  infoButton: {
    backgroundColor: '#7B1D1D',
    borderRadius: 8,
    paddingVertical: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  infoButtonText: {
    color: '#F6E5CD',
    fontSize: 13,
    fontWeight: '600',
  },
  footerContainer: {
    padding: 30,
  },
  footerText: {
    textAlign: 'center',
    color: '#8B7355',
    fontSize: 13,
    fontStyle: 'italic',
  },
  navbarWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
});