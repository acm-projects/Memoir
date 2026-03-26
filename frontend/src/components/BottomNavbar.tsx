import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Image, Modal, Pressable,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { House, Mail, FolderOpen, User, Upload, PenLine, X } from 'lucide-react-native';

const plusSeal = require('../../assets/images/plus-seal.png');

type AnyIconProps = React.ComponentProps<typeof House>;

export default function BottomNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [modalVisible, setModalVisible] = useState(false);

  const activeColor = '#54110a';
  const inactiveColor = '#6D1B12';

  const handleUpload = () => {
    setModalVisible(false);
    router.push('/upload-card' as any);
  };

  const handleCreate = () => {
    setModalVisible(false);
    router.push('/create-card' as any);
  };

  return (
    <>
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.modalBox} onPress={() => {}}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add a Card</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X {...({ size: 20, color: '#7a2a2a' } as AnyIconProps)} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>What would you like to do?</Text>

            <TouchableOpacity style={styles.optionButton} onPress={handleUpload}>
              <View style={styles.optionIcon}>
                <Upload {...({ size: 20, color: '#7a2a2a' } as AnyIconProps)} />
              </View>
              <View>
                <Text style={styles.optionTitle}>Upload a Card</Text>
                <Text style={styles.optionDesc}>Import from your photos or files</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionButton} onPress={handleCreate}>
              <View style={styles.optionIcon}>
                <PenLine {...({ size: 20, color: '#7a2a2a' } as AnyIconProps)} />
              </View>
              <View>
                <Text style={styles.optionTitle}>Create a Card</Text>
                <Text style={styles.optionDesc}>Design one from scratch</Text>
              </View>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      <View style={styles.bottomNavbar}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.replace('/timelineScreen' as any)}
        >
          <House
            {...({
              size: pathname === '/timelineScreen' ? 34 : 30,
              color: pathname === '/timelineScreen' ? activeColor : inactiveColor,
            } as AnyIconProps)}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.replace('/messages' as any)}
        >
          <Mail
            {...({
              size: pathname === '/messages' ? 34 : 30,
              color: pathname === '/messages' ? activeColor : inactiveColor,
            } as AnyIconProps)}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, styles.centerButtonWrap]}
          onPress={() => setModalVisible(true)}
        >
          <Image source={plusSeal} style={styles.plusSealIcon} resizeMode="contain" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.replace('/view-folder copy' as any)}
        >
          <FolderOpen
            {...({
              size: pathname === '/view-folder copy' ? 34 : 30,
              color: pathname === '/view-folder copy' ? activeColor : inactiveColor,
            } as AnyIconProps)}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.replace('/profile' as any)}
        >
          <User
            {...({
              size: pathname === '/profile' ? 34 : 30,
              color: pathname === '/profile' ? activeColor : inactiveColor,
            } as AnyIconProps)}
          />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  /* ── Navbar ── */
  bottomNavbar: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    height: 80,
    backgroundColor: '#e9dccd',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
  },
  centerButtonWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusSealIcon: {
    width: 80,
    height: 80,
  },

  /* ── Modal overlay ── */
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',          // slides up from bottom
    paddingBottom: 100,                   // sits above the navbar
    paddingHorizontal: 16,
  },

  /* ── Modal box ── */
  modalBox: {
    backgroundColor: '#fdf6ee',           // matches your app's warm cream tone
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6D1B12',
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#9b6b6b',
    marginBottom: 16,
  },

  /* ── Option rows ── */
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#f0e4d4',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#e9dccd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6D1B12',
  },
  optionDesc: {
    fontSize: 12,
    color: '#9b6b6b',
    marginTop: 2,
  },
});