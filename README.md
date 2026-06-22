# Auria Weather

App de clima animado e imersivo, construído com **Expo** (React Native) — pronto
para rodar em **Android, iOS e Web** a partir de uma única base de código.

> Migrado de um protótipo Next.js para Expo. A camada de lógica (API/tipos/
> formatação) foi portada; toda a UI foi reescrita em React Native com paridade
> visual (fundo reativo ao clima, partículas, ícones animados).

## Stack

- **Expo SDK 56** + **expo-router** (rotas por arquivo)
- **NativeWind v4** (Tailwind no React Native)
- **Reanimated 4 + Moti** (animações)
- **react-native-svg**, **expo-linear-gradient**, **expo-blur** (efeitos)
- **lucide-react-native** (ícones de UI)

## Rodando o projeto

```bash
npm install
npx expo start
```

Depois, no terminal do Expo:

- aperte **a** para abrir no emulador Android (ou escaneie o QR no app **Expo Go**)
- aperte **i** para o simulador iOS (requer macOS)
- aperte **w** para abrir no navegador

## Scripts

| Comando            | O que faz                                  |
|--------------------|--------------------------------------------|
| `npm start`        | Inicia o Metro / dev server do Expo        |
| `npm run android`  | Abre no Android                            |
| `npm run ios`      | Abre no iOS (macOS)                         |
| `npm run web`      | Abre no navegador                          |
| `npm run lint`     | ESLint (preset oficial do Expo)            |
| `npm run typecheck`| `tsc --noEmit`                             |

## Estrutura

Tudo vive em `src/` (alias `@/*`). As convenções de arquitetura — camadas,
onde cada coisa vive, regras invioláveis — estão em [`ARQUITETURA.md`](./ARQUITETURA.md).

```
src/
  app/            # rotas (expo-router): _layout + grupo (tabs)
  features/       # domínio (weather): components, hooks, types
  ui/             # design system: primitives, patterns, tokens
  lib/            # api, config, utils (sem plataforma)
  components/     # chrome de tela compartilhado
  constants/      # paleta crua p/ ícones/SVG/gradientes
```

## Publicando (Play Store / App Store)

O build de produção é feito com **EAS Build**:

```bash
npm install -g eas-cli
eas build --profile preview --platform android   # gera um APK instalável
eas build --platform android                      # AAB para a Play Store
eas build --platform ios                          # IPA para a App Store
```

Publicar de verdade exige conta **Google Play** (US$ 25, uma vez) e/ou **Apple
Developer** (US$ 99/ano).
