import { View, StyleSheet, FlatList, Text, Image, ActivityIndicator, Pressable, ImageBackground, SafeAreaView, Dimensions, } from 'react-native'; // Importing necessary components from React Native
import React, { useState, useEffect, useCallback } from 'react'; // Importing React and its hooks
import { router } from 'expo-router'; // Importing router from expo-router for navigation
import Svg, { Path, Circle, Rect, Ellipse, Line, G, Text as SvgText, Polygon } from 'react-native-svg'; // Importing SVG components for custom illustrations
import BottomNavbar from '../components/BottomNavbar'; // Importing a custom BottomNavbar component
import { supabase } from '@/lib/supabase'; // Importing supabase client for backend interactions

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ILLUSTRATION_COLORS = [
  '#557263',
  '#4A6741',
  '#6B4F6B',
  '#8B6A3E',
  '#7B1D1D',
];

interface Folder {
  id: string;
  name: string;
  event_date: string | null;
  cover_image_url: string | null;
  created_at: string;
  side?: string;
}

interface Profile {
  full_name: string | null;
  birthday: string | null;
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
      <Circle cx={isEven ? '80' : '20'} cy="100" r="10" fill="#7B1D1D" opacity="0.15" />
      <Circle cx={isEven ? '80' : '20'} cy="100" r="7" fill="#F6E5CD" stroke="#C8A84B" strokeWidth="2" />
      <Circle cx={isEven ? '80' : '20'} cy="100" r="3" fill="#7B1D1D" />
    </Svg>
  </View>
);

const BackgroundIllustrations = () => (
  <View style={styles.illustrationsAbsolute} pointerEvents="none">
    {/* TOP ZONE */}
    <View style={{ position: 'absolute', top: 10, left: 8, width: 100, height: 100 }}>
      <Svg width={100} height={100} viewBox="0 0 100 100">
        <Circle cx="50" cy="50" r="46" stroke="#557263" strokeWidth={1.5} fill="none" opacity={0.10} strokeDasharray="2 4" />
        {[...Array(8)].map((_, i) => {
          const angle = (Math.PI / 4) * i;
          const x2 = 50 + 38 * Math.cos(angle);
          const y2 = 50 + 38 * Math.sin(angle);
          return (
            <Line key={`spoke-${i}`} x1="50" y1="50" x2={x2} y2={y2} stroke="#557263" strokeWidth={i % 2 === 0 ? 2 : 1.2} opacity={0.10} />
          );
        })}
        {[...Array(8)].map((_, i) => {
          const angle = (Math.PI / 4) * i;
          const r = i % 2 === 0 ? 32 : 18;
          const x = 50 + r * Math.cos(angle);
          const y = 50 + r * Math.sin(angle);
          return (
            <Line key={`star-${i}`} x1="50" y1="50" x2={x} y2={y} stroke="#557263" strokeWidth={i % 2 === 0 ? 2 : 1.2} opacity={0.10} />
          );
        })}
        {['N', 'E', 'S', 'W'].map((dir, i) => {
          const angle = (Math.PI / 2) * i;
          const x = 50 + 44 * Math.cos(angle);
          const y = 50 + 44 * Math.sin(angle) + (dir === 'N' ? -2 : dir === 'S' ? 2 : 0);
          return (
            <SvgText
              key={`dir-${dir}`}
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
        <Circle cx="50" cy="50" r="7" stroke="#557263" strokeWidth={1.5} fill="#557263" opacity={0.10} />
      </Svg>
    </View>
    <View style={{ position: 'absolute', top: 120, right: -5, width: 120, height: 110 }}>
      <Svg width={120} height={110} viewBox="0 0 120 110">
        <Path d="M20 90 Q60 105 100 90 Q95 80 25 80 Q20 90 20 90" stroke="#8B6A3E" strokeWidth={1.7} fill="none" opacity={0.10} />
        <Line x1="45" y1="80" x2="45" y2="35" stroke="#8B6A3E" strokeWidth={1.5} opacity={0.10} />
        <Line x1="75" y1="80" x2="75" y2="45" stroke="#8B6A3E" strokeWidth={1.5} opacity={0.10} />
        <Path d="M45 35 L60 65 L45 65 Z" stroke="#8B6A3E" strokeWidth={1.2} fill="none" opacity={0.10} />
        <Path d="M75 45 L90 75 L75 75 Z" stroke="#8B6A3E" strokeWidth={1.2} fill="none" opacity={0.10} />
        <Path d="M45 65 L60 80 L45 80 Z" stroke="#8B6A3E" strokeWidth={1.2} fill="none" opacity={0.10} />
        <Path d="M45 35 L55 30 L45 30 Z" stroke="#8B6A3E" strokeWidth={1.2} fill="none" opacity={0.10} />
        {[0, 1, 2, 3].map(i => (
          <Path key={`wave-${i}`} d={`M${30 + i * 18} 100 Q${39 + i * 18} ${104 - i * 2} ${48 + i * 18} 100`} stroke="#8B6A3E" strokeWidth={1.2} fill="none" opacity={0.10} />
        ))}
      </Svg>
    </View>
    <View style={{ position: 'absolute', top: 250, left: 40, width: 60, height: 200 }}>
      <Svg width={60} height={200} viewBox="0 0 60 200">
        <Path d="M30 10 Q50 60 20 100 Q40 140 30 190" stroke="#6B4F6B" strokeWidth={1.5} fill="none" opacity={0.10} strokeDasharray="4 4" />
        {[{x:40,y:60},{x:20,y:100},{x:35,y:170}].map((pt, i) => (
          <G key={`cross-${i}`}>
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
        <Path d="M10 85 L35 40 L60 85 Z" stroke="#4A6741" strokeWidth={1.7} fill="none" opacity={0.11} />
        <Path d="M35 85 L60 55 L85 85 Z" stroke="#4A6741" strokeWidth={1.7} fill="none" opacity={0.11} />
        <Path d="M60 85 L90 30 L120 85 Z" stroke="#4A6741" strokeWidth={2} fill="none" opacity={0.11} />
        <Path d="M90 85 L120 60 L135 85 Z" stroke="#4A6741" strokeWidth={1.7} fill="none" opacity={0.11} />
        <Path d="M90 40 Q100 30 110 40" stroke="#F6E5CD" strokeWidth={1.2} fill="none" opacity={0.11} />
        {[15, 40, 65, 100, 125].map((x, i) => (
          <G key={`pine-${i}`}>
            <Path d={`M${x} 85 L${x + 2} 78 L${x + 4} 85 Z`} stroke="#4A6741" strokeWidth={1.2} fill="none" opacity={0.11} />
            <Line x1={x + 2} y1={85} x2={x + 2} y2={82} stroke="#4A6741" strokeWidth={1.2} opacity={0.11} />
          </G>
        ))}
      </Svg>
    </View>
    <View style={{ position: 'absolute', top: 650, right: -5, width: 90, height: 140 }}>
      <Svg width={90} height={140} viewBox="0 0 90 140">
        <Ellipse cx="45" cy="55" rx="36" ry="50" stroke="#6B4F6B" strokeWidth={1.7} fill="none" opacity={0.11} />
        {[...Array(5)].map((_,i) => (
          <Path key={`panel-${i}`} d={`M45 5 L${45 + Math.round(36*Math.sin((i-2)*Math.PI/8))} 105`} stroke="#6B4F6B" strokeWidth={1.2} fill="none" opacity={0.11} />
        ))}
        <Ellipse cx="45" cy="55" rx="36" ry="7" stroke="#6B4F6B" strokeWidth={1.2} fill="none" opacity={0.11} />
        {[30, 45, 60, 45].map((x, i) => (
          <Line key={`rope-${i}`} x1={x} y1={105} x2={45} y2={125} stroke="#6B4F6B" strokeWidth={1.2} opacity={0.11} />
        ))}
        <Rect x="35" y="125" width="20" height="10" stroke="#6B4F6B" strokeWidth={1.3} fill="none" opacity={0.11} />
      </Svg>
    </View>
    <View style={{ position: 'absolute', top: 820, left: 10, width: 80, height: 55 }}>
      <Svg width={80} height={55} viewBox="0 0 80 55">
        <Circle cx="25" cy="30" r="14" stroke="#8B6A3E" strokeWidth={1.5} fill="none" opacity={0.09} />
        <Circle cx="55" cy="30" r="14" stroke="#8B6A3E" strokeWidth={1.5} fill="none" opacity={0.09} />
        <Circle cx="25" cy="30" r="6" stroke="#8B6A3E" strokeWidth={1.2} fill="none" opacity={0.09} />
        <Circle cx="55" cy="30" r="6" stroke="#8B6A3E" strokeWidth={1.2} fill="none" opacity={0.09} />
        <Rect x="25" y="26" width="30" height="8" stroke="#8B6A3E" strokeWidth={1.2} fill="none" opacity={0.09} />
        <Path d="M15 18 Q40 0 65 18" stroke="#8B6A3E" strokeWidth={1.2} fill="none" opacity={0.09} />
      </Svg>
    </View>
    <View style={{ position: 'absolute', top: 900, right: 5, width: 80, height: 80 }}>
      <Svg width={80} height={80} viewBox="0 0 80 80">
        {[...Array(16)].map((_, i) => {
          const angle = (Math.PI / 8) * i;
          const x2 = 40 + 36 * Math.cos(angle);
          const y2 = 40 + 36 * Math.sin(angle);
          return (
            <Line key={`ray-${i}`} x1="40" y1="40" x2={x2} y2={y2} stroke="#557263" strokeWidth={1.2} opacity={0.09} />
          );
        })}
        <Circle cx="40" cy="40" r="4" stroke="#557263" strokeWidth={1.2} fill="#557263" opacity={0.09} />
        {[0, 4, 8, 12].map(i => {
          const start = (Math.PI / 8) * i;
          const end = start + Math.PI / 8;
          const r = 36;
          const x1 = 40 + r * Math.cos(start);
          const y1 = 40 + r * Math.sin(start);
          const x2 = 40 + r * Math.cos(end);
          const y2 = 40 + r * Math.sin(end);
          return (
            <Path key={`arc-${i}`} d={`M${x1} ${y1} A${r} ${r} 0 0 1 ${x2} ${y2}`} stroke="#557263" strokeWidth={1.2} fill="none" opacity={0.09} />
          );
        })}
      </Svg>
    </View>
    <Text style={{ position: 'absolute', top: 1000, left: 8, fontSize: 8, opacity: 0.10, color: '#7B1D1D', fontStyle: 'italic' }}>here be dragons</Text>

    {/* LOWER-MID ZONE */}
    <View style={{ position: 'absolute', top: 1080, left: -8, width: 130, height: 110 }}>
      <Svg width={130} height={110} viewBox="0 0 130 110">
        <Path d="M20 100 Q60 30 120 80" stroke="#557263" strokeWidth={1.5} fill="none" opacity={0.10} />
        {[{x:35,y:80},{x:50,y:60},{x:65,y:50},{x:80,y:65},{x:95,y:80},{x:60,y:95},{x:90,y:90},{x:110,y:70}].map((leaf,i) => (
          <Ellipse key={`leaf-${i}`} cx={leaf.x} cy={leaf.y} rx="8" ry="16" stroke="#557263" strokeWidth={1.2} fill="none" opacity={0.10} />
        ))}
        {[{x:55,y:70},{x:75,y:75},{x:100,y:85},{x:115,y:75}].map((f,i) => (
          <G key={`flower-${i}`}>
            <Circle cx={f.x} cy={f.y} r="6" stroke="#7B1D1D" strokeWidth={1.2} fill="none" opacity={0.10} />
            {[...Array(5)].map((_,j) => {
              const angle = (2 * Math.PI / 5) * j;
              const px = f.x + 8 * Math.cos(angle);
              const py = f.y + 8 * Math.sin(angle);
              return <Path key={`petal-${i}-${j}`} d={`M${f.x},${f.y} Q${(f.x+px)/2},${(f.y+py)/2-3} ${px},${py}`} stroke="#7B1D1D" strokeWidth={1.1} fill="none" opacity={0.10} />;
            })}
          </G>
        ))}
        {[{x:40,y:90},{x:70,y:100},{x:105,y:95}].map((b,i) => (
          <Circle key={`berry-${i}`} cx={b.x} cy={b.y} r="2.5" fill="#7B1D1D" opacity={0.10} />
        ))}
      </Svg>
    </View>
    <View style={{ position: 'absolute', top: 1220, right: 5, width: 85, height: 110 }}>
      <Svg width={85} height={110} viewBox="0 0 85 110">
        <Line x1="42.5" y1="25" x2="42.5" y2="80" stroke="#8B6A3E" strokeWidth={1.7} opacity={0.11} />
        <Line x1="28" y1="40" x2="57" y2="40" stroke="#8B6A3E" strokeWidth={1.5} opacity={0.11} />
        <Path d="M42.5 80 Q30 100 15 90" stroke="#8B6A3E" strokeWidth={1.7} fill="none" opacity={0.11} />
        <Path d="M42.5 80 Q55 100 70 90" stroke="#8B6A3E" strokeWidth={1.7} fill="none" opacity={0.11} />
        <Circle cx="15" cy="90" r="3" fill="#8B6A3E" opacity={0.11} />
        <Circle cx="70" cy="90" r="3" fill="#8B6A3E" opacity={0.11} />
        <Circle cx="42.5" cy="25" r="6" stroke="#8B6A3E" strokeWidth={1.3} fill="none" opacity={0.11} />
        <Path d="M42.5 15 Q50 10 55 25 Q60 40 42.5 45 Q25 50 30 25 Q35 10 42.5 15" stroke="#8B6A3E" strokeWidth={1.2} fill="none" opacity={0.11} />
      </Svg>
    </View>
    <View style={{ position: 'absolute', top: 1360, left: 5, width: 110, height: 70 }}>
      <Svg width={110} height={70} viewBox="0 0 110 70">
        <Rect x="10" y="10" width="90" height="50" stroke="#6B4F6B" strokeWidth={1.5} fill="none" opacity={0.11} strokeDasharray="3 3" />
        {[{x:10,y:10},{x:100,y:10},{x:10,y:60},{x:100,y:60}].map((d,i) => (
          <Path key={`diamond-${i}`} d={`M${d.x} ${d.y+3} L${d.x+3} ${d.y} L${d.x} ${d.y-3} L${d.x-3} ${d.y} Z`} stroke="#6B4F6B" strokeWidth={1.2} fill="none" opacity={0.11} />
        ))}
        <SvgText x="55" y="45" fontSize="13" fontWeight="bold" fill="#6B4F6B" opacity={0.11} textAnchor="middle" fontStyle="italic">MEMORIES</SvgText>
      </Svg>
    </View>
    <View style={{ position: 'absolute', top: 1460, right: 8, width: 100, height: 60 }}>
      <Svg width={100} height={60} viewBox="0 0 100 60">
        <Path d="M20 40 Q50 10 80 40 Q70 50 30 50 Q20 40 20 40" stroke="#4A6741" strokeWidth={1.5} fill="none" opacity={0.09} />
        <Path d="M35 40 Q50 25 65 40" stroke="#4A6741" strokeWidth={1.2} fill="none" opacity={0.09} />
        <Path d="M40 45 Q50 35 60 45" stroke="#4A6741" strokeWidth={1.2} fill="none" opacity={0.09} />
        <Path d="M45 48 Q50 43 55 48" stroke="#4A6741" strokeWidth={1.2} fill="none" opacity={0.09} />
        <Path d="M30 30 L70 50" stroke="#4A6741" strokeWidth={1.3} fill="none" opacity={0.09} />
        <Path d="M70 30 L30 50" stroke="#4A6741" strokeWidth={1.3} fill="none" opacity={0.09} />
        <Path d="M35 55 Q50 60 65 55" stroke="#4A6741" strokeWidth={1.2} fill="none" opacity={0.09} />
      </Svg>
    </View>
    <View style={{ position: 'absolute', bottom: 650, left: 5, width: 110, height: 60 }}>
      <Svg width={110} height={60} viewBox="0 0 110 60">
        <Path d="M20 40 L80 20 Q90 18 95 25 Q100 32 90 38 L30 55" stroke="#8B6A3E" strokeWidth={1.7} fill="none" opacity={0.10} />
        <Circle cx="20" cy="40" r="5" stroke="#8B6A3E" strokeWidth={1.2} fill="none" opacity={0.10} />
        <Circle cx="95" cy="25" r="6" stroke="#8B6A3E" strokeWidth={1.2} fill="none" opacity={0.10} />
        <Path d="M30 55 L25 59" stroke="#8B6A3E" strokeWidth={1.2} fill="none" opacity={0.10} />
        <Path d="M30 55 L35 59" stroke="#8B6A3E" strokeWidth={1.2} fill="none" opacity={0.10} />
        {[...Array(8)].map((_,i) => {
          const angle = (Math.PI/4)*i;
          const x2 = 95 + 10*Math.cos(angle);
          const y2 = 25 + 10*Math.sin(angle);
          return <Line key={`starburst-${i}`} x1={95} y1={25} x2={x2} y2={y2} stroke="#8B6A3E" strokeWidth={1.1} opacity={0.10} />;
        })}
      </Svg>
    </View>
    <View style={{ position: 'absolute', bottom: 420, left: 8, width: 120, height: 70 }}>
      <Svg width={120} height={70} viewBox="0 0 120 70">
        <Ellipse cx="60" cy="35" rx="50" ry="28" stroke="#557263" strokeWidth={1.7} fill="none" opacity={0.10} />
        <Path d="M10 35 Q0 10 30 15 Q10 60 60 60" stroke="#557263" strokeWidth={1.2} fill="none" opacity={0.10} />
        <Path d="M110 35 Q120 10 90 15 Q110 60 60 60" stroke="#557263" strokeWidth={1.2} fill="none" opacity={0.10} />
        <SvgText x="60" y="44" fontSize="15" fontWeight="bold" fill="#557263" opacity={0.10} textAnchor="middle" fontStyle="italic">ATLAS</SvgText>
      </Svg>
    </View>
    <View style={{ position: 'absolute', bottom: 480, right: 5, width: 100, height: 120 }}>
      <Svg width={100} height={120} viewBox="0 0 100 120">
        {[
          {x:20,y:30,r:2}, {x:40,y:20,r:2}, {x:60,y:35,r:2}, {x:80,y:25,r:2},
          {x:30,y:60,r:2}, {x:55,y:60,r:2}, {x:75,y:70,r:2}, {x:50,y:90,r:2},
          {x:70,y:100,r:2}
        ].map((s,i) => (
          <Circle key={`star-dot-${i}`} cx={s.x} cy={s.y} r={i===1||i===3||i===7?3:2} fill="#6B4F6B" opacity={0.11} />
        ))}
        {[
          [0,1],[1,2],[2,3],[1,4],[4,5],[5,6],[6,7],[7,8]
        ].map(([a,b],i) => (
          <Line key={`connect-${i}`} x1={[20,40,60,80,30,55,75,50,70][a]} y1={[30,20,35,25,60,60,70,90,100][a]} x2={[20,40,60,80,30,55,75,50,70][b]} y2={[30,20,35,25,60,60,70,90,100][b]} stroke="#6B4F6B" strokeWidth={1.2} opacity={0.11} />
        ))}
      </Svg>
    </View>
    <View style={{ position: 'absolute', bottom: 350, left: 0, width: '100%', height: 40 }}>
      <Svg width="100%" height={40} viewBox="0 0 400 40">
        <Path d="M0 20 Q25 0 50 20 T100 20 T150 20 T200 20 T250 20 T300 20 T350 20 T400 20" stroke="#8B6A3E" strokeWidth={1.5} fill="none" opacity={0.10} strokeDasharray="6 3" />
      </Svg>
    </View>
    <Text style={{ position: 'absolute', bottom: 300, right: 10, fontSize: 8, opacity: 0.11, color: '#4A6741', fontStyle: 'italic' }}>~ est. 2026 ~</Text>
    <View style={{ position: 'absolute', bottom: 320, left: 20, width: 140, height: 20 }}>
      <Svg width={140} height={20} viewBox="0 0 140 20">
        <Line x1="10" y1="10" x2="130" y2="10" stroke="#8B6A3E" strokeWidth={1.3} opacity={0.10} />
        <Path d="M70 10 L75 15 L70 20 L65 15 Z" stroke="#8B6A3E" strokeWidth={1.2} fill="none" opacity={0.10} />
        <Path d="M10 10 L13 13 L10 16 L7 13 Z" stroke="#8B6A3E" strokeWidth={1.1} fill="none" opacity={0.10} />
        <Path d="M130 10 L133 13 L130 16 L127 13 Z" stroke="#8B6A3E" strokeWidth={1.1} fill="none" opacity={0.10} />
        {[20,40,60,80,100,120].map((x,i) => (
          <Line key={`tick-${i}`} x1={x} y1="7" x2={x} y2="13" stroke="#8B6A3E" strokeWidth={1} opacity={0.10} />
        ))}
      </Svg>
    </View>
  </View>
);

// ─────────────────────────────────────────────
// Lineart image mapping
// ─────────────────────────────────────────────

function getLineartImage(title: string) {
  const t = title.toLowerCase();
  if (t.includes('birthday') || t.includes('bday') || t.includes('party')) return cakeArt;
  if (t.includes('cake') || t.includes('celebration') || t.includes('dessert')) return cakeSlice;
  if (t.includes('graduation') || t.includes('grad') || t.includes('university') || t.includes('college')) return capArt;
  if (t.includes('dog') || t.includes('pet') || t.includes('animal') || t.includes('cat')) return dogArt;
  if (t.includes('flower') || t.includes('mom') || t.includes('garden') || t.includes('anniversary') || t.includes('bouquet')) return flowersArt;
  if (t.includes('photo') || t.includes('photography') || t.includes('trip') || t.includes('travel') || t.includes('vacation') || t.includes('prague')) return cameraArt;
  if (t.includes('concert') || t.includes('movie') || t.includes('event') || t.includes('show') || t.includes('festival') || t.includes('flight') || t.includes('ticket')) return ticketsArt;
  if (t.includes('achievement') || t.includes('award') || t.includes('win') || t.includes('sport') || t.includes('match')) return starArt;
  if (t.includes('home') || t.includes('family')) return house;
  return null;
}

// ─────────────────────────────────────────────
// Scene SVGs (kept for potential future use)
// ─────────────────────────────────────────────

export default function TimelineScreen() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [monthOpen, setMonthOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);

  const PAGE_SIZE = 5;

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const years = ['2023', '2024', '2025', '2026'];

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name, birthday')
      .eq('id', user.id)
      .single();
    if (error) console.error('Profile fetch error:', error);
    else if (data) setProfile(data);
  }

  useEffect(() => {
    setFolders([]);
    setCurrentPage(0);
    setHasNextPage(true);
    fetchFolders(0, false);
  }, [selectedMonth, selectedYear]);

  const fetchFolders = useCallback(async (page: number, append: boolean) => {
    if (loading) return;
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from('folders')
        .select('id, name, event_date, cover_image_url, created_at')
        .eq('user_id', user.id)
        .eq('is_default', false)
        .order('event_date', { ascending: true })
        .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

      if (selectedMonth && selectedYear) {
        const monthIndex = months.indexOf(selectedMonth) + 1;
        const paddedMonth = monthIndex.toString().padStart(2, '0');
        query = query
          .gte('event_date', `${selectedYear}-${paddedMonth}-01`)
          .lte('event_date', `${selectedYear}-${paddedMonth}-31`);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Failed to fetch folders:', error);
        return;
      }

      if (data) {
        setFolders(prev => {
          const merged = append ? [...prev, ...data] : data;
          // deduplicate by id
          return merged.filter((item, index, self) =>
            index === self.findIndex((i) => i.id === item.id)
          );
        });
        setCurrentPage(page + 1);
        setHasNextPage(data.length === PAGE_SIZE);
      }
    } catch (err) {
      console.error('Error fetching folders:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear, loading]);

  const fetchNextPage = () => {
    if (loading || !hasNextPage) return;
    fetchFolders(currentPage, true);
  };

  const getBirthYear = () => {
    if (!profile?.birthday) return '?';
    return new Date(profile.birthday).getFullYear();
  };

  const getDisplayDate = (folder: Folder) => {
    const dateStr = folder.event_date || folder.created_at;
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const renderTimelineItem = ({ item, index }: { item: Folder; index: number }) => {
    const isEven = index % 2 === 0;
    const stampWidth = SCREEN_WIDTH * 0.38;
    const isSelected = selectedFolder?.id === item.id;
    const accentColor = ILLUSTRATION_COLORS[index % ILLUSTRATION_COLORS.length];
    const lineartImage = getLineartImage(item.name);
    return (
      <View style={styles.row}>
        <CurvedTimelinePath isEven={isEven} />
        <View style={[styles.stampGroup, { alignSelf: isEven ? 'flex-start' : 'flex-end' }]}>
          <View style={[styles.stampCard, { width: stampWidth, borderLeftWidth: 5, borderLeftColor: accentColor }]}>
            <Pressable onPress={() => setSelectedFolder(isSelected ? null : item)}>
              <View style={{ borderStyle: 'dashed', borderColor: '#C8B89A', borderWidth: 2, margin: 4, borderRadius: 4 }}>
                <View style={styles.stampImageWrapper}>
                  <Image
                    source={item.cover_image_url ? { uri: item.cover_image_url } : require('../../assets/images/star-stamp.png')}
                    style={[styles.stampImage, { height: 110 }]}
                  />
                </View>
              </View>
              <View style={[styles.labelBar, { backgroundColor: accentColor, borderBottomWidth: 2, borderBottomColor: accentColor }]}>
                <Text style={styles.labelTitle} numberOfLines={1}>{item.name}</Text>
              </View>
            </Pressable>
          </View>
          <Text style={{ fontStyle: 'italic', color: accentColor, fontSize: 11, marginTop: 6, textAlign: 'center' }}>
            {getDisplayDate(item)}
          </Text>
          {isSelected && (
            <View style={styles.infoPopup}>
              <Text style={styles.infoTitle}>{item.name}</Text>
              <Text style={styles.infoDate}>{getDisplayDate(item)}</Text>
              <Pressable
                style={styles.infoButton}
                onPress={() => router.push({ pathname: '/bulletin-board', params: { id: item.id, title: item.name } })}
              >
                <Text style={styles.infoButtonText}>Open Folder</Text>
              </Pressable>
            </View>
          )}
        </View>
        {lineartImage && (
          <View
            style={{
              position: 'absolute',
              [isEven ? 'right' : 'left']: 12,
              top: 30,
              width: 140,
              height: 140,
              zIndex: 2,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 1,
            }}
          >
            <Image source={lineartImage} style={{ width: 130, height: 130, resizeMode: 'contain', opacity: 0.85 }} />
          </View>
        )}
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
                <Text style={styles.welcomeBackHeader}>
                  Welcome Back, {profile?.full_name ?? 'Friend'}!
                </Text>
                <View style={styles.dropdownRow}>
                  <View style={styles.dropdownWrapper}>
                    <Pressable style={styles.dropdownButton} onPress={() => { setMonthOpen(!monthOpen); if (yearOpen) setYearOpen(false); }}>
                      <View style={styles.dropdownInner}>
                        <Text style={styles.dropdownText}>{selectedMonth || 'Month'}</Text>
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
                        <Text style={styles.dropdownText}>{selectedYear || 'Year'}</Text>
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
                      data={folders}
                      keyExtractor={(item) => item.id}
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
                              Making Memories since {getBirthYear()}
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
  illustrationsAbsolute: { ...StyleSheet.absoluteFillObject, pointerEvents: 'none' },
  scriptTextTopLeft: { position: 'absolute', top: 120, left: 8, fontSize: 9, opacity: 0.18, color: '#8B6A3E', fontStyle: 'italic' },
  scriptTextTopRight: { position: 'absolute', top: 380, right: 8, fontSize: 9, opacity: 0.18, color: '#8B6A3E', fontStyle: 'italic' },
  scriptTextLowerLeft: { position: 'absolute', top: 650, left: 8, fontSize: 9, opacity: 0.18, color: '#8B6A3E', fontStyle: 'italic' },
});

// ─────────────────────────────────────────────
// Lineart image paths
// ─────────────────────────────────────────────
const cakeArt = require('../../assets/images/cake-art.png');
const cakeSlice = require('../../assets/images/cake-slice.png');
const capArt = require('../../assets/images/cap-art.png');
const dogArt = require('../../assets/images/dog-art.png');
const flowersArt = require('../../assets/images/flowers-art.png');
const cameraArt = require('../../assets/images/camera-art.png');
const ticketsArt = require('../../assets/images/tickets-art.png');
const starArt = require('../../assets/images/star-art.png');
const house = require('../../assets/images/house.png');
