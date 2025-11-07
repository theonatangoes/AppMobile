import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// --- CHAVE API ---
const API_KEY = "a3e121329c34edcf8c5ae339c9876e4b";

// Interface para os dados do clima
interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    pressure: number;
  };
  weather: [
    {
      description: string;
      main: string;
      icon: string;
    }
  ];
  wind: {
    speed: number;
  };
  sys: {
    sunrise: number;
    sunset: number;
    country: string;
  };
  visibility: number;
  timezone: number;
  dt: number;
}

// Cidades para a tela de busca
const recommendedCities = [
  "Brasília",
  "Salvador",
  "São Paulo",
  "Rio de Janeiro",
  "Florianópolis",
  "Recife",
  "Porto Alegre",
  "Goiânia",
  "Belo Horizonte",
];
const popularCities = [
  "Beijing",
  "Shanghai",
  "Tokyo",
  "New York",
  "London",
  "Paris",
];

// === NOVAS IMAGENS DE FUNDO ===
const backgroundImages = {
  // CEU ABERTO - SOL (01d) e POUCAS NUVENS (02d)
  "01d":
    "https://images.unsplash.com/photo-1590073242678-70ee3c2f8293?q=80&w=1974&auto=format&fit=crop", // Céu azul com nuvens
  "02d":
    "https://images.unsplash.com/photo-1590073242678-70ee3c2f8293?q=80&w=1974&auto=format&fit=crop", // Céu azul com nuvens

  // NOITE (01n, 02n)
  "01n":
    "https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?q=80&w=2072&auto=format&fit=crop", // Céu estrelado
  "02n":
    "https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?q=80&w=2072&auto=format&fit=crop", // Céu estrelado

  // NUBLADO (03d, 04d)
  "03d":
    "https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?q=80&w=2070&auto=format&fit=crop", // Dia nublado/encoberto
  "04d":
    "https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?q=80&w=2070&auto=format&fit=crop", // Dia nublado/encoberto

  // NUBLADO NOITE (03n, 04n)
  "03n":
    "https://images.unsplash.com/photo-1532178235361-a3b04c1c49c2?q=80&w=1974&auto=format&fit=crop", // Noite nublada
  "04n":
    "https://images.unsplash.com/photo-1532178235361-a3b04c1c49c2?q=80&w=1974&auto=format&fit=crop", // Noite nublada

  // CHUVA (09d, 09n, 10d, 10n)
  "09d":
    "https://images.unsplash.com/photo-1515694346937-94d85e41e622?q=80&w=1974&auto=format&fit=crop", // Chuva (vidro molhado)
  "09n":
    "https://images.unsplash.com/photo-1515694346937-94d85e41e622?q=80&w=1974&auto=format&fit=crop", // Chuva (vidro molhado)
  "10d":
    "https://images.unsplash.com/photo-1515694346937-94d85e41e622?q=80&w=1974&auto=format&fit=crop", // Chuva (vidro molhado)
  "10n":
    "https://images.unsplash.com/photo-1515694346937-94d85e41e622?q=80&w=1974&auto=format&fit=crop", // Chuva (vidro molhado)

  // TROVÕES (11d, 11n)
  "11d":
    "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?q=80&w=2071&auto=format&fit=crop", // Tempestade / Raio
  "11n":
    "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?q=80&w=2071&auto=format&fit=crop", // Tempestade / Raio

  // NEVE (13d, 13n)
  "13d":
    "https://images.unsplash.com/photo-1547754980-3df97fed72a8?q=80&w=1974&auto=format&fit=crop", // Neve dia
  "13n":
    "https://images.unsplash.com/photo-1547754980-3df97fed72a8?q=80&w=1974&auto=format&fit=crop", // Neve

  // NEBLINA (50d, 50n)
  "50d":
    "https://images.unsplash.com/photo-1543968313-28b43f003433?q=80&w=1974&auto=format&fit=crop", // Neblina
  "50n":
    "https://images.unsplash.com/photo-1543968313-28b43f003433?q=80&w=1974&auto=format&fit=crop", // Neblina

  // PADRÃO
  default_day:
    "https://images.unsplash.com/photo-1590073242678-70ee3c2f8293?q=80&w=1974&auto=format&fit=crop", // Padrão Dia
  default_night:
    "https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?q=80&w=2072&auto=format&fit=crop", // Padrão Noite
};

// Mapeamento de ícones
const weatherConditions: { [key: string]: any } = {
  "01d": { icon: "weather-sunny", description: "Céu limpo" },
  "01n": { icon: "weather-night", description: "Céu limpo" },
  "02d": { icon: "weather-partly-cloudy", description: "Poucas nuvens" },
  "02n": { icon: "weather-night-partly-cloudy", description: "Poucas nuvens" },
  "03d": { icon: "weather-cloudy", description: "Nublado" },
  "03n": { icon: "weather-cloudy", description: "Nublado" },
  "04d": { icon: "weather-cloudy", description: "Muito nublado" },
  "04n": { icon: "weather-cloudy", description: "Muito nublado" },
  "09d": { icon: "weather-pouring", description: "Chuva forte" },
  "09n": { icon: "weather-pouring", description: "Chuva forte" },
  "10d": { icon: "weather-rainy", description: "Chuva" },
  "10n": { icon: "weather-rainy", description: "Chuva" },
  "11d": { icon: "weather-lightning", description: "Tempestade" },
  "11n": { icon: "weather-lightning", description: "Tempestade" },
  "13d": { icon: "weather-snowy", description: "Neve" },
  "13n": { icon: "weather-snowy", description: "Neve" },
  "50d": { icon: "weather-fog", description: "Neblina" },
  "50n": { icon: "weather-fog", description: "Neblina" },
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [currentBackground, setCurrentBackground] = useState<string>(
    backgroundImages.default_day
  );
  const [cityLocalTime, setCityLocalTime] = useState<string>("");

  // Efeito principal
  useEffect(() => {
    initializeApp();
  }, []);

  // Atualiza o fundo quando os dados do clima mudam
  useEffect(() => {
    if (weatherData) {
      updateBackgroundAndTime();
    }
  }, [weatherData]);

  const updateBackgroundAndTime = () => {
    if (!weatherData) return;

    // CALCULA HORA LOCAL DA CIDADE CORRETAMENTE
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const cityTime = new Date(utc + weatherData.timezone * 1000);

    const hours = cityTime.getHours();
    const minutes = cityTime.getMinutes();
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;

    setCityLocalTime(formattedTime);

    // DETERMINA SE É DIA OU NOITE (6h às 18h = dia)
    const isDayTime = hours >= 6 && hours < 18;

    // USA O ÍCONE DA API PARA DETERMINAR O CLIMA EXATO
    const weatherIcon = weatherData.weather[0].icon;

    console.log("🔍 DETALHES DA CIDADE:");
    console.log("Cidade:", weatherData.name);
    console.log("Fuso horário:", weatherData.timezone);
    console.log("Hora UTC:", now.toUTCString());
    console.log("Hora local cidade:", formattedTime);
    console.log("É dia?", isDayTime);
    console.log("Ícone da API:", weatherIcon);
    console.log("Condição:", weatherData.weather[0].main);
    console.log("Descrição:", weatherData.weather[0].description);

    // SELECIONA O FUNDO BASEADO NO ÍCONE EXATO DA API
    const backgroundUrl =
      backgroundImages[weatherIcon as keyof typeof backgroundImages] ||
      (isDayTime
        ? backgroundImages.default_day
        : backgroundImages.default_night);

    setCurrentBackground(backgroundUrl);
  };

  const initializeApp = async () => {
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg(
          "📍 Permissão de localização negada. Use a busca para encontrar uma cidade."
        );
        setLoading(false);
        setIsSearching(true);
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      await fetchWeatherByCoords(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      );
    } catch (error) {
      console.error("Erro na localização:", error);
      await fetchWeatherByCity("São Paulo");
    }
  };

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await axios.get<WeatherData>(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt_br`
      );

      if (response.data) {
        setWeatherData(response.data);
      }
    } catch (error: any) {
      console.error("Erro na API:", error);
      handleApiError(error, "sua localização");
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCity = async (city: string) => {
    if (!city.trim()) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await axios.get<WeatherData>(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city
        )}&appid=${API_KEY}&units=metric&lang=pt_br`
      );

      if (response.data) {
        console.log("🎯 DADOS DA CIDADE BUSCADA:");
        console.log("Nome:", response.data.name);
        console.log("País:", response.data.sys.country);
        console.log("Fuso horário:", response.data.timezone);
        console.log("Ícone:", response.data.weather[0].icon);
        setWeatherData(response.data);
      }
    } catch (error: any) {
      console.error("Erro ao buscar cidade:", error);
      handleApiError(error, city);
    } finally {
      setLoading(false);
      setIsSearching(false);
      setSearchQuery("");
    }
  };

  const handleApiError = (error: any, location: string) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          setErrorMsg("🔑 CHAVE API INVÁLIDA");
          break;
        case 404:
          setErrorMsg(`📍 Cidade "${location}" não encontrada`);
          break;
        case 429:
          setErrorMsg("⚡ Limite de requisições excedido");
          break;
        default:
          setErrorMsg(`❌ Erro ${error.response.status}`);
      }
    } else if (error.request) {
      setErrorMsg("🌐 Sem conexão com a internet");
    } else {
      setErrorMsg(`⚠️ Erro ao buscar: ${location}`);
    }
  };

  const msToKmh = (speed: number) => (speed * 3.6).toFixed(1);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Função para obter informações do ícone
  const getWeatherIconInfo = () => {
    if (!weatherData) return weatherConditions["01d"];
    const weatherIcon = weatherData.weather[0].icon;
    return weatherConditions[weatherIcon] || weatherConditions["01d"];
  };

  // Função para verificar se é dia ou noite
  const getTimeOfDay = () => {
    if (!cityLocalTime) return "day";
    const hours = parseInt(cityLocalTime.split(":")[0]);
    return hours >= 6 && hours < 18 ? "day" : "night";
  };

  /**
   * Renderiza tela de busca
   */
  const renderSearchScreen = () => (
    <View style={styles.searchContainer}>
      <TouchableOpacity style={styles.searchButton} onPress={initializeApp}>
        <MaterialCommunityIcons
          name="map-marker-outline"
          size={20}
          color="#fff"
        />
        <Text style={styles.searchButtonText}>Minha localização atual</Text>
      </TouchableOpacity>

      <Text style={styles.searchSectionTitle}>Cidades Brasileiras</Text>
      <View style={styles.cityGrid}>
        {recommendedCities.map((city) => (
          <TouchableOpacity
            key={city}
            style={styles.cityCard}
            onPress={() => fetchWeatherByCity(city)}
          >
            <Text style={styles.cityCardText}>{city}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.searchSectionTitle}>Cidades Internacionais</Text>
      <View style={styles.cityGrid}>
        {popularCities.map((city) => (
          <TouchableOpacity
            key={city}
            style={styles.cityCard}
            onPress={() => fetchWeatherByCity(city)}
          >
            <Text style={styles.cityCardText}>{city}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  /**
   * Renderiza tela principal do clima
   */
  const renderWeatherScreen = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>
            Buscando dados meteorológicos...
          </Text>
        </View>
      );
    }

    if (errorMsg && !weatherData) {
      return (
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons
            name="weather-cloudy-alert"
            size={64}
            color="#FF6B6B"
          />
          <Text style={styles.errorText}>{errorMsg}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => setIsSearching(true)}
          >
            <Text style={styles.retryButtonText}>Buscar Outra Cidade</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!weatherData) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Nenhum dado meteorológico disponível
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => setIsSearching(true)}
          >
            <Text style={styles.retryButtonText}>Buscar Cidade</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const timeOfDay = getTimeOfDay();
    const weatherIconInfo = getWeatherIconInfo();

    return (
      <View style={styles.weatherContainer}>
        {/* Indicador de Horário Local */}
        <View style={styles.timeIndicator}>
          <MaterialCommunityIcons
            name={timeOfDay === "day" ? "weather-sunny" : "weather-night"}
            size={16}
            color="#FFF"
          />
          <Text style={styles.timeIndicatorText}>
            {timeOfDay === "day" ? "☀️ Dia" : "🌙 Noite"} • {cityLocalTime} •{" "}
            {weatherData.weather[0].description}
          </Text>
        </View>

        {/* Cabeçalho com cidade */}
        <View style={styles.header}>
          <Text style={styles.cityName}>{weatherData.name}</Text>
          <Text style={styles.countryText}>{weatherData.sys.country}</Text>
        </View>

        {/* Temperatura Principal */}
        <View style={styles.tempContainer}>
          <View style={styles.tempWrapper}>
            <Text style={styles.tempText}>
              {Math.round(weatherData.main.temp)}
            </Text>
            <Text style={styles.tempUnit}>°C</Text>
          </View>
          <View style={styles.conditionContainer}>
            <MaterialCommunityIcons
              name={weatherIconInfo.icon}
              size={40}
              color="white"
            />
          </View>
        </View>

        {/* Detalhes do Clima */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Feather name="thermometer" size={20} color="#aaa" />
            <Text style={styles.detailText}>
              {Math.round(weatherData.main.temp_min)}° /{" "}
              {Math.round(weatherData.main.temp_max)}°
            </Text>
            <Text style={styles.detailLabel}>Min/Max</Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons
              name="account-outline"
              size={20}
              color="#aaa"
            />
            <Text style={styles.detailText}>
              {Math.round(weatherData.main.feels_like)}°
            </Text>
            <Text style={styles.detailLabel}>Sensação</Text>
          </View>
          <View style={styles.detailItem}>
            <Feather name="wind" size={20} color="#aaa" />
            <Text style={styles.detailText}>
              {msToKmh(weatherData.wind.speed)} km/h
            </Text>
            <Text style={styles.detailLabel}>Vento</Text>
          </View>
          <View style={styles.detailItem}>
            <Feather name="droplet" size={20} color="#aaa" />
            <Text style={styles.detailText}>{weatherData.main.humidity}%</Text>
            <Text style={styles.detailLabel}>Umidade</Text>
          </View>
        </View>

        {/* Nascer e Pôr do Sol */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nascer e Pôr do Sol</Text>
          <View style={styles.sunContainer}>
            <View style={styles.sunItem}>
              <Feather name="sunrise" size={28} color="#F9A825" />
              <Text style={styles.sunTime}>
                {formatTime(weatherData.sys.sunrise)}
              </Text>
              <Text style={styles.sunLabel}>Nascer do Sol</Text>
            </View>
            <View style={styles.sunDivider} />
            <View style={styles.sunItem}>
              <Feather name="sunset" size={28} color="#F4511E" />
              <Text style={styles.sunTime}>
                {formatTime(weatherData.sys.sunset)}
              </Text>
              <Text style={styles.sunLabel}>Pôr do Sol</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ImageBackground
      source={{ uri: currentBackground }}
      style={styles.background}
      imageStyle={{ opacity: 0.8 }} // Você pode ajustar a opacidade aqui
    >
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Barra de Busca */}
          <View style={styles.searchBarContainer}>
            <Feather
              name="search"
              size={20}
              color="#fff"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar cidade..."
              placeholderTextColor="#ddd"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setIsSearching(true)}
              onSubmitEditing={() => fetchWeatherByCity(searchQuery)}
              returnKeyType="search"
            />
            {isSearching && (
              <TouchableOpacity
                onPress={() => {
                  setIsSearching(false);
                  setSearchQuery("");
                }}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Conteúdo Principal */}
          {isSearching ? renderSearchScreen() : renderWeatherScreen()}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

// Estilos
const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: "#1a1a2e" },
  container: { flex: 1 },
  scrollContent: { flexGrow: 1 },

  timeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "center",
    marginBottom: 10,
  },
  timeIndicatorText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 15,
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  // === ESTILO DA BARRA DE PESQUISA MODIFICADO ===
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    // margin: 15, // <--- Linha antiga
    marginHorizontal: 15, // Mantém o espaçamento lateral
    marginTop: 50, // <--- AUMENTA O ESPAÇAMENTO SUPERIOR
    marginBottom: 15, // Mantém o espaçamento inferior
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  searchIcon: { marginRight: 10 },
  searchInput: {
    flex: 1,
    color: "white",
    fontSize: 16,
    paddingVertical: 2,
  },
  cancelButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },

  weatherContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 10,
  },
  cityName: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  countryText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    marginTop: 5,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  tempContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginTop: 30,
    paddingHorizontal: 10,
  },
  tempWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  tempText: {
    color: "white",
    fontSize: 96,
    fontWeight: "200",
    lineHeight: 96,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
  tempUnit: {
    color: "white",
    fontSize: 32,
    fontWeight: "300",
    marginTop: 10,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  conditionContainer: {
    alignItems: "center",
    marginTop: 10,
  },

  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  detailItem: {
    alignItems: "center",
    flex: 1,
  },
  detailText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  detailLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    marginTop: 4,
  },

  card: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  cardTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  sunContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  sunItem: {
    alignItems: "center",
    flex: 1,
  },
  sunDivider: {
    width: 1,
    height: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  sunTime: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    marginTop: 8,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  sunLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    marginTop: 4,
  },

  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 18,
    borderRadius: 15,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  searchButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 12,
  },
  searchSectionTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 15,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  cityGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cityCard: {
    width: "48%",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingVertical: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  cityCardText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
});
