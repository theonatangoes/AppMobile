# 🌤️ Clima Mobile

Aplicativo de previsão do tempo desenvolvido com **React Native** e **Expo**, que utiliza a **API do OpenWeatherMap** para exibir informações meteorológicas em tempo real com base na **localização atual do usuário** ou na **busca por cidades**.  
O app ajusta automaticamente o **fundo dinâmico** e os **ícones** conforme o clima e o período (dia/noite).

---

## 🚀 Tecnologias Utilizadas

- **React Native (Expo)**
- **TypeScript**
- **Axios** – requisições HTTP
- **Expo Location** – acesso à localização do dispositivo
- **OpenWeatherMap API** – dados meteorológicos
- **@expo/vector-icons** – ícones de clima e interface
- **React Hooks (useState, useEffect)**

---

## 🧭 Funcionalidades

✅ **Detecta automaticamente a localização atual** do usuário e exibe o clima local.  
✅ **Busca manual de cidades** nacionais e internacionais.  
✅ **Fundos dinâmicos** que mudam conforme o tipo de clima e horário (dia/noite).  
✅ **Ícones e descrições atualizados** conforme o estado do tempo.  
✅ **Informações detalhadas**:

- Temperatura atual, mínima e máxima
- Sensação térmica
- Velocidade do vento
- Umidade
- Horário de nascer e pôr do sol  
  ✅ **Tratamento de erros e mensagens amigáveis** (sem internet, cidade não encontrada, API inválida etc.).

---

## 🖼️ Exemplo de Telas

| Tela Inicial                             | Busca de Cidades                     | Clima Detalhado                         |
| ---------------------------------------- | ------------------------------------ | --------------------------------------- |
| 🌎 Mostra clima atual da sua localização | 🔍 Permite buscar por outras cidades | ☀️ Exibe fundo e ícone conforme o clima |

---

## 🔑 Configuração da API

1. Crie uma conta gratuita no [OpenWeatherMap](https://openweathermap.org/api)
2. Copie sua **API Key**
3. Substitua no código a constante:

```ts
const API_KEY = "SUA_CHAVE_AQUI";
```
