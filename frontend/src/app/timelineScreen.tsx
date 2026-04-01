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
import Svg, { Path, Circle, Rect, Ellipse, Line, G, Text as SvgText, Polygon } from 'react-native-svg';
import BottomNavbar from '../components/BottomNavbar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ILLUSTRATION_COLORS = [
  '#557263',
  '#4A6741',
  '#6B4F6B',
  '#8B6A3E',
  '#7B1D1D',
];

const MOCK_API = {
  data: [
    { id: '1', title: '19th Birthday', date: 'March 18, 2026', side: 'left', image: require('../../assets/images/deer-stamp.png') },
    { id: '2', title: 'Trip to Prague', date: 'March 24, 2026', side: 'right', image: require('../../assets/images/bird-stamp.png') },
    { id: '3', title: 'Garden Log', date: 'April 2, 2026', side: 'left', image: require('../../assets/images/brasil-stamp.png') },
    { id: '4', title: 'Prom', date: 'April 6, 2026', side: 'left', image: require('../../assets/images/blueFlower-stamp.png') },
    { id: '5', title: "Mom's 50th", date: 'April 6, 2026', side: 'left', image: require('../../assets/images/butterfly-stamp.png') },
    { id: '6', title: '19th Birthday', date: 'March 18, 2026', side: 'left', image: require('../../assets/images/cat-stamp.png') },
    { id: '7', title: 'Trip to Prague', date: 'March 24, 2026', side: 'right', image: require('../../assets/images/egyptia-stamp.png') },
    { id: '8', title: 'Garden Log', date: 'April 2, 2026', side: 'left', image: require('../../assets/images/purple-flower-stamp.png') },
    { id: '9', title: 'Prom', date: 'April 6, 2026', side: 'left', image: require('../../assets/images/hello-kitty-stamp.png') },
    { id: '10', title: "Mom's 50th", date: 'April 6, 2026', side: 'left', image: require('../../assets/images/animal-stamp.png') },
    { id: '11', title: '19th Birthday', date: 'March 18, 2026', side: 'left', image: require('../../assets/images/orange-flower-stamp.png') },
    { id: '12', title: 'Trip to Prague', date: 'March 24, 2026', side: 'right', image: require('../../assets/images/deer-stamp.png') },
    { id: '13', title: 'Garden Log', date: 'April 2, 2026', side: 'left', image: require('../../assets/images/bird-stamp.png') },
    { id: '14', title: 'Prom', date: 'April 6, 2026', side: 'left', image: require('../../assets/images/blueFlower-stamp.png') },
    { id: '15', title: "Mom's 50th", date: 'April 6, 2026', side: 'left', image: require('../../assets/images/egyptia-stamp.png') },
  ],
  metadata: { currentPage: 1, hasNextPage: true, totalPages: 5 },
};

interface Stamp {
  id: string;
  title: string;
  date: string;
  side: string;
  image: any;
}

const CurvedTimelinePath = ({ isEven }: { isEven: boolean }) => (
  <View style={styles.timeline}>
    <Svg height="200" width="100%" viewBox="0 0 100 200">
      <Path
        d={isEven ? 'M50 0 C95 40 95 160 50 200' : 'M50 0 C5 40 5 160 50 200'}
        stroke="#C8A84B"
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
      />
      {/* Rich layered pin: outer shadow, cream ring, dark red center */}
      <Circle cx={isEven ? '80' : '20'} cy="100" r="10" fill="#7B1D1D" opacity="0.15" />
      <Circle cx={isEven ? '80' : '20'} cy="100" r="7" fill="#F6E5CD" stroke="#C8A84B" strokeWidth="2" />
      <Circle cx={isEven ? '80' : '20'} cy="100" r="3" fill="#7B1D1D" />
    </Svg>
  </View>
);

const BackgroundIllustrations = () => (
  <View style={styles.illustrationsAbsolute} pointerEvents="none">
    {/* TOP ZONE */}
    {/* Compass rose */}
    <View style={{ position: 'absolute', top: 10, left: 8, width: 100, height: 100 }}>
      <Svg width={100} height={100} viewBox="0 0 100 100">
        {/* Outer dotted ring */}
        <Circle cx="50" cy="50" r="46" stroke="#557263" strokeWidth={1.5} fill="none" opacity={0.10} strokeDasharray="2 4" />
        {/* 8-point star spokes */}
        {[...Array(8)].map((_, i) => {
          const angle = (Math.PI / 4) * i;
          const x2 = 50 + 38 * Math.cos(angle);
          const y2 = 50 + 38 * Math.sin(angle);
          return (
            <Line key={i} x1="50" y1="50" x2={x2} y2={y2} stroke="#557263" strokeWidth={i % 2 === 0 ? 2 : 1.2} opacity={0.10} />
          );
        })}
        {/* Star shape */}
        {[...Array(8)].map((_, i) => {
          const angle = (Math.PI / 4) * i;
          const r = i % 2 === 0 ? 32 : 18;
          const x = 50 + r * Math.cos(angle);
          const y = 50 + r * Math.sin(angle);
          return (
            <Line key={100 + i} x1="50" y1="50" x2={x} y2={y} stroke="#557263" strokeWidth={i % 2 === 0 ? 2 : 1.2} opacity={0.10} />
          );
        })}
        {/* N/S/E/W tick marks */}
        {['N', 'E', 'S', 'W'].map((dir, i) => {
          const angle = (Math.PI / 2) * i;
          const x = 50 + 44 * Math.cos(angle);
          const y = 50 + 44 * Math.sin(angle) + (dir === 'N' ? -2 : dir === 'S' ? 2 : 0);
          return (
            <SvgText
              key={dir}
              x={x}
              y={y + 3}
              fontSize="10"
              fill="#557263"
              fontWeight="bold"
              opacity={0.11}
              textAnchor="middle"
              fontStyle="italic"
            >{dir}</SvgText>
          );
        })}
        {/* Center filled circle */}
        <Circle cx="50" cy="50" r="7" stroke="#557263" strokeWidth={1.5} fill="#557263" opacity={0.10} />
      </Svg>
    </View>
    {/* Sailing ship */}
    <View style={{ position: 'absolute', top: 120, right: -5, width: 120, height: 110 }}>
      <Svg width={120} height={110} viewBox="0 0 120 110">
        {/* Hull */}
        <Path d="M20 90 Q60 105 100 90 Q95 80 25 80 Q20 90 20 90" stroke="#8B6A3E" strokeWidth={1.7} fill="none" opacity={0.10} />
        {/* Masts */}
        <Line x1="45" y1="80" x2="45" y2="35" stroke="#8B6A3E" strokeWidth={1.5} opacity={0.10} />
        <Line x1="75" y1="80" x2="75" y2="45" stroke="#8B6A3E" strokeWidth={1.5} opacity={0.10} />
        {/* Sails */}
        <Path d="M45 35 L60 65 L45 65 Z" stroke="#8B6A3E" strokeWidth={1.2} fill="none" opacity={0.10} />
        <Path d="M75 45 L90 75 L75 75 Z" stroke="#8B6A3E" strokeWidth={1.2} fill="none" opacity={0.10} />
        <Path d="M45 65 L60 80 L45 80 Z" stroke="#8B6A3E" strokeWidth={1.2} fill="none" opacity={0.10} />
        {/* Flag */}
        <Path d="M45 35 L55 30 L45 30 Z" stroke="#8B6A3E" strokeWidth={1.2} fill="none" opacity={0.10} />
        {/* Waves */}
        {[0, 1, 2, 3].map(i => (
          <Path key={i} d={`M${30 + i * 18} 100 Q${39 + i * 18} ${104 - i * 2} ${48 + i * 18} 100`} stroke="#8B6A3E" strokeWidth={1.2} fill="none" opacity={0.10} />
        ))}
      </Svg>
    </View>
    {/* Dotted travel path */}
    <View style={{ position: 'absolute', top: 250, left: 40, width: 60, height: 200 }}>
      <Svg width={60} height={200} viewBox="0 0 60 200">
        <Path d="M30 10 Q50 60 20 100 Q40 140 30 190" stroke="#6B4F6B" strokeWidth={1.5} fill="none" opacity={0.10} strokeDasharray="4 4" />
        {/* Crosshair markers */}
        {[{x:40,y:60},{x:20,y:100},{x:35,y:170}].map((pt, i) => (
          <G key={i}>
            <Line x1={pt.x - 5} y1={pt.y} x2={pt.x + 5} y2={pt.y} stroke="#6B4F6B" strokeWidth={1.2} opacity={0.10} />
            <Line x1={pt.x} y1={pt.y - 5} x2={pt.x} y2={pt.y + 5} stroke="#6B4F6B" strokeWidth={1.2} opacity={0.10} />
          </G>
        ))}
      </Svg>
    </View>
    <Text style={{ position: 'absolute', top: 470, right: 12, fontSize: 8, opacity: 0.11, color: '#8B6A3E', fontStyle: 'italic' }}>43°N · 12°E</Text>

    {/* MID ZONE */}
    <View style={{ position: 'absolute', top: 540, left: -8, width: 140, height: 90 }}>
      <Svg width={140} height={90} viewBox="0 0 140 90">
        {/* Mountains */}
        <Path d="M10 85 L35 40 L60 85 Z" stroke="#4A6741" strokeWidth={1.7} fill="none" opacity={0.11} />
        <Path d="M35 85 L60 55 L85 85 Z" stroke="#4A6741" strokeWidth={1.7} fill="none" opacity={0.11} />
        <Path d="M60 85 L90 30 L120 85 Z" stroke="#4A6741" strokeWidth={2} fill="none" opacity={0.11} />
        <Path d="M90 85 L120 60 L135 85 Z" stroke="#4A6741" strokeWidth={1.7} fill="none" opacity={0.11} />
        {/* Snow cap */}
        <Path d="M90 40 Q100 30 110 40" stroke="#F6E5CD" strokeWidth={1.2} fill="none" opacity={0.11} />
        {/* Pines */}
        {[15, 40, 65, 100, 125].map((x, i) => (
          <G key={i}>
            <Path d={`M${x} 85 L${x + 2} 78 L${x + 4} 85 Z`} stroke="#4A6741" strokeWidth={1.2} fill="none" opacity={0.11} />
            <Line x1={x + 2} y1={85} x2={x + 2} y2={82} stroke="#4A6741" strokeWidth={1.2} opacity={0.11} />
          </G>
        ))}
      </Svg>
    </View>
    <View style={{ position: 'absolute', top: 650, right: -5, width: 90, height: 140 }}>
      <Svg width={90} height={140} viewBox="0 0 90 140">
        {/* Balloon envelope */}
        <Ellipse cx="45" cy="55" rx="36" ry="50" stroke="#6B4F6B" strokeWidth={1.7} fill="none" opacity={0.11} />
        {/* Panel lines */}
        {[...Array(5)].map((_,i) => (
          <Path key={i} d={`M45 5 L${45 + Math.round(36*Math.sin((i-2)*Math.PI/8))} 105`} stroke="#6B4F6B" strokeWidth={1.2} fill="none" opacity={0.11} />
        ))}
        {/* Equator band */}
        <Ellipse cx="45" cy="55" rx="36" ry="7" stroke="#6B4F6B" strokeWidth={1.2} fill="none" opacity={0.11} />
        {/* Ropes */}
        {[30, 45, 60, 45].map((x, i) => (
          <Line key={i} x1={x} y1={105} x2={45} y2={125} stroke="#6B4F6B" strokeWidth={1.2} opacity={0.11} />
        ))}
        {/* Basket */}
        <Rect x="35" y="125" width="20" height="10" stroke="#6B4F6B" strokeWidth={1.3} fill="none" opacity={0.11} />
      </Svg>
    </View>
    <View style={{ position: 'absolute', top: 820, left: 10, width: 80, height: 55 }}>
      <Svg width={80} height={55} viewBox="0 0 80 55">
        {/* Main circles */}
        <Circle cx="25" cy="30" r="14" stroke="#8B6A3E" strokeWidth={1.5} fill="none" opacity={0.09} />
        <Circle cx="55" cy="30" r="14" stroke="#8B6A3E" strokeWidth={1.5} fill="none" opacity={0.09} />
        {/* Eyepiece circles */}
        <Circle cx="25" cy="30" r="6" stroke="#8B6A3E" strokeWidth={1.2} fill="none" opacity={0.09} />
        <Circle cx="55" cy="30" r="6" stroke="#8B6A3E" strokeWidth={1.2} fill="none" opacity={0.09} />
        {/* Bridge bar */}
        <Rect x="25" y="26" width="30" height="8" stroke="#8B6A3E" strokeWidth={1.2} fill="none" opacity={0.09} />
        {/* Strap arc */}
        <Path d="M15 18 Q40 0 65 18" stroke="#8B6A3E" strokeWidth={1.2} fill="none" opacity={0.09} />
      </Svg>
    </View>
    <View style={{ position: 'absolute', top: 900, right: 5, width: 80, height: 80 }}>
      <Svg width={80} height={80} viewBox="0 0 80 80">
        {/* 16 radiating lines */}
        {[...Array(16)].map((_, i) => {
          const angle = (Math.PI / 8) * i;
          const x2 = 40 + 36 * Math.cos(angle);
          const y2 = 40 + 36 * Math.sin(angle);
          return (
            <Line key={i} x1="40" y1="40" x2={x2} y2={y2} stroke="#557263" strokeWidth={1.2} opacity={0.09} />
          );
        })}
        {/* Center circle */}
        <Circle cx="40" cy="40" r="4" stroke="#557263" strokeWidth={1.2} fill="#557263" opacity={0.09} />
        {/* Outer arc segments */}
        {[0, 4, 8, 12].map(i => {
          const start = (Math.PI / 8) * i;
          const end = start + Math.PI / 8;
          const r = 36;
          const x1 = 40 + r * Math.cos(start);
          const y1 = 40 + r * Math.sin(start);
          const x2 = 40 + r * Math.cos(end);
          const y2 = 40 + r * Math.sin(end);
          return (
            <Path key={i} d={`M${x1} ${y1} A${r} ${r} 0 0 1 ${x2} ${y2}`} stroke="#557263" strokeWidth={1.2} fill="none" opacity={0.09} />
          );
        })}
      </Svg>
    </View>
    <Text style={{ position: 'absolute', top: 1000, left: 8, fontSize: 8, opacity: 0.10, color: '#7B1D1D', fontStyle: 'italic' }}>here be dragons</Text>

    {/* LOWER-MID ZONE */}
    <View style={{ position: 'absolute', top: 1080, left: -8, width: 130, height: 110 }}>
      <Svg width={130} height={110} viewBox="0 0 130 110">
        {/* Curved branch */}
        <Path d="M20 100 Q60 30 120 80" stroke="#557263" strokeWidth={1.5} fill="none" opacity={0.10} />
        {/* Leaves */}
        {[{x:35,y:80},{x:50,y:60},{x:65,y:50},{x:80,y:65},{x:95,y:80},{x:60,y:95},{x:90,y:90},{x:110,y:70}].map((leaf,i) => (
          <Ellipse key={i} cx={leaf.x} cy={leaf.y} rx="8" ry="16" stroke="#557263" strokeWidth={1.2} fill="none" opacity={0.10} />
        ))}
        {/* Flowers */}
        {[{x:55,y:70},{x:75,y:75},{x:100,y:85},{x:115,y:75}].map((f,i) => (
          <G key={i}>
            <Circle cx={f.x} cy={f.y} r="6" stroke="#7B1D1D" strokeWidth={1.2} fill="none" opacity={0.10} />
            {[...Array(5)].map((_,j) => {
              const angle = (2 * Math.PI / 5) * j;
              const px = f.x + 8 * Math.cos(angle);
              const py = f.y + 8 * Math.sin(angle);
              return <Path key={`petal${i}-${j}`} d={`M${f.x},${f.y} Q${(f.x+px)/2},${(f.y+py)/2-3} ${px},${py}`} stroke="#7B1D1D" strokeWidth={1.1} fill="none" opacity={0.10} />;
            })}
          </G>
        ))}
        {/* Dot berries */}
        {[{x:40,y:90},{x:70,y:100},{x:105,y:95}].map((b,i) => (
          <Circle key={`berry${i}`} cx={b.x} cy={b.y} r="2.5" fill="#7B1D1D" opacity={0.10} />
        ))}
      </Svg>
    </View>
    <View style={{ position: 'absolute', top: 1220, right: 5, width: 85, height: 110 }}>
      <Svg width={85} height={110} viewBox="0 0 85 110">
        {/* Anchor shaft */}
        <Line x1="42.5" y1="25" x2="42.5" y2="80" stroke="#8B6A3E" strokeWidth={1.7} opacity={0.11} />
        {/* Crossbar */}
        <Line x1="28" y1="40" x2="57" y2="40" stroke="#8B6A3E" strokeWidth={1.5} opacity={0.11} />
        {/* Arms */}
        <Path d="M42.5 80 Q30 100 15 90" stroke="#8B6A3E" strokeWidth={1.7} fill="none" opacity={0.11} />
        <Path d="M42.5 80 Q55 100 70 90" stroke="#8B6A3E" strokeWidth={1.7} fill="none" opacity={0.11} />
        {/* Ball tips */}
        <Circle cx="15" cy="90" r="3" fill="#8B6A3E" opacity={0.11} />
        <Circle cx="70" cy="90" r="3" fill="#8B6A3E" opacity={0.11} />
        {/* Top ring */}
        <Circle cx="42.5" cy="25" r="6" stroke="#8B6A3E" strokeWidth={1.3} fill="none" opacity={0.11} />
        {/* Rope spiral */}
        <Path d="M42.5 15 Q50 10 55 25 Q60 40 42.5 45 Q25 50 30 25 Q35 10 42.5 15" stroke="#8B6A3E" strokeWidth={1.2} fill="none" opacity={0.11} />
      </Svg>
    </View>
    <View style={{ position: 'absolute', top: 1360, left: 5, width: 110, height: 70 }}>
      <Svg width={110} height={70} viewBox="0 0 110 70">
        {/* Perforated border */}
        <Rect x="10" y="10" width="90" height="50" stroke="#6B4F6B" strokeWidth={1.5} fill="none" opacity={0.11} strokeDasharray="3 3" />
        {/* Corner diamonds */}
        {[{x:10,y:10},{x:100,y:10},{x:10,y:60},{x:100,y:60}].map((d,i) => (
          <Path key={i} d={`M${d.x} ${d.y+3} L${d.x+3} ${d.y} L${d.x} ${d.y-3} L${d.x-3} ${d.y} Z`} stroke="#6B4F6B" strokeWidth={1.2} fill="none" opacity={0.11} />
        ))}
        {/* MEMORIES text */}
        <SvgText
          x="55"
          y="45"
          fontSize="13"
          fontWeight="bold"
          fill="#6B4F6B"
          opacity={0.11}
          textAnchor="middle"
          fontStyle="italic"
        >MEMORIES</SvgText>
      </Svg>
    </View>
    <View style={{ position: 'absolute', top: 1460, right: 8, width: 100, height: 60 }}>
      <Svg width={100} height={60} viewBox="0 0 100 60">
        {/* Hull */}
        <Path d="M20 40 Q50 10 80 40 Q70 50 30 50 Q20 40 20 40" stroke="#4A6741" strokeWidth={1.5} fill="none" opacity={0.09} />
        {/* Plank lines */}
        <Path d="M35 40 Q50 25 65 40" stroke="#4A6741" strokeWidth={1.2} fill="none" opacity={0.09} />
        <Path d="M40 45 Q50 35 60 45" stroke="#4A6741" strokeWidth={1.2} fill="none" opacity={0.09} />
        <Path d="M45 48 Q50 43 55 48" stroke="#4A6741" strokeWidth={1.2} fill="none" opacity={0.09} />
        {/* Oars crossing */}
        <Path d="M30 30 L70 50" stroke="#4A6741" strokeWidth={1.3} fill="none" opacity={0.09} />
        <Path d="M70 30 L30 50" stroke="#4A6741" strokeWidth={1.3} fill="none" opacity={0.09} />
        {/* Ripple waves */}
        <Path d="M35 55 Q50 60 65 55" stroke="#4A6741" strokeWidth={1.2} fill="none" opacity={0.09} />
      </Svg>
    </View>
    <View style={{ position: 'absolute', bottom: 650, left: 5, width: 110, height: 60 }}>
      <Svg width={110} height={60} viewBox="0 0 110 60">
        {/* Body */}
        <Path d="M20 40 L80 20 Q90 18 95 25 Q100 32 90 38 L30 55" stroke="#8B6A3E" strokeWidth={1.7} fill="none" opacity={0.10} />
        {/* Eyepiece */}
        <Circle cx="20" cy="40" r="5" stroke="#8B6A3E" strokeWidth={1.2} fill="none" opacity={0.10} />
        {/* Objective end */}
        <Circle cx="95" cy="25" r="6" stroke="#8B6A3E" strokeWidth={1.2} fill="none" opacity={0.10} />
        {/* Tripod legs */}
        <Path d="M30 55 L25 59" stroke="#8B6A3E" strokeWidth={1.2} fill="none" opacity={0.10} />
        <Path d="M30 55 L35 59" stroke="#8B6A3E" strokeWidth={1.2} fill="none" opacity={0.10} />
        {/* Star burst */}
        {[...Array(8)].map((_,i) => {
          const angle = (Math.PI/4)*i;
          const x2 = 95 + 10*Math.cos(angle);
          const y2 = 25 + 10*Math.sin(angle);
          return <Line key={i} x1={95} y1={25} x2={x2} y2={y2} stroke="#8B6A3E" strokeWidth={1.1} opacity={0.10} />;
        })}
      </Svg>
    </View>
    <View style={{ position: 'absolute', bottom: 420, left: 8, width: 120, height: 70 }}>
      <Svg width={120} height={70} viewBox="0 0 120 70">
        {/* Oval frame */}
        <Ellipse cx="60" cy="35" rx="50" ry="28" stroke="#557263" strokeWidth={1.7} fill="none" opacity={0.10} />
        {/* Scrollwork flourishes */}
        <Path d="M10 35 Q0 10 30 15 Q10 60 60 60" stroke="#557263" strokeWidth={1.2} fill="none" opacity={0.10} />
        <Path d="M110 35 Q120 10 90 15 Q110 60 60 60" stroke="#557263" strokeWidth={1.2} fill="none" opacity={0.10} />
        {/* ATLAS text */}
        <SvgText
          x="60"
          y="44"
          fontSize="15"
          fontWeight="bold"
          fill="#557263"
          opacity={0.10}
          textAnchor="middle"
          fontStyle="italic"
        >ATLAS</SvgText>
      </Svg>
    </View>
    <View style={{ position: 'absolute', bottom: 480, right: 5, width: 100, height: 120 }}>
      <Svg width={100} height={120} viewBox="0 0 100 120">
        {/* Stars */}
        {[
          {x:20,y:30,r:2}, {x:40,y:20,r:2}, {x:60,y:35,r:2}, {x:80,y:25,r:2},
          {x:30,y:60,r:2}, {x:55,y:60,r:2}, {x:75,y:70,r:2}, {x:50,y:90,r:2},
          {x:70,y:100,r:2}
        ].map((s,i) => (
          <Circle key={i} cx={s.x} cy={s.y} r={i===1||i===3||i===7?3:2} fill="#6B4F6B" opacity={0.11} />
        ))}
        {/* Connecting lines */}
        {[
          [0,1],[1,2],[2,3],[1,4],[4,5],[5,6],[6,7],[7,8]
        ].map(([a,b],i) => (
          <Line key={i} x1={[20,40,60,80,30,55,75,50,70][a]} y1={[30,20,35,25,60,60,70,90,100][a]} x2={[20,40,60,80,30,55,75,50,70][b]} y2={[30,20,35,25,60,60,70,90,100][b]} stroke="#6B4F6B" strokeWidth={1.2} opacity={0.11} />
        ))}
      </Svg>
    </View>
    {/* Wave border */}
    <View style={{ position: 'absolute', bottom: 350, left: 0, width: '100%', height: 40 }}>
      <Svg width="100%" height={40} viewBox="0 0 400 40">
        <Path d="M0 20 Q25 0 50 20 T100 20 T150 20 T200 20 T250 20 T300 20 T350 20 T400 20" stroke="#8B6A3E" strokeWidth={1.5} fill="none" opacity={0.10} strokeDasharray="6 3" />
      </Svg>
    </View>
    <Text style={{ position: 'absolute', bottom: 300, right: 10, fontSize: 8, opacity: 0.11, color: '#4A6741', fontStyle: 'italic' }}>~ est. 2026 ~</Text>
    {/* Decorative divider */}
    <View style={{ position: 'absolute', bottom: 320, left: 20, width: 140, height: 20 }}>
      <Svg width={140} height={20} viewBox="0 0 140 20">
        {/* Main line */}
        <Line x1="10" y1="10" x2="130" y2="10" stroke="#8B6A3E" strokeWidth={1.3} opacity={0.10} />
        {/* Center diamond */}
        <Path d="M70 10 L75 15 L70 20 L65 15 Z" stroke="#8B6A3E" strokeWidth={1.2} fill="none" opacity={0.10} />
        {/* End diamonds */}
        <Path d="M10 10 L13 13 L10 16 L7 13 Z" stroke="#8B6A3E" strokeWidth={1.1} fill="none" opacity={0.10} />
        <Path d="M130 10 L133 13 L130 16 L127 13 Z" stroke="#8B6A3E" strokeWidth={1.1} fill="none" opacity={0.10} />
        {/* Tick marks */}
        {[20,40,60,80,100,120].map((x,i) => (
          <Line key={i} x1={x} y1="7" x2={x} y2="13" stroke="#8B6A3E" strokeWidth={1} opacity={0.10} />
        ))}
      </Svg>
    </View>
  </View>
);

// Scene object SVGs for each category
function BirthdayScene({ variant }: { variant: number }) {
  if (variant === 1) {
    // Birthday Cake
    return (
      <Svg width={90} height={90} viewBox="0 0 90 90">
        {/* Bottom tier */}
        <Rect x={14} y={62} width={62} height={18} rx={4} fill="#E8A5A5" stroke="#2C1810" strokeWidth={1.8} />
        {/* Top tier */}
        <Rect x={24} y={44} width={42} height={20} rx={4} fill="#B8A8C8" stroke="#2C1810" strokeWidth={1.8} />
        {/* Frosting drips */}
        <Path d="M14,62 Q22,56 30,62 Q38,56 46,62 Q54,56 62,62 Q70,56 76,62" fill="#FFF8F0" stroke="#2C1810" strokeWidth={2} />
        {/* Candles */}
        <Rect x={32} y={34} width={6} height={12} rx={2} fill="#FFF8F0" stroke="#2C1810" strokeWidth={2} />
        <Rect x={42} y={34} width={6} height={12} rx={2} fill="#FFF8F0" stroke="#2C1810" strokeWidth={2} />
        <Rect x={52} y={34} width={6} height={12} rx={2} fill="#FFF8F0" stroke="#2C1810" strokeWidth={2} />
        {/* Flames */}
        <Path d="M35,34 Q38,26 41,34" fill="#E8A5A5" stroke="#2C1810" strokeWidth={1.5} />
        <Path d="M45,34 Q48,26 51,34" fill="#E8A5A5" stroke="#2C1810" strokeWidth={1.5} />
        <Path d="M55,34 Q58,26 61,34" fill="#E8A5A5" stroke="#2C1810" strokeWidth={1.5} />
        {/* Dots on bottom tier */}
        <Circle cx={30} cy={72} r={3} fill="#FFF8F0" stroke="#2C1810" strokeWidth={1.5} />
        <Circle cx={45} cy={72} r={3} fill="#FFF8F0" stroke="#2C1810" strokeWidth={1.5} />
        <Circle cx={60} cy={72} r={3} fill="#FFF8F0" stroke="#2C1810" strokeWidth={1.5} />
      </Svg>
    );
  }
  if (variant === 2) {
    // Gift Box
    return (
      <Svg width={90} height={90} viewBox="0 0 90 90">
        {/* Box body */}
        <Rect x={16} y={44} width={58} height={38} rx={4} fill="#A8BEC8" stroke="#2C1810" strokeWidth={1.8} />
        {/* Box lid */}
        <Rect x={12} y={34} width={66} height={14} rx={4} fill="#A8BEC8" stroke="#2C1810" strokeWidth={1.8} />
        {/* Vertical ribbon */}
        <Rect x={41} y={34} width={8} height={48} rx={2} fill="#E8A5A5" stroke="#2C1810" strokeWidth={2} />
        {/* Horizontal ribbon */}
        <Rect x={12} y={38} width={66} height={8} rx={2} fill="#E8A5A5" stroke="#2C1810" strokeWidth={2} />
        {/* Bow left loop */}
        <Path d="M45,34 Q30,20 28,30 Q30,38 45,34" fill="#E8A5A5" stroke="#2C1810" strokeWidth={2.5} />
        {/* Bow right loop */}
        <Path d="M45,34 Q60,20 62,30 Q60,38 45,34" fill="#E8A5A5" stroke="#2C1810" strokeWidth={2.5} />
        {/* Bow center */}
        <Circle cx={45} cy={34} r={5} fill="#FFF8F0" stroke="#2C1810" strokeWidth={2} />
        {/* Star */}
        <Path d="M45,52 L47,58 L53,58 L48,62 L49,68 L45,56 L40,68 L42,62 L37,58 L43,58 Z" fill="#FFF8F0" stroke="#2C1810" strokeWidth={1.5} />
      </Svg>
    );
  }
  // Default: Party Hat
  return (
    <Svg width={90} height={90} viewBox="0 0 90 90">
      {/* Hat body */}
      <Path d="M45,10 L16,74 L74,74 Z" fill="#E8A5A5" stroke="#2C1810" strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round" />
      {/* Brim ellipse */}
      <Ellipse cx={45} cy={74} rx={29} ry={9} fill="#E8A5A5" stroke="#2C1810" strokeWidth={1.8} />
      {/* Pompom */}
      <Circle cx={45} cy={10} r={7} fill="#FFF8F0" stroke="#2C1810" strokeWidth={2.5} />
      {/* Band */}
      <Path d="M28,50 Q45,44 62,50" stroke="#2C1810" strokeWidth={2} fill="none" strokeDasharray="3 3" />
      {/* Dots */}
      <Circle cx={20} cy={35} r={5} fill="#B8A8C8" stroke="#2C1810" strokeWidth={2} />
      <Circle cx={72} cy={30} r={5} fill="#A8BEC8" stroke="#2C1810" strokeWidth={2} />
      <Circle cx={70} cy={55} r={4} fill="#A8C5B5" stroke="#2C1810" strokeWidth={2} />
    </Svg>
  );
}

function TravelScene({ variant }: { variant: number }) {
  if (variant === 1) {
    // Compass Rose
    return (
      <Svg width={90} height={90} viewBox="0 0 90 90">
        {/* Outer circle */}
        <Circle cx={45} cy={45} r={36} fill="none" stroke="#A8C5B5" strokeWidth={2.5} />
        {/* Inner circle */}
        <Circle cx={45} cy={45} r={10} fill="#A8C5B5" stroke="#2C1810" strokeWidth={2.5} />
        {/* Main points */}
        <Path d="M45,9 L50,35 L45,45 L40,35 Z" fill="#E8A5A5" stroke="#2C1810" strokeWidth={2} />
        <Path d="M45,81 L50,55 L45,45 L40,55 Z" fill="#E8A5A5" stroke="#2C1810" strokeWidth={2} />
        <Path d="M81,45 L55,40 L45,45 L55,50 Z" fill="#FFF8F0" stroke="#2C1810" strokeWidth={2} />
        <Path d="M9,45 L35,40 L45,45 L35,50 Z" fill="#FFF8F0" stroke="#2C1810" strokeWidth={2} />
        {/* Minor points */}
        <G transform="rotate(45 45 45)">
          <Path d="M45,15 L48,35 L45,45 L42,35 Z" fill="#A8BEC8" stroke="#2C1810" strokeWidth={1.5} />
        </G>
        <G transform="rotate(135 45 45)">
          <Path d="M45,15 L48,35 L45,45 L42,35 Z" fill="#A8BEC8" stroke="#2C1810" strokeWidth={1.5} />
        </G>
        <G transform="rotate(225 45 45)">
          <Path d="M45,15 L48,35 L45,45 L42,35 Z" fill="#A8BEC8" stroke="#2C1810" strokeWidth={1.5} />
        </G>
        <G transform="rotate(315 45 45)">
          <Path d="M45,15 L48,35 L45,45 L42,35 Z" fill="#A8BEC8" stroke="#2C1810" strokeWidth={1.5} />
        </G>
      </Svg>
    );
  }
  if (variant === 2) {
    // Hot Air Balloon
    return (
      <Svg width={90} height={90} viewBox="0 0 90 90">
        {/* Envelope */}
        <Path d="M45,12 Q78,12 78,45 Q78,68 45,78 Q12,68 12,45 Q12,12 45,12 Z" fill="#B8A8C8" stroke="#2C1810" strokeWidth={1.8} />
        {/* Vertical stripe */}
        <Path d="M45,12 Q50,45 45,78" stroke="#2C1810" strokeWidth={2} fill="none" />
        {/* Horizontal band */}
        <Path d="M12,45 Q45,50 78,45" stroke="#2C1810" strokeWidth={2} fill="none" />
        {/* Ropes */}
        <Line x1={30} y1={75} x2={34} y2={84} stroke="#2C1810" strokeWidth={2} />
        <Line x1={38} y1={78} x2={38} y2={84} stroke="#2C1810" strokeWidth={2} />
        <Line x1={52} y1={78} x2={52} y2={84} stroke="#2C1810" strokeWidth={2} />
        <Line x1={60} y1={75} x2={56} y2={84} stroke="#2C1810" strokeWidth={2} />
        {/* Basket */}
        <Rect x={34} y={84} width={22} height={10} rx={3} fill="#C89898" stroke="#2C1810" strokeWidth={2.5} />
      </Svg>
    );
  }
  // Default: Castle Tower
  return (
    <Svg width={90} height={90} viewBox="0 0 90 90">
      {/* Tower body */}
      <Rect x={28} y={34} width={34} height={44} fill="#A8C5B5" stroke="#2C1810" strokeWidth={3} />
      {/* Merlons */}
      <Rect x={28} y={22} width={9} height={13} fill="#A8C5B5" stroke="#2C1810" strokeWidth={3} />
      <Rect x={40} y={22} width={9} height={13} fill="#A8C5B5" stroke="#2C1810" strokeWidth={3} />
      <Rect x={53} y={22} width={9} height={13} fill="#A8C5B5" stroke="#2C1810" strokeWidth={3} />
      {/* Arched window */}
      <Path d="M38,44 L38,60 Q45,68 52,60 L52,44 Z" fill="#FFF8F0" stroke="#2C1810" strokeWidth={2.5} />
      {/* Flag pole */}
      <Line x1={45} y1={22} x2={45} y2={10} stroke="#2C1810" strokeWidth={2.5} />
      {/* Flag */}
      <Path d="M45,10 L60,15 L45,20 Z" fill="#E8A5A5" stroke="#2C1810" strokeWidth={2} />
    </Svg>
  );
}

function GardenScene({ variant }: { variant: number }) {
  if (variant === 1) {
    // Potted Plant
    return (
      <Svg width={90} height={90} viewBox="0 0 90 90">
        {/* Pot body */}
        <Path d="M26,82 L32,52 L58,52 L64,82 Z" fill="#C89898" stroke="#2C1810" strokeWidth={3} />
        {/* Pot rim */}
        <Ellipse cx={45} cy={52} rx={16} ry={6} fill="#C89898" stroke="#2C1810" strokeWidth={3} />
        {/* Soil */}
        <Ellipse cx={45} cy={52} rx={13} ry={4} fill="#2C1810" opacity={0.3} />
        {/* Main stem */}
        <Line x1={45} y1={52} x2={45} y2={28} stroke="#2C1810" strokeWidth={3} />
        {/* Left branch */}
        <Path d="M45,38 Q30,30 24,18" stroke="#2C1810" strokeWidth={2.5} fill="none" />
        {/* Right branch */}
        <Path d="M45,34 Q60,26 66,14" stroke="#2C1810" strokeWidth={2.5} fill="none" />
        {/* Left leaf */}
        <Ellipse cx={22} cy={16} rx={10} ry={15} fill="#A8C5B5" stroke="#2C1810" strokeWidth={2.5} transform="rotate(-20 22 16)" />
        {/* Right leaf */}
        <Ellipse cx={68} cy={12} rx={10} ry={15} fill="#A8C5B5" stroke="#2C1810" strokeWidth={2.5} transform="rotate(20 68 12)" />
        {/* Top leaf */}
        <Ellipse cx={45} cy={18} rx={10} ry={15} fill="#A8C5B5" stroke="#2C1810" strokeWidth={2.5} />
      </Svg>
    );
  }
  if (variant === 2) {
    // Mushroom
    return (
      <Svg width={90} height={90} viewBox="0 0 90 90">
        {/* Stem */}
        <Rect x={33} y={52} width={24} height={28} rx={8} fill="#FFF8F0" stroke="#2C1810" strokeWidth={1.8} />
        {/* Stem detail */}
        <Path d="M36,60 Q45,56 54,60" stroke="#2C1810" strokeWidth={1.5} fill="none" />
        {/* Cap */}
        <Path d="M10,52 Q10,14 45,14 Q80,14 80,52 Z" fill="#E8A5A5" stroke="#2C1810" strokeWidth={1.8} />
        {/* Spots */}
        <Circle cx={30} cy={36} r={7} fill="#FFF8F0" stroke="#2C1810" strokeWidth={2} />
        <Circle cx={55} cy={28} r={9} fill="#FFF8F0" stroke="#2C1810" strokeWidth={2} />
        <Circle cx={64} cy={44} r={6} fill="#FFF8F0" stroke="#2C1810" strokeWidth={2} />
      </Svg>
    );
  }
  // variant === 0: Symmetric flower with rotated petals
  return (
    <Svg width={90} height={90} viewBox="0 0 90 90">
      <G>
        {[0, 72, 144, 216, 288].map((angle, i) => (
          <G key={i} transform={`rotate(${angle} 45 38)`}>
            <Ellipse 
              cx={45} cy={20} rx={9} ry={17}
              fill="#FFF8F0" stroke="#2C1810" strokeWidth={2.5}
            />
          </G>
        ))}
        {/* Center circle */}
        <Circle cx={45} cy={38} r={11} fill="#E8A5A5" stroke="#2C1810" strokeWidth={2.5} />
        {/* Center dot detail */}
        <Circle cx={45} cy={38} r={4} fill="#FFF8F0" stroke="#2C1810" strokeWidth={1.5} />
        {/* Stem */}
        <Line x1={45} y1={49} x2={45} y2={78} stroke="#2C1810" strokeWidth={3.5} strokeLinecap="round" />
        {/* Left leaf */}
        <G transform="rotate(-35 38 65)">
          <Ellipse cx={38} cy={65} rx={8} ry={14} fill="#A8C5B5" stroke="#2C1810" strokeWidth={2.5} />
        </G>
        {/* Right leaf */}
        <G transform="rotate(35 52 65)">
          <Ellipse cx={52} cy={65} rx={8} ry={14} fill="#A8C5B5" stroke="#2C1810" strokeWidth={2.5} />
        </G>
      </G>
    </Svg>
  );
}

function PromScene({ variant }: { variant: number }) {
  if (variant === 1) {
    // Disco Ball / Sparkle
    return (
      <Svg width={90} height={90} viewBox="0 0 90 90">
        {/* Ball */}
        <Circle cx={45} cy={42} r={30} fill="#B8A8C8" stroke="#2C1810" strokeWidth={1.8} />
        {/* Horizontal lines */}
        <Line x1={16} y1={22} x2={74} y2={22} stroke="#2C1810" strokeWidth={1.5} />
        <Line x1={16} y1={32} x2={74} y2={32} stroke="#2C1810" strokeWidth={1.5} />
        <Line x1={16} y1={42} x2={74} y2={42} stroke="#2C1810" strokeWidth={1.5} />
        <Line x1={16} y1={52} x2={74} y2={52} stroke="#2C1810" strokeWidth={1.5} />
        <Line x1={16} y1={62} x2={74} y2={62} stroke="#2C1810" strokeWidth={1.5} />
        {/* Vertical curves */}
        <Path d="M45,12 Q55,42 45,72" stroke="#2C1810" strokeWidth={1.5} fill="none" />
        <Path d="M45,12 Q65,42 55,72" stroke="#2C1810" strokeWidth={1.5} fill="none" />
        <Path d="M45,12 Q25,42 35,72" stroke="#2C1810" strokeWidth={1.5} fill="none" />
        {/* Hanging string */}
        <Line x1={45} y1={12} x2={45} y2={4} stroke="#2C1810" strokeWidth={2.5} />
        {/* Sparkle stars */}
        <Path d="M15,20 L17,14 L19,20 L25,22 L19,24 L17,30 L15,24 L9,22 Z" fill="#E8A5A5" stroke="#2C1810" strokeWidth={1.5} />
        <Path d="M75,20 L77,14 L79,20 L85,22 L79,24 L77,30 L75,24 L69,22 Z" fill="#E8A5A5" stroke="#2C1810" strokeWidth={1.5} />
        <Path d="M15,64 L17,58 L19,64 L25,66 L19,68 L17,74 L15,68 L9,66 Z" fill="#E8A5A5" stroke="#2C1810" strokeWidth={1.5} />
        <Path d="M75,64 L77,58 L79,64 L85,66 L79,68 L77,74 L75,68 L69,66 Z" fill="#E8A5A5" stroke="#2C1810" strokeWidth={1.5} />
      </Svg>
    );
  }
  // Default: Crown
  return (
    <Svg width={90} height={90} viewBox="0 0 90 90">
      {/* Crown body */}
      <Path d="M8,70 L8,40 L24,55 L45,16 L66,55 L82,40 L82,70 Z" fill="#B8A8C8" stroke="#2C1810" strokeWidth={3} strokeLinejoin="round" />
      {/* Base band */}
      <Rect x={8} y={62} width={74} height={12} rx={3} fill="#B8A8C8" stroke="#2C1810" strokeWidth={3} />
      {/* Gems */}
      <Circle cx={8} cy={40} r={5} fill="#E8A5A5" stroke="#2C1810" strokeWidth={2} />
      <Circle cx={45} cy={16} r={7} fill="#E8A5A5" stroke="#2C1810" strokeWidth={2} />
      <Circle cx={82} cy={40} r={5} fill="#E8A5A5" stroke="#2C1810" strokeWidth={2} />
      {/* Band dots */}
      <Circle cx={24} cy={68} r={3} fill="#FFF8F0" stroke="#2C1810" strokeWidth={1.5} />
      <Circle cx={45} cy={68} r={3} fill="#FFF8F0" stroke="#2C1810" strokeWidth={1.5} />
      <Circle cx={66} cy={68} r={3} fill="#FFF8F0" stroke="#2C1810" strokeWidth={1.5} />
    </Svg>
  );
}

function FamilyScene({ variant }: { variant: number }) {
  if (variant === 1) {
    // Polaroid Photo
    return (
      <Svg width={90} height={90} viewBox="0 0 90 90">
        {/* Outer frame */}
        <Rect x={14} y={10} width={62} height={72} rx={4} fill="#FFF8F0" stroke="#2C1810" strokeWidth={3} />
        {/* Photo area */}
        <Rect x={20} y={16} width={50} height={46} rx={2} fill="#A8BEC8" stroke="#2C1810" strokeWidth={2} />
        {/* Mountains */}
        <Path d="M20,50 L35,30 L50,50 Z" fill="#A8C5B5" stroke="#2C1810" strokeWidth={2} />
        <Path d="M34,50 L48,36 L62,50 Z" fill="#B8A8C8" stroke="#2C1810" strokeWidth={2} />
        <Circle cx={58} cy={22} r={8} fill="#E8A5A5" stroke="#2C1810" strokeWidth={2} />
        {/* Caption line */}
        <Rect x={28} y={70} width={34} height={5} rx={2} fill="#C89898" stroke="#2C1810" strokeWidth={1.5} />
        {/* Heart sticker */}
        <Circle cx={61} cy={72} r={4} fill="#E8A5A5" stroke="#2C1810" strokeWidth={1.5} />
        <Circle cx={67} cy={72} r={4} fill="#E8A5A5" stroke="#2C1810" strokeWidth={1.5} />
        <Path d="M57,74 L64,82 L71,74 Z" fill="#E8A5A5" stroke="#2C1810" strokeWidth={1.5} />
      </Svg>
    );
  }
  // Default: House
  return (
    <Svg width={90} height={90} viewBox="0 0 90 90">
      {/* House body */}
      <Rect x={12} y={44} width={66} height={38} rx={3} fill="#A8BEC8" stroke="#2C1810" strokeWidth={1.8} />
      {/* Roof */}
      <Path d="M6,46 L45,14 L84,46 Z" fill="#E8A5A5" stroke="#2C1810" strokeWidth={1.8} strokeLinejoin="round" />
      {/* Chimney */}
      <Rect x={60} y={20} width={12} height={18} rx={2} fill="#C89898" stroke="#2C1810" strokeWidth={2.5} />
      {/* Door */}
      <Rect x={36} y={60} width={18} height={22} rx={9} fill="#FFF8F0" stroke="#2C1810" strokeWidth={2.5} />
      <Circle cx={50} cy={72} r={2.5} fill="#2C1810" />
      {/* Left window */}
      <Rect x={16} y={52} width={16} height={14} rx={2} fill="#FFF8F0" stroke="#2C1810" strokeWidth={2.5} />
      <Line x1={16} y1={59} x2={32} y2={59} stroke="#2C1810" strokeWidth={1.5} />
      <Line x1={24} y1={52} x2={24} y2={66} stroke="#2C1810" strokeWidth={1.5} />
      {/* Right window */}
      <Rect x={58} y={52} width={16} height={14} rx={2} fill="#FFF8F0" stroke="#2C1810" strokeWidth={2.5} />
      <Line x1={58} y1={59} x2={74} y2={59} stroke="#2C1810" strokeWidth={1.5} />
      <Line x1={66} y1={52} x2={66} y2={66} stroke="#2C1810" strokeWidth={1.5} />
      {/* Smoke puffs */}
      <Circle cx={66} cy={14} r={5} fill="#FFF8F0" stroke="#2C1810" strokeWidth={2} />
      <Circle cx={72} cy={9} r={4} fill="#FFF8F0" stroke="#2C1810" strokeWidth={2} />
    </Svg>
  );
}

function getSceneObjects(title: string, variant: number) {
  const t = title.toLowerCase();
  if (t.includes('birthday') || t.includes('bday')) return <BirthdayScene variant={variant} />;
  if (t.includes('trip') || t.includes('travel') || t.includes('prague') || t.includes('flight')) return <TravelScene variant={variant} />;
  if (t.includes('garden') || t.includes('plant') || t.includes('flower')) return <GardenScene variant={variant} />;
  if (t.includes('prom') || t.includes('dance') || t.includes('formal')) return <PromScene variant={variant % 2} />;
  if (t.includes('mom') || t.includes('dad') || t.includes('family') || t.includes('home')) return <FamilyScene variant={variant % 2} />;
  // ...existing code for other scenes...
  // fallback: blank SVG
  return (
    <Svg width={90} height={90} viewBox="0 0 90 90">
      <Rect x={10} y={10} width={70} height={70} rx={12} fill="#FFF8F0" stroke="#2C1810" strokeWidth={2} />
    </Svg>
  );
}

export default function TimelineScreen() {
  const [items, setItems] = useState<Stamp[]>([]);
  const [loading, setLoading] = useState(false);
  const [monthOpen, setMonthOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('March');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedStamp, setSelectedStamp] = useState<Stamp | null>(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const years = ['2023', '2024', '2025', '2026'];

  useEffect(() => {
    const firstBatch = MOCK_API.data.slice(0, 5);
    setItems(firstBatch);
  }, []);

  const fetchNextPage = async () => {
    if (loading || items.length >= MOCK_API.data.length) return;
    setLoading(true);
    setTimeout(() => {
      const start = items.length;
      const end = start + 5;
      const nextBatch = MOCK_API.data.slice(start, end);
      setItems((existingItems) => [...existingItems, ...nextBatch]);
      setLoading(false);
    }, 100);
  };

  const renderTimelineItem = ({ item, index }: { item: Stamp; index: number }) => {
    const isEven = index % 2 === 0;
    const stampWidth = SCREEN_WIDTH * 0.38;
    const isSelected = selectedStamp?.id === item.id;
    const accentColor = ILLUSTRATION_COLORS[index % ILLUSTRATION_COLORS.length];
    const variant = parseInt(item.id) % 3;
    return (
      <View style={styles.row}>
        <CurvedTimelinePath isEven={isEven} />
        <View style={[styles.stampGroup, { alignSelf: isEven ? 'flex-start' : 'flex-end' }]}> 
          <View style={[styles.stampCard, { width: stampWidth, borderLeftWidth: 5, borderLeftColor: accentColor }]}> 
            <Pressable onPress={() => setSelectedStamp(isSelected ? null : item)}>
              <View style={{ borderStyle: 'dashed', borderColor: '#C8B89A', borderWidth: 2, margin: 4, borderRadius: 4 }}>
                <View style={styles.stampImageWrapper}>
                  <Image source={item.image} style={[styles.stampImage, { height: 110 }]} />
                </View>
              </View>
              <View style={[styles.labelBar, { backgroundColor: accentColor, borderBottomWidth: 2, borderBottomColor: accentColor }]}> 
                <Text style={styles.labelTitle} numberOfLines={1}>{item.title}</Text>
              </View>
            </Pressable>
          </View>
          <Text style={{ fontStyle: 'italic', color: accentColor, fontSize: 11, marginTop: 6, textAlign: 'center' }}>{item.date}</Text>
          {isSelected && (
            <View style={styles.infoPopup}>
              <Text style={styles.infoTitle}>{item.title}</Text>
              <Text style={styles.infoDate}>{item.date}</Text>
              <Pressable style={styles.infoButton} onPress={() => router.push({ pathname: '/bulletin-board', params: { id: item.id, title: item.title } })}>
                <Text style={styles.infoButtonText}>Open Folder</Text>
              </Pressable>
            </View>
          )}
        </View>
        {/* Scene objects on opposite side of card */}
        <View
          style={{
            position: 'absolute',
            [isEven ? 'right' : 'left']: 30,
            top: 40,
            zIndex: 2,
            pointerEvents: 'none',
            transform: [{ rotate: isEven ? '3deg' : '-3deg' }],
            shadowColor: '#5C3D1E',
            shadowOffset: { width: 3, height: 5 },
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 6,
          }}
        >
          {/* Blob/cloud sticker backing */}
          {(() => {
            const blobPaths = [
              // Blob 0 - puffy left side
              "M55,8 Q70,2 80,12 Q92,8 98,20 Q108,28 104,42 Q112,54 104,64 Q108,76 96,82 Q92,96 78,98 Q66,108 52,102 Q40,110 28,102 Q14,100 10,86 Q0,76 6,62 Q-2,48 8,36 Q6,22 18,16 Q28,4 42,8 Q48,4 55,8 Z",
              // Blob 1 - puffy top
              "M55,5 Q68,0 78,10 Q90,4 100,16 Q112,22 108,38 Q116,50 106,62 Q110,74 98,82 Q96,96 80,100 Q68,112 52,104 Q38,112 24,104 Q10,98 8,84 Q-2,72 6,58 Q-4,44 8,32 Q8,16 22,12 Q32,2 45,6 Q50,3 55,5 Z",
              // Blob 2 - puffy right side  
              "M58,6 Q72,0 84,10 Q96,6 102,20 Q114,26 110,42 Q118,56 106,66 Q108,80 94,86 Q88,100 72,102 Q60,112 44,106 Q30,112 18,102 Q4,96 4,80 Q-6,68 4,54 Q-2,40 10,28 Q10,14 24,10 Q36,2 48,6 Q52,4 58,6 Z"
            ];
            const blobPath = blobPaths[index % 3];
            return (
              <Svg
                width={110}
                height={110}
                viewBox="0 0 110 110"
                style={{
                  position: 'absolute',
                  top: -10,
                  left: -10,
                  zIndex: 0,
                }}
              >
                <Path
                  d={blobPath}
                  fill="#EDE4D0"
                  opacity={0.88}
                  style={{
                    shadowColor: '#5C3D1E',
                    shadowOffset: { width: 2, height: 4 },
                    shadowOpacity: 0.30,
                    shadowRadius: 8,
                  }}
                />
              </Svg>
            );
          })()}
          {/* The illustration itself */}
          <View style={{ width: 90, height: 90, opacity: 0.88, zIndex: 1 }}>
            {getSceneObjects(item.title, variant)}
          </View>
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
        <SafeAreaView style={styles.safeArea}>
          <Pressable style={{ flex: 1 }} onPress={closeAllDropdowns} pointerEvents="box-none" accessible={false}>
            <View style={{ flex: 1 }}>
              <View style={styles.header}>
                <Text style={styles.welcomeBackHeader}>Welcome Back, Name</Text>
                <View style={styles.dropdownRow}>
                  <View style={styles.dropdownWrapper}>
                    <Pressable style={styles.dropdownButton} onPress={() => { setMonthOpen(!monthOpen); if (yearOpen) setYearOpen(false); }}>
                      <View style={styles.dropdownInner}>
                        <Text style={styles.dropdownText}>{selectedMonth}</Text>
                        <Text style={styles.dropdownArrow}>▾</Text>
                      </View>
                    </Pressable>
                    {monthOpen && (
                      <View style={styles.dropdownList}>
                        {months.map((month) => (
                          <Pressable key={month} style={styles.dropdownItem} onPress={() => { setSelectedMonth(month); setMonthOpen(false); }}>
                            <Text style={styles.dropdownItemText}>{month}</Text>
                          </Pressable>
                        ))}
                      </View>
                    )}
                  </View>
                  <View style={styles.dropdownWrapper}>
                    <Pressable style={styles.dropdownButton} onPress={() => { setYearOpen(!yearOpen); if (monthOpen) setMonthOpen(false); }}>
                      <View style={styles.dropdownInner}>
                        <Text style={styles.dropdownText}>{selectedYear}</Text>
                        <Text style={styles.dropdownArrow}>▾</Text>
                      </View>
                    </Pressable>
                    {yearOpen && (
                      <View style={styles.dropdownList}>
                        {years.map((year) => (
                          <Pressable key={year} style={styles.dropdownItem} onPress={() => { setSelectedYear(year); setYearOpen(false); }}>
                            <Text style={styles.dropdownItemText}>{year}</Text>
                          </Pressable>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              </View>
              <View style={styles.paperContainer}>
                <ImageBackground source={require('../../assets/images/layered-vintage-paper.png')} style={styles.paperBackground}>
                  <View style={{ flex: 1 }}>
                    <BackgroundIllustrations />
                    <FlatList
                      style={{ flex: 1 }}
                      data={items}
                      keyExtractor={(item, index) => item.id + index}
                      renderItem={renderTimelineItem}
                      onEndReached={fetchNextPage}
                      onEndReachedThreshold={0.5}
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={{ paddingBottom: 120 }}
                      ListFooterComponent={() => (
                        <View style={styles.footerContainer}>
                          {loading ? (
                            <ActivityIndicator size="large" color="#7B1D1D" />
                          ) : (
                            <Text style={styles.footerText}>
                              {items.length >= MOCK_API.data.length ? 'Making Memories since *Birth Year* ✦' : 'Scroll for more'}
                            </Text>
                          )}
                        </View>
                      )}
                    />
                  </View>
                </ImageBackground>
              </View>
            </View>
          </Pressable>
          <View style={styles.navbarWrapper}>
            <BottomNavbar />
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#7B1D1D' },
  outerBackground: { flex: 1, width: '100%', height: '100%' },
  outerBackgroundImage: { resizeMode: 'cover', opacity: 0.12 },
  safeArea: { flex: 1, paddingTop: 12, paddingHorizontal: 20 },
  header: { paddingBottom: 8 },
  welcomeBackHeader: { fontFamily: 'Calistoga', fontSize: 28, color: '#F6E5CD', marginBottom: 14, textAlign: 'center' },
  dropdownRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12, width: '100%' },
  dropdownWrapper: { flexShrink: 0 },
  dropdownButton: { backgroundColor: 'rgba(246,229,205,0.15)', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 14, borderWidth: 1, borderColor: 'rgba(246,229,205,0.3)' },
  dropdownInner: { flexDirection: 'row', alignItems: 'center' },
  dropdownText: { color: '#F6E5CD', fontSize: 15, fontWeight: '600', fontFamily: 'Inter', marginRight: 4 },
  dropdownArrow: { color: '#F6E5CD', fontSize: 14 },
  dropdownList: { marginTop: 6, borderRadius: 12, backgroundColor: '#EDE8D9', position: 'absolute', top: 44, minWidth: 140, zIndex: 100, overflow: 'hidden' },
  dropdownItem: { paddingVertical: 8, paddingHorizontal: 16 },
  dropdownItemText: { color: '#5A390E', fontSize: 14 },
  paperContainer: { flex: 1, marginTop: 16, borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden' },
  paperBackground: { flex: 1, position: 'relative' },
  row: { height: 200, justifyContent: 'center' },
  timeline: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center' },
  stampGroup: { width: '60%', alignItems: 'center', justifyContent: 'center' },
  stampCard: { backgroundColor: '#7B1D1D', borderRadius: 12, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 4 },
  stampImageWrapper: { width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#7B1D1D' },
  stampImage: { width: '100%', resizeMode: 'contain' },
  labelBar: { backgroundColor: '#5C1010', paddingVertical: 6, paddingHorizontal: 8 },
  labelTitle: { color: '#F6E5CD', fontSize: 11, fontWeight: '600', textAlign: 'center' },
  infoPopup: { marginTop: 10, alignSelf: 'center', backgroundColor: '#EDE8D9', borderRadius: 14, padding: 14, zIndex: 20 },
  infoTitle: { fontWeight: '700', color: '#3B2C1A', fontSize: 14 },
  infoDate: { color: '#8B7355', fontSize: 12, marginTop: 2 },
  infoButton: { backgroundColor: '#7B1D1D', borderRadius: 8, paddingVertical: 8, marginTop: 10, alignItems: 'center' },
  infoButtonText: { color: '#F6E5CD', fontSize: 13, fontWeight: '600' },
  footerContainer: { padding: 30 },
  footerText: { textAlign: 'center', color: '#8B7355', fontSize: 13, fontStyle: 'italic' },
  navbarWrapper: { position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 100 },
  illustrationCompass: { position: 'absolute', top: 10, left: 14, opacity: 0.13 },
  illustrationIsland: { position: 'absolute', top: 18, right: 10, opacity: 0.13 },
  illustrationBalloon: { position: 'absolute', top: '32%', right: 4, opacity: 0.13 },
  illustrationTent: { position: 'absolute', top: '56%', left: 8, opacity: 0.13 },
  illustrationGolf: { position: 'absolute', bottom: 24, right: 0, opacity: 0.13 },
  illustrationsAbsolute: { ...StyleSheet.absoluteFillObject, pointerEvents: 'none' },
  scriptTextTopLeft: { position: 'absolute', top: 120, left: 8, fontSize: 9, opacity: 0.18, color: '#8B6A3E', fontStyle: 'italic' },
  scriptTextTopRight: { position: 'absolute', top: 380, right: 8, fontSize: 9, opacity: 0.18, color: '#8B6A3E', fontStyle: 'italic' },
  scriptTextLowerLeft: { position: 'absolute', top: 650, left: 8, fontSize: 9, opacity: 0.18, color: '#8B6A3E', fontStyle: 'italic' },
});