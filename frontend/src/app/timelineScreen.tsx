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
function BirthdayScene() {
  return (
    <Svg width={100} height={100} viewBox="0 0 100 100">
      {/* Balloons */}
      <Circle cx={28} cy={30} r={16} fill="#E8594A" />
      <Circle cx={50} cy={22} r={16} fill="#F9D06A" />
      <Circle cx={72} cy={30} r={16} fill="#6B4F6B" />
      {/* Strings */}
      <Path d="M28 46 Q34 60 50 72" stroke="#8B6A3E" strokeWidth={2.5} fill="none" />
      <Path d="M50 38 Q50 60 50 72" stroke="#8B6A3E" strokeWidth={2.5} fill="none" />
      <Path d="M72 46 Q66 60 50 72" stroke="#8B6A3E" strokeWidth={2.5} fill="none" />
      {/* Knot */}
      <Circle cx={50} cy={72} r={2.5} fill="#8B6A3E" />
      {/* Gift box */}
      <Rect x={36} y={72} width={28} height={22} rx={4} fill="#7B1D1D" />
      {/* Ribbon cross */}
      <Rect x={48} y={72} width={4} height={22} fill="#F9D06A" />
      <Rect x={36} y={82} width={28} height={4} fill="#F9D06A" />
    </Svg>
  );
}

function TravelScene() {
  return (
    <Svg width={100} height={100} viewBox="0 0 100 100">
      {/* Tower body */}
      <Rect x={30} y={30} width={40} height={55} rx={3} fill="#B8A898" />
      {/* Battlements */}
      <Rect x={30} y={18} width={10} height={12} fill="#B8A898" />
      <Rect x={45} y={18} width={10} height={12} fill="#B8A898" />
      <Rect x={60} y={18} width={10} height={12} fill="#B8A898" />
      {/* Window */}
      <Rect x={43} y={48} width={14} height={18} rx={7} fill="#7B9EB8" />
      {/* Door */}
      <Rect x={42} y={68} width={16} height={17} rx={8} fill="#5A4A3A" />
      {/* Flag */}
      <Line x1={50} y1={30} x2={50} y2={18} stroke="#7B1D1D" strokeWidth={2.5} />
      <Path d="M50 18 L60 22 L50 24 Z" fill="#E8594A" />
    </Svg>
  );
}

function GardenScene() {
  return (
    <Svg width={100} height={100} viewBox="0 0 100 100">
      {/* Trunk */}
      <Rect x={44} y={65} width={12} height={28} rx={4} fill="#8B6A3E" />
      {/* Big canopy */}
      <Circle cx={50} cy={52} r={28} fill="#5AAA58" />
      {/* Lighter inner circle */}
      <Circle cx={50} cy={46} r={20} fill="#6DC26A" />
      {/* Blossoms */}
      <Circle cx={38} cy={44} r={5} fill="#F4A0B8" />
      <Circle cx={62} cy={50} r={5} fill="#F4A0B8" />
      <Circle cx={50} cy={60} r={5} fill="#F4A0B8" />
      <Circle cx={60} cy={38} r={5} fill="#F4A0B8" />
      <Circle cx={42} cy={62} r={5} fill="#F4A0B8" />
      <Circle cx={55} cy={70} r={5} fill="#F4A0B8" />
    </Svg>
  );
}

function PromScene() {
  return (
    <Svg width={100} height={100} viewBox="0 0 100 100">
      {/* Bow tie */}
      <Path d="M40 60 L50 70 L60 60 L50 50 Z" fill="#6B4F6B" />
      {/* Center knot */}
      <Circle cx={50} cy={60} r={5} fill="#C4A34A" />
      {/* Sparkles */}
      <Path d="M25 35 L28 40 L31 35 L28 30 Z" fill="#C4A34A" />
      <Path d="M70 30 L73 35 L76 30 L73 25 Z" fill="#C4A34A" />
      <Path d="M60 80 L63 85 L66 80 L63 75 Z" fill="#C4A34A" />
      <Path d="M35 75 L38 80 L41 75 L38 70 Z" fill="#C4A34A" />
      {/* Crown */}
      <Path d="M45 38 L47 32 L50 38 L53 32 L55 38 Z" fill="#F9D06A" />
      <Rect x={45} y={38} width={10} height={4} fill="#F9D06A" />
    </Svg>
  );
}

function MomBirthdayScene() {
  return (
    <Svg width={100} height={100} viewBox="0 0 100 100">
      {/* Bottom tier */}
      <Rect x={25} y={70} width={50} height={16} rx={6} fill="#E8594A" />
      {/* Middle tier */}
      <Rect x={32} y={56} width={36} height={14} rx={5} fill="#F9D06A" />
      {/* Top tier */}
      <Rect x={38} y={44} width={24} height={12} rx={4} fill="#6B4F6B" />
      {/* Candles */}
      <Rect x={44} y={38} width={2} height={8} fill="#F6E5CD" />
      <Rect x={50} y={38} width={2} height={8} fill="#F6E5CD" />
      <Rect x={56} y={38} width={2} height={8} fill="#F6E5CD" />
      {/* Flames */}
      <Ellipse cx={45} cy={38} rx={1.2} ry={2} fill="#F9D06A" />
      <Ellipse cx={51} cy={38} rx={1.2} ry={2} fill="#F9D06A" />
      <Ellipse cx={57} cy={38} rx={1.2} ry={2} fill="#F9D06A" />
      {/* Dots/frosting */}
      {[30, 40, 50, 60, 70].map((x, i) => (
        <Circle key={i} cx={x} cy={84} r={2} fill="#F6E5CD" />
      ))}
      {[38, 50, 62].map((x, i) => (
        <Circle key={i} cx={x} cy={66} r={1.5} fill="#E8594A" />
      ))}
    </Svg>
  );
}

function FriendsScene() {
  return (
    <Svg width={100} height={100} viewBox="0 0 100 100">
      {/* Two figures */}
      <Circle cx={35} cy={60} r={10} fill="#6B4F6B" />
      <Rect x={29} y={70} width={12} height={18} rx={5} fill="#6B4F6B" />
      <Circle cx={65} cy={60} r={10} fill="#C4A34A" />
      <Rect x={59} y={70} width={12} height={18} rx={5} fill="#C4A34A" />
      {/* Speech bubble */}
      <Rect x={28} y={28} width={44} height={18} rx={8} fill="#F6E5CD" stroke="#8B6A3E" strokeWidth={2} />
      <Path d="M50 46 Q48 54 42 50 L50 46" fill="#F6E5CD" stroke="#8B6A3E" strokeWidth={2} />
    </Svg>
  );
}

function PetScene() {
  return (
    <Svg width={100} height={100} viewBox="0 0 100 100">
      {/* Cat head */}
      <Circle cx={50} cy={35} r={22} fill="#8B6A3E" />
      {/* Ears */}
      <Path d="M34 22 L42 10 L46 28 Z" fill="#8B6A3E" />
      <Path d="M66 22 L58 10 L54 28 Z" fill="#8B6A3E" />
      {/* Body */}
      <Ellipse cx={50} cy={72} rx={18} ry={22} fill="#8B6A3E" />
      {/* Eyes */}
      <Circle cx={44} cy={38} r={2.5} fill="#F6E5CD" />
      <Circle cx={56} cy={38} r={2.5} fill="#F6E5CD" />
      {/* Nose */}
      <Path d="M50 42 L48 45 L52 45 Z" fill="#F6E5CD" />
      {/* Tail */}
      <Path d="M68 80 Q90 90 70 60" stroke="#8B6A3E" strokeWidth={5} fill="none" />
    </Svg>
  );
}

function FoodScene() {
  return (
    <Svg width={100} height={100} viewBox="0 0 100 100">
      {/* Plate */}
      <Circle cx={50} cy={58} r={28} fill="#F6E5CD" stroke="#8B6A3E" strokeWidth={3} />
      {/* Fork */}
      <Rect x={18} y={48} width={4} height={18} rx={1} fill="#8B6A3E" />
      <Line x1={20} y1={48} x2={20} y2={60} stroke="#8B6A3E" strokeWidth={2} />
      <Line x1={22} y1={48} x2={22} y2={60} stroke="#8B6A3E" strokeWidth={2} />
      <Line x1={24} y1={48} x2={24} y2={60} stroke="#8B6A3E" strokeWidth={2} />
      {/* Knife */}
      <Rect x={78} y={50} width={4} height={16} rx={1} fill="#8B6A3E" />
      <Path d="M82 50 L86 54 L82 54 Z" fill="#8B6A3E" />
      {/* Food mound */}
      <Ellipse cx={50} cy={58} rx={10} ry={6} fill="#C4A34A" />
    </Svg>
  );
}

function MusicScene() {
  return (
    <Svg width={100} height={100} viewBox="0 0 100 100">
      {/* Note head */}
      <Ellipse cx={38} cy={72} rx={14} ry={10} fill="#6B4F6B" transform="rotate(-18 38 72)" />
      {/* Stem */}
      <Rect x={46} y={38} width={6} height={34} fill="#6B4F6B" />
      {/* Flag */}
      <Path d="M52 38 Q70 30 54 54" stroke="#6B4F6B" strokeWidth={5} fill="none" />
      {/* Sound arcs */}
      <Path d="M70 30 Q80 36 72 44" stroke="#C4A34A" strokeWidth={3} fill="none" />
      <Path d="M74 50 Q84 54 76 60" stroke="#C4A34A" strokeWidth={3} fill="none" />
      <Path d="M60 20 Q68 24 62 32" stroke="#C4A34A" strokeWidth={3} fill="none" />
    </Svg>
  );
}

function BeachScene() {
  return (
    <Svg width={100} height={100} viewBox="0 0 100 100">
      {/* Sun */}
      <Circle cx={50} cy={38} r={18} fill="#F9D06A" />
      {/* Rays */}
      {[...Array(8)].map((_,i) => {
        const angle = (Math.PI/4)*i;
        const x1 = 50 + 18 * Math.cos(angle);
        const y1 = 38 + 18 * Math.sin(angle);
        const x2 = 50 + 28 * Math.cos(angle);
        const y2 = 38 + 28 * Math.sin(angle);
        return <Line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#F9D06A" strokeWidth={3} />;
      })}
      {/* Waves */}
      <Path d="M20 80 Q35 90 50 80 Q65 70 80 80" stroke="#7B9EB8" strokeWidth={4} fill="none" />
      <Path d="M25 90 Q50 100 75 90" stroke="#7B9EB8" strokeWidth={4} fill="none" />
      {/* Palm tree */}
      <Line x1={78} y1={80} x2={85} y2={60} stroke="#4A6741" strokeWidth={4} />
      <Ellipse cx={85} cy={60} rx={10} ry={4} fill="#4A6741" transform="rotate(-20 85 60)" />
      <Ellipse cx={85} cy={60} rx={10} ry={4} fill="#4A6741" transform="rotate(20 85 60)" />
      <Ellipse cx={85} cy={60} rx={10} ry={4} fill="#4A6741" />
    </Svg>
  );
}

function StudyScene() {
  return (
    <Svg width={100} height={100} viewBox="0 0 100 100">
      {/* Left page */}
      <Rect x={14} y={35} width={34} height={42} rx={2} fill="#F6E5CD" stroke="#8B6A3E" strokeWidth={2} />
      {/* Right page */}
      <Rect x={52} y={35} width={34} height={42} rx={2} fill="#F6E5CD" stroke="#8B6A3E" strokeWidth={2} />
      {/* Spine */}
      <Line x1={50} y1={35} x2={50} y2={77} stroke="#8B6A3E" strokeWidth={2} />
      {/* Text lines */}
      {[40, 48, 56].map((y, i) => (
        <Line key={i} x1={18} y1={y} x2={44} y2={y} stroke="#C8B89A" strokeWidth={2} />
      ))}
      {[40, 48, 56].map((y, i) => (
        <Line key={10+i} x1={56} y1={y} x2={82} y2={y} stroke="#C8B89A" strokeWidth={2} />
      ))}
      {/* Pencil */}
      <Rect x={68} y={22} width={16} height={5} rx={2} fill="#F9D06A" />
      <Polygon points="84,22 90,24.5 84,27" fill="#C4A34A" />
    </Svg>
  );
}

function SportsScene() {
  return (
    <Svg width={100} height={100} viewBox="0 0 100 100">
      {/* Cup body */}
      <Rect x={32} y={38} width={36} height={28} rx={12} fill="#C4A34A" />
      {/* Stem */}
      <Rect x={46} y={66} width={8} height={14} rx={3} fill="#C4A34A" />
      {/* Base */}
      <Rect x={40} y={80} width={20} height={8} rx={2} fill="#C4A34A" />
      {/* Handles */}
      <Path d="M32 48 Q18 52 32 66" stroke="#C4A34A" strokeWidth={4} fill="none" />
      <Path d="M68 48 Q82 52 68 66" stroke="#C4A34A" strokeWidth={4} fill="none" />
      {/* Stars */}
      {[44, 50, 56].map((x, i) => (
        <Polygon key={i} points={`${x},52 ${x+1.5},56 ${x+5},56.5 ${x+2.5},59 ${x+3.5},63 ${x},61 ${x-3.5},63 ${x-2.5},59 ${x-5},56.5 ${x-1.5},56`} fill="#F6E5CD" />
      ))}
    </Svg>
  );
}

function MovieScene() {
  return (
    <Svg width={100} height={100} viewBox="0 0 100 100">
      {/* Main board */}
      <Rect x={15} y={30} width={70} height={55} rx={4} fill="#3B2C1A" />
      {/* White stripe */}
      <Rect x={15} y={30} width={70} height={15} fill="#F6E5CD" />
      {/* Diagonal stripes */}
      {[0,1,2,3,4].map(i => (
        <Path key={i} d={`M${15+14*i} 30 L${15+14*i+10} 45`} stroke="#3B2C1A" strokeWidth={4} />
      ))}
      {/* Hinge */}
      <Circle cx={20} cy={37} r={4} fill="#C4A34A" />
      {/* Holes */}
      <Circle cx={75} cy={40} r={2} fill="#F6E5CD" />
      <Circle cx={85} cy={40} r={2} fill="#F6E5CD" />
    </Svg>
  );
}

function FamilyScene() {
  return (
    <Svg width={100} height={100} viewBox="0 0 100 100">
      {/* House wall */}
      <Rect x={22} y={48} width={56} height={40} rx={3} fill="#C4A34A" />
      {/* Roof */}
      <Polygon points="15,50 50,18 85,50" fill="#7B1D1D" />
      {/* Door */}
      <Rect x={46} y={72} width={8} height={16} fill="#8B6A3E" />
      {/* Windows */}
      <Rect x={30} y={58} width={10} height={10} fill="#F6E5CD" />
      <Line x1={35} y1={58} x2={35} y2={68} stroke="#8B6A3E" strokeWidth={1.5} />
      <Line x1={30} y1={63} x2={40} y2={63} stroke="#8B6A3E" strokeWidth={1.5} />
      <Rect x={60} y={58} width={10} height={10} fill="#F6E5CD" />
      <Line x1={65} y1={58} x2={65} y2={68} stroke="#8B6A3E" strokeWidth={1.5} />
      <Line x1={60} y1={63} x2={70} y2={63} stroke="#8B6A3E" strokeWidth={1.5} />
      {/* Chimney */}
      <Rect x={70} y={28} width={8} height={14} fill="#8B6A3E" />
    </Svg>
  );
}

function HikingScene() {
  return (
    <Svg width={100} height={100} viewBox="0 0 100 100">
      {/* Back mountain */}
      <Polygon points="30,90 60,40 90,90" fill="#4A6741" />
      {/* Front mountain */}
      <Polygon points="10,90 40,55 70,90" fill="#557263" />
      {/* Trail path */}
      <Path d="M40 90 Q45 80 50 70 Q55 60 60 55 Q65 50 68 45" stroke="#F6E5CD" strokeWidth={3} fill="none" strokeDasharray="4 4" />
      {/* Flag pin */}
      <Line x1={68} y1={45} x2={68} y2={35} stroke="#E8594A" strokeWidth={3} />
      <Polygon points="68,35 74,39 68,41" fill="#E8594A" />
      {/* Sun */}
      <Path d="M80 30 A12 12 0 0 1 92 42 L80 42 Z" fill="#F9D06A" />
    </Svg>
  );
}

function SpaScene() {
  return (
    <Svg width={100} height={100} viewBox="0 0 100 100">
      {/* Candle */}
      <Rect x={44} y={38} width={12} height={32} rx={4} fill="#F6E5CD" stroke="#C8B89A" strokeWidth={2} />
      {/* Flame */}
      <Ellipse cx={50} cy={36} rx={2.5} ry={5} fill="#F9D06A" />
      {/* Glow */}
      <Circle cx={50} cy={36} r={10} fill="#F9D06A" opacity={0.3} />
      {/* Leaves */}
      <Ellipse cx={38} cy={70} rx={10} ry={22} fill="#557263" transform="rotate(-18 38 70)" />
      <Ellipse cx={62} cy={74} rx={10} ry={22} fill="#557263" transform="rotate(18 62 74)" />
      <Ellipse cx={50} cy={82} rx={12} ry={8} fill="#557263" />
    </Svg>
  );
}

function DefaultScene() {
  return (
    <Svg width={100} height={100} viewBox="0 0 100 100">
      {/* Petal ring */}
      {[...Array(8)].map((_,i) => {
        const angle = (Math.PI/4)*i;
        const cx = 50 + 28 * Math.cos(angle);
        const cy = 50 + 28 * Math.sin(angle);
        return <Ellipse key={i} cx={cx} cy={cy} rx={10} ry={22} fill="#C4A34A" opacity={0.6} transform={`rotate(${i*45} ${cx} ${cy})`} />;
      })}
      {/* Inner circle */}
      <Circle cx={50} cy={50} r={14} fill="#7B1D1D" />
      {/* Dot accents */}
      {[...Array(8)].map((_,i) => {
        const angle = (Math.PI/4)*i + Math.PI/8;
        const cx = 50 + 38 * Math.cos(angle);
        const cy = 50 + 38 * Math.sin(angle);
        return <Circle key={i} cx={cx} cy={cy} r={2.5} fill="#F6E5CD" />;
      })}
    </Svg>
  );
}

function getSceneObjects(title: string) {
  const t = title.toLowerCase();
  if (t.includes('birthday') || t.includes('bday')) return <BirthdayScene />;
  if (t.includes('trip') || t.includes('travel') || t.includes('prague') || t.includes('flight')) return <TravelScene />;
  if (t.includes('garden') || t.includes('plant') || t.includes('flower')) return <GardenScene />;
  if (t.includes('prom') || t.includes('dance') || t.includes('formal')) return <PromScene />;
  if (t.includes('mom') || t.includes('dad') || t.includes('family') || t.includes('home')) return <FamilyScene />;
  if (t.includes('friend') || t.includes('hang') || t.includes('outing')) return <FriendsScene />;
  if (t.includes('pet') || t.includes('cat') || t.includes('dog') || t.includes('animal')) return <PetScene />;
  if (t.includes('food') || t.includes('dinner') || t.includes('lunch') || t.includes('cafe') || t.includes('restaurant')) return <FoodScene />;
  if (t.includes('music') || t.includes('concert') || t.includes('festival') || t.includes('gig')) return <MusicScene />;
  if (t.includes('beach') || t.includes('summer') || t.includes('vacation') || t.includes('holiday')) return <BeachScene />;
  if (t.includes('study') || t.includes('school') || t.includes('exam') || t.includes('work')) return <StudyScene />;
  if (t.includes('sport') || t.includes('gym') || t.includes('run') || t.includes('workout') || t.includes('match')) return <SportsScene />;
  if (t.includes('movie') || t.includes('film') || t.includes('cinema') || t.includes('show')) return <MovieScene />;
  if (t.includes('hike') || t.includes('trail') || t.includes('outdoors') || t.includes('nature') || t.includes('walk')) return <HikingScene />;
  if (t.includes('spa') || t.includes('relax') || t.includes('wellness') || t.includes('self')) return <SpaScene />;
  return <DefaultScene />;
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
              <View style={[styles.labelBar, { borderBottomWidth: 2, borderBottomColor: accentColor }]}> 
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
            [isEven ? 'right' : 'left']: 12,
            top: 50,
            width: 100,
            height: 100,
            opacity: 0.82,
            zIndex: 2, // ensure above path, below card
            pointerEvents: 'none',
          }}
        >
          {getSceneObjects(item.title)}
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
