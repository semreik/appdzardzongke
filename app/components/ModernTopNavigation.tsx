import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useRef, useEffect } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View, LayoutChangeEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Menu } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  ReduceMotion,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../stores/useAuth';
import AnimatedButton from './AnimatedButton';

interface ModernTopNavigationProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const { width } = Dimensions.get('window');

interface TabLayout {
  x: number;
  width: number;
}

const ModernTopNavigation: React.FC<ModernTopNavigationProps> = ({ currentTab, onTabChange }) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const { logout } = useAuth();
  const [tabLayouts, setTabLayouts] = useState<Record<string, TabLayout>>({});

  // Animation values for indicator
  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(16);

  const tabs = [
    { key: 'DeckStack', label: 'Decks', icon: 'albums-outline', activeIcon: 'albums' },
    { key: 'Stats', label: 'Progress', icon: 'stats-chart-outline', activeIcon: 'stats-chart' },
    { key: 'Dictionary', label: 'Dictionary', icon: 'book-outline', activeIcon: 'book' },
    { key: 'Conversations', label: 'Chat', icon: 'chatbubbles-outline', activeIcon: 'chatbubbles' },
    { key: 'MultipleChoice', label: 'Quiz', icon: 'checkbox-outline', activeIcon: 'checkbox' },
    { key: 'Culture', label: 'Culture', icon: 'earth-outline', activeIcon: 'earth' },
  ];

  // Update indicator position when tab changes or layouts are measured
  useEffect(() => {
    const layout = tabLayouts[currentTab];
    if (layout) {
      indicatorX.value = withSpring(layout.x + layout.width / 2 - 8, {
        damping: 20,
        stiffness: 200,
        reduceMotion: ReduceMotion.System,
      });
    }
  }, [currentTab, tabLayouts]);

  const handleTabLayout = (key: string, event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    setTabLayouts(prev => ({
      ...prev,
      [key]: { x, width },
    }));
  };

  const handleTabPress = (tabKey: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onTabChange(tabKey);
  };

  const openMenu = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMenuVisible(true);
  };
  const closeMenu = () => setMenuVisible(false);

  const indicatorAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header with app title */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.appTitle}>Dzardzongke</Text>
          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitle}>Learn • Practice • Master</Text>
          </View>
        </View>
      </View>

      {/* Mobile Navigation Row - Tabs + Menu */}
      <View style={styles.mobileNavRow}>
        <View style={styles.tabScrollContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabScrollView}
          >
            {tabs.map((tab) => {
              const isActive = currentTab === tab.key;
              return (
                <AnimatedButton
                  key={tab.key}
                  style={[styles.tab, isActive && styles.activeTab]}
                  onPress={() => handleTabPress(tab.key)}
                  hapticFeedback="none"
                  onLayout={(event: LayoutChangeEvent) => handleTabLayout(tab.key, event)}
                >
                  <View style={styles.tabContent}>
                    <Ionicons
                      name={isActive ? tab.activeIcon : tab.icon}
                      size={18}
                      color={isActive ? '#6366f1' : '#6b7280'}
                    />
                    <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
                      {tab.label}
                    </Text>
                  </View>
                </AnimatedButton>
              );
            })}
            {/* Animated indicator */}
            <Animated.View style={[styles.animatedIndicator, indicatorAnimatedStyle]} />
          </ScrollView>
        </View>

        {/* Three dots menu - fixed position */}
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <AnimatedButton onPress={openMenu} style={styles.mobileMenuButton} hapticFeedback="light">
              <MaterialCommunityIcons name="dots-vertical" size={20} color="#6b7280" />
            </AnimatedButton>
          }
          contentStyle={styles.menuContent}
        >
          <AnimatedButton
            style={styles.menuItem}
            onPress={() => {
              closeMenu();
              navigation.navigate('Settings');
            }}
            hapticFeedback="light"
          >
            <MaterialCommunityIcons name="cog" size={18} color="#0f172a" />
            <Text style={styles.menuText}>Settings</Text>
          </AnimatedButton>
          <View style={styles.menuDivider} />
          <AnimatedButton
            style={styles.menuItem}
            onPress={() => {
              closeMenu();
              navigation.navigate('Profile');
            }}
            hapticFeedback="light"
          >
            <MaterialCommunityIcons name="bookmark-outline" size={18} color="#0f172a" />
            <Text style={styles.menuText}>Saved</Text>
          </AnimatedButton>
          <View style={styles.menuDivider} />
          <AnimatedButton
            style={styles.menuItem}
            onPress={() => {
              closeMenu();
              navigation.navigate('Credits');
            }}
            hapticFeedback="light"
          >
            <MaterialCommunityIcons name="information-outline" size={18} color="#0f172a" />
            <Text style={styles.menuText}>Credits</Text>
          </AnimatedButton>
          <View style={styles.menuDivider} />
          <AnimatedButton
            style={styles.menuItem}
            onPress={async () => {
              closeMenu();
              await logout();
            }}
            hapticFeedback="light"
          >
            <MaterialCommunityIcons name="logout" size={18} color="#0f172a" />
            <Text style={styles.menuText}>Logout</Text>
          </AnimatedButton>
        </Menu>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    paddingTop: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#6366f1',
    letterSpacing: -0.8,
    marginBottom: 2,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  mobileNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: '#ffffff',
  },
  tabScrollContainer: {
    flex: 1,
    position: 'relative',
  },
  tabScrollView: {
    alignItems: 'center',
    paddingRight: 8,
    position: 'relative',
  },
  tab: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginHorizontal: 2,
    position: 'relative',
    minWidth: 60,
  },
  activeTab: {
    backgroundColor: '#f0f4ff',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 2,
    textAlign: 'center',
  },
  activeTabLabel: {
    color: '#6366f1',
    fontWeight: '700',
  },
  animatedIndicator: {
    position: 'absolute',
    bottom: 2,
    width: 16,
    height: 3,
    backgroundColor: '#6366f1',
    borderRadius: 1.5,
  },
  mobileMenuButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginLeft: 8,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuText: {
    color: '#0f172a',
    fontWeight: '600',
    fontSize: 16,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 16,
  },
});

export default ModernTopNavigation;
