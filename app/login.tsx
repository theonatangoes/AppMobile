import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import LogoImage from "../assets/images/n1 1.png";

export default function LoginScreen() {
  const router = useRouter();

  const handleLogin = () => {
    router.replace("/profiles");
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Image source={LogoImage} style={styles.headerLogoImage} />
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Email ou telefone</Text>
        <TextInput style={styles.input} placeholderTextColor="#aaa" />
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholderTextColor="#aaa"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.link}>Precisa de ajuda?</Text>
        <Text style={styles.link}>Novo por aqui? Assine agora.</Text>
        <Text style={styles.recaptchaText}>
          O login é protegido pelo Google reCAPTCHA para{"\n"}
          garantir que você não é um bot.{"\n"}
          Saiba mais.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  backButton: {
    marginRight: 10,
    height: 50,
    justifyContent: "center",
  },
  backArrow: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  headerLogoImage: {
    width: 150,
    height: 50,
    resizeMode: "contain",
  },
  inputWrapper: {
    width: "100%",
    marginBottom: 16,
    position: "relative",
    justifyContent: "center",
  },
  label: {
    position: "absolute",
    top: 10,
    left: 15,
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    zIndex: 1,
  },
  input: {
    backgroundColor: "#656060",
    borderRadius: 10,
    color: "#fff",
    fontSize: 16,
    height: 65,
    paddingHorizontal: 15,
    paddingTop: 30,
  },
  button: {
    backgroundColor: "#0F1010",
    padding: 15,
    borderRadius: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "white",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 40,
    alignItems: "center",
  },
  link: {
    color: "#aaa",
    marginTop: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  recaptchaText: {
    color: "#8c8c8c",
    textAlign: "center",
    marginTop: 20,
    fontSize: 13,
    alignSelf: "center",
    lineHeight: 20,
  },
});
