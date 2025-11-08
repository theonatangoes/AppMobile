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
  coord: {
    lat: number;
    lon: number;
  };
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

// Imagens de fundo (mantidas as mesmas)
const backgroundImages = {
  "01d":
    "https://images.unsplash.com/photo-1601297183305-6df142704ea2?q=80&w=1974&auto=format&fit=crop",
  "02d":
    "https://img.freepik.com/fotos-gratis/bela-paisagem-celeste-durante-o-dia_23-2149265586.jpg?semt=ais_hybrid&w=740&q=80",
  "01n":
    "https://img.freepik.com/fotos-gratis/imagem-vertical-de-um-belo-ceu-estrelado_181624-42267.jpg?semt=ais_hybrid&w=740&q=80",
  "02n":
    "https://images.unsplash.com/photo-1595178302776-fa04e6d45879?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGMlQzMlQTl1JTIwZXN0cmVsYWRvfGVufDB8fDB8fHww&fm=jpg&q=60&w=3000",
  "03d":
    "https://img.freepik.com/fotos-premium/natureza-do-sol-no-ceu-nublado-com-nuvens_73110-10563.jpg",
  "04d":
    "https://img.freepik.com/fotos-gratis/nuvens-de-tempestade_1122-2845.jpg",
  "03n":
    "https://images.unsplash.com/photo-1500740516770-92bd004b996e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDExfHx8ZW58MHx8fHx8",
  "04n":
    "https://images.unsplash.com/photo-1595736516846-c9fe0cb86f7c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YyVDMyVBOXUlMjBub3R1cm5vJTIwbnVibGFkb3xlbnwwfHwwfHx8MA%3D%3D&fm=jpg&q=60&w=3000",
  "09d":
    "https://media.istockphoto.com/id/2183276741/pt/foto/dark-overcast-sky-with-heavy-rain-and-lightning-intense-weather-phenomenon.jpg?s=612x612&w=0&k=20&c=tFGmcMSTCig3yTyQI3UDjTH_FUGVc4OQ-6UlbPmjhL0=",
  "09n":
    "https://static.vecteezy.com/ti/fotos-gratis/p2/8900318-chuva-a-noite-fundo-escuro-tiro-de-chuva-caindo-gratis-foto.JPG",
  "10d":
    "https://img.freepik.com/fotos-premium/a-chuva-cai-na-janela-com-nuvens-e-fundo-do-ceu-apos-a-chuva_719722-909.jpg",
  "10n":
    "https://img.freepik.com/fotos-premium/foto-impressionante-fundo-preto-com-chuva-forte-caindo-gotas-de-chuva-batendo-no-chao-chuvoso-ceu-noturno-um_900706-61077.jpg?semt=ais_hybrid&w=740&q=80",
  "11d": "https://pixnio.com/free-images/2017/08/15/2017-08-15-09-58-11.jpg",
  "11n":
    "https://pixnio.com/free-images/2017/08/31/2017-08-31-06-26-19-1000x662.jpg",
  "13d":
    "https://img.freepik.com/fotos-gratis/bela-foto-de-montanhas-e-arvores-cobertas-de-neve-e-neblina_181624-17590.jpg?semt=ais_hybrid&w=740&q=80",
  "13n":
    "https://img.freepik.com/fotos-gratis/vista-do-ceu-noturno-estrelado-com-natureza-e-paisagem-montanhosa_23-2151614765.jpg?semt=ais_hybrid&w=740&q=80",
  "50d":
    "https://uploads.metroimg.com/wp-content/uploads/2017/02/28093850/Neblina.jpg",
  "50n":
    "https://s2-g1.glbimg.com/QCRy0SnilibLE2tWlhqaK5CetJc=/0x0:1600x1200/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2022/p/P/rpZhDfT9iHhytlmSazRg/nevoa-belem-christian-emanoel.jpeg",
  default_day:
    "https://images.unsplash.com/photo-1601297183305-6df142704ea2?q=80&w=1974&auto=format&fit=crop",
  default_night:
    "https://www.shutterstock.com/image-photo/movement-stars-night-sky-view-600nw-2626239147.jpg",
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

    try {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const cityTime = new Date(utc + weatherData.timezone * 1000);

      const hours = cityTime.getHours();
      const minutes = cityTime.getMinutes();
      const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;

      setCityLocalTime(formattedTime);

      const isDayTime = hours >= 6 && hours < 18;
      const weatherIcon = weatherData.weather[0].icon;

      const backgroundUrl =
        backgroundImages[weatherIcon as keyof typeof backgroundImages] ||
        (isDayTime
          ? backgroundImages.default_day
          : backgroundImages.default_night);

      setCurrentBackground(backgroundUrl);
    } catch (error) {
      console.error("Erro ao calcular hora local:", error);
      setCityLocalTime("--:--");
    }
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

  const getWeatherIconInfo = () => {
    if (!weatherData) return weatherConditions["01d"];
    const weatherIcon = weatherData.weather[0].icon;
    return weatherConditions[weatherIcon] || weatherConditions["01d"];
  };

  const getTimeOfDay = () => {
    if (!cityLocalTime || cityLocalTime === "--:--") return "day";
    const hours = parseInt(cityLocalTime.split(":")[0]);
    return hours >= 6 && hours < 18 ? "day" : "night";
  };

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

        <View style={styles.header}>
          <Text style={styles.cityName}>{weatherData.name}</Text>
          <Text style={styles.countryText}>{weatherData.sys.country}</Text>
        </View>

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
      imageStyle={{ opacity: 0.9 }}
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

          {isSearching ? renderSearchScreen() : renderWeatherScreen()}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

// ESTILOS COMPLETOS E CORRETOS
const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  // Barra de pesquisa
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    marginHorizontal: 15,
    marginTop: 50,
    marginBottom: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  searchIcon: {
    marginRight: 10,
  },
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

  // Tela de busca
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

  // Indicador de tempo
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

  // Loading e erro
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

  // Container principal do clima
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

  // Temperatura
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

  // Detalhes
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

  // Card do sol
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
  sunDivider: {
    width: 1,
    height: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
});
