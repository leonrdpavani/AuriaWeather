# Auria Weather 🌦️

App de clima animado e imersivo, feito com **Expo** (React Native) — roda em
**Android, iOS e Web** a partir de uma única base de código.

> App 100% nativo em Expo / React Native, com fundo reativo ao clima,
> partículas e ícones animados. Dados em modo mock por enquanto (prontos para
> plugar uma API real).

## Stack

- **Expo SDK 56** + **expo-router** (rotas por arquivo)
- **NativeWind v4** (Tailwind no React Native)
- **Reanimated 4 + Moti** (animações)
- **react-native-svg**, **expo-linear-gradient**, **expo-blur** (efeitos)
- **lucide-react-native** (ícones)

---

## ⚠️ Antes de tudo: este app NÃO roda no Expo Go

O app **Expo Go** (aquele da Play Store) é antigo demais para o SDK 56 e dá o erro
`Incompatible SDK Version`. Para rodar no celular, usamos um **development build**
— que é, na prática, **o nosso próprio "Expo Go" feito sob medida** para este
projeto. Você instala ele **uma vez** e desenvolve normalmente.

---

## 🚀 Rodar no celular (dia a dia)

Depois que o development build já está instalado no seu celular (veja
["Primeira vez"](#-primeira-vez-gerar-o-app-para-o-celular) abaixo):

```bash
npm install                    # só na primeira vez / quando mudar dependências
npx expo start --dev-client
```

1. Deixe esse comando rodando no PC.
2. No celular (**mesma Wi-Fi** do PC), abra o app **Auria Weather (Dev)**.
3. Ele conecta sozinho e roda o projeto. **Edite o código → recarrega ao vivo.** ✨

Comandos úteis:

| Situação | Comando |
|---|---|
| Redes diferentes / Wi-Fi corporativa | `npx expo start --dev-client --tunnel` |
| Comportamento estranho / cache velho | `npx expo start --dev-client --clear` |
| Não conectou sozinho | escaneie o QR do terminal pelo próprio app |

> 💡 Mudança de **código** (telas, lógica, estilo) recarrega na hora, sem
> rebuildar. Você **só** precisa gerar um novo build quando adicionar uma
> **biblioteca nativa** nova.

### Ver rápido no navegador (sem celular)

```bash
npx expo start --web
```

Abre em segundos. Ótimo pra conferir layout/navegação, mas alguns efeitos nativos
(como o desfoque do vidro) ficam aproximados.

---

## 📦 Primeira vez: gerar o app para o celular

Os builds são feitos na **nuvem (EAS Build)** — não precisa instalar Android
Studio. Precisa de uma **conta Expo gratuita** (crie em [expo.dev](https://expo.dev)).

```bash
npm install -g eas-cli                                  # instala o CLI do EAS
eas login                                               # entra na sua conta
eas build --profile development --platform android      # ~10-15 min na nuvem
```

No fim, o EAS te dá um **link/QR**. Abra **no celular**, baixe o APK e instale
(autorize "instalar de fontes desconhecidas"). Pronto — agora é só o fluxo do
["dia a dia"](#-rodar-no-celular-dia-a-dia) acima.

### Os dois tipos de build (não confundir!)

| Build | Pra quê | Recarrega ao vivo? | Nome no celular |
|---|---|---|---|
| **development** | **Desenvolver** | ✅ Sim | Auria Weather (Dev) |
| **preview** | Só testar a **velocidade final** | ❌ Não (é um snapshot) | Auria Weather (Preview) |

```bash
eas build --profile preview --platform android    # gera o snapshot otimizado
```

> Cada perfil vira um app com **identificador diferente**
> (`com.auria.weather.dev`, `.preview`, produção `com.auria.weather`), então os
> dois **convivem** no celular sem um apagar o outro.

---

## 🧱 Estrutura do projeto

Tudo vive em `src/` (alias `@/*`). As convenções completas — camadas, onde cada
coisa vive, regras invioláveis — estão em [`ARQUITETURA.md`](./ARQUITETURA.md).

```
src/
  app/            # rotas (expo-router): _layout + grupo (tabs) + +not-found
  features/       # domínio (weather): components, hooks, types
  ui/             # design system: primitives, patterns, tokens
  lib/            # api, config, utils (sem plataforma)
  components/     # chrome de tela compartilhado (ex: fundo)
  constants/      # paleta crua p/ ícones/SVG/gradientes
```

**Regra de ouro:** a dependência flui numa direção só — `app → features → ui/lib`.
Camada de baixo nunca importa de camada de cima.

---

## 🩺 Conferir a saúde do projeto

```bash
npx expo-doctor        # 21 checagens oficiais do Expo
npx expo install --check   # confere se as deps batem com o SDK
npm run typecheck      # tsc --noEmit (erros de tipo)
npm run lint           # eslint (preset oficial do Expo)
```

Se o `expo install --check` reclamar de versão, conserte com
`npx expo install --fix`.

---

## 🏪 Publicar (Play Store / App Store)

```bash
eas build --platform android      # AAB para a Play Store
eas build --platform ios          # IPA para a App Store (precisa de macOS/EAS)
```

Publicar de verdade exige conta **Google Play** (US$ 25, uma vez) e/ou **Apple
Developer** (US$ 99/ano).

---

## 📜 Scripts

| Comando | O que faz |
|---|---|
| `npx expo start --dev-client` | Dev server para o development build (uso diário) |
| `npm run web` | Abre no navegador |
| `npm run lint` | ESLint |
| `npm run typecheck` | Checagem de tipos (`tsc --noEmit`) |
