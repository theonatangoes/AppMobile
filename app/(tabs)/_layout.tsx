import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: 'black',
          borderTopColor: 'transparent',
          height: 60,
          paddingBottom: 5,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="new_hot"
        options={{
          title: 'Novidades',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="play-box-multiple" size={24} color={color} />
          ),
      }}
    />

      <Tabs.Screen
        name="search"
        options={{
          title: 'Pesquisar',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="magnify" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="downloads"
        options={{
          title: 'Baixados',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="arrow-down-circle-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}