import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import LogoImage from "../assets/images/n1 1.png";
import Profile2 from "../assets/images/perfil amarelo.png";
import Profile5 from "../assets/images/perfil azul claro.png";
import Profile1 from "../assets/images/perfil azul escuro.png";
import Profile3 from "../assets/images/perfil verde.png";
import Profile4 from "../assets/images/perfil vermelho.png";

export default function ProfilesScreen() {
  const router = useRouter();

  const selectProfile = () => {
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <Image source={LogoImage} style={styles.logoImage} />
      <Text style={styles.title}>Quem está assistindo?</Text>

      <ScrollView contentContainerStyle={styles.grid}>
        <TouchableOpacity
          style={styles.profileContainer}
          onPress={selectProfile}
        >
          <Image source={Profile1} style={styles.profileImage} />
          <Text style={styles.name}>Theo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.profileContainer}
          onPress={selectProfile}
        >
          <Image source={Profile2} style={styles.profileImage} />
          <Text style={styles.name}>Cauã</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.profileContainer}
          onPress={selectProfile}
        >
          <Image source={Profile3} style={styles.profileImage} />
          <Text style={styles.name}>Vitório</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.profileContainer}
          onPress={selectProfile}
        >
          <Image source={Profile4} style={styles.profileImage} />
          <Text style={styles.name}>Caetano</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.profileContainer}
          onPress={selectProfile}
        >
          <Image source={Profile5} style={styles.profileImage} />
          <Text style={styles.name}>Cristiano</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.profileContainer} disabled />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 80,
  },
  logoImage: {
    width: "80%",
    height: 50,
    resizeMode: "contain",
    marginBottom: 50,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    marginBottom: 40,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    maxWidth: 400,
  },
  profileContainer: {
    width: 120,
    height: 120,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 80,
    height: 80,
    resizeMode: "cover",
  },
  name: {
    color: "#fff",
    marginTop: 5,
    fontSize: 16,
  },
});
