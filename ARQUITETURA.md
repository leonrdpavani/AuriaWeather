# Arquitetura & Convenções — App Mobile (Expo / React Native)

Regras para qualquer dev (humano ou agente) que tocar neste projeto.
Não inventar estrutura nova. Não "melhorar" a organização por conta própria.
Seguir exatamente o que está descrito aqui. Na dúvida, perguntar antes de criar pasta.

> Stack: **Expo SDK 56**, React Native 0.85, React 19.2, **expo-router** (rotas
> por arquivo), **NativeWind v4** (Tailwind no RN), **Reanimated 4 + Moti**
> (animação), **react-native-svg / expo-linear-gradient / expo-blur** (efeitos).
> Tudo vive sob `src/` com o alias `@/*` → `./src/*`.

---

## 1. Princípio único (a regra que manda em todas as outras)

A dependência flui em UMA direção só:

```
app/  →  features/  →  ui/ + lib/
```

Camada de baixo NUNCA importa de camada de cima.

- `ui/` não importa de `features/` nem de `lib/api/`.
- `lib/` não importa de `features/` nem de `app/`.
- `features/` pode usar `ui/` e `lib/`.
- `app/` orquestra: telas finas que montam `features/`.

Se um arquivo precisa quebrar essa direção, ele está no lugar errado. Mover, não contornar.

---

## 2. Onde cada coisa vive

| O que é                                     | Onde vai                              |
|---------------------------------------------|---------------------------------------|
| Rota / tela                                 | `src/app/.../<rota>.tsx`              |
| Layout de rota (Stack/Tabs)                 | `src/app/.../_layout.tsx`            |
| Grupo de navegação                          | `src/app/(grupo)/`                    |
| Chamada à API (fetch/mutation)              | `src/lib/api/<recurso>.ts`            |
| Cliente HTTP base                           | `src/lib/api/client.ts`               |
| Config / env (`EXPO_PUBLIC_*`)              | `src/lib/config.ts`                   |
| Util genérico (sem domínio)                 | `src/lib/utils/`                      |
| Paleta crua p/ ícones/SVG/gradiente         | `src/constants/palette.ts`            |
| Tokens de movimento (springs/easings)       | `src/ui/tokens/`                      |
| Primitivo burro reutilizável (Button...)    | `src/ui/primitives/`                  |
| Composição genérica (MetricTile, Dock...)   | `src/ui/patterns/`                    |
| Componente que conhece o domínio            | `src/features/<feature>/components/`  |
| Hook de domínio                             | `src/features/<feature>/hooks/`       |
| Tipo de domínio                             | `src/features/<feature>/types.ts`     |
| Chrome de tela compartilhado (ex: fundo)    | `src/components/`                     |

---

## 3. Regras invioláveis (NUNCA)

1. **Lógica de API nunca dentro de componente.** Nenhum `fetch` dentro de `.tsx`
   de componente. Todo acesso à API vive em `src/lib/api/`. O componente chama
   uma função de lá (hoje em modo mock; a assinatura já está pronta pro backend).

2. **Componente em `ui/` nunca conhece domínio.** `ui/` não sabe o que é "clima",
   "cidade", "alerta". Se um componente menciona uma entidade do negócio, ele
   pertence a `features/`, não a `ui/`.

3. **Nenhuma chave/segredo no bundle.** Só exponha via `EXPO_PUBLIC_*` o que for
   realmente público. Segredo de verdade fica no backend.

4. **Texto sempre dentro de `<Text>`.** No React Native, string solta quebra.
   Nada de texto direto em `<View>`.

5. **Sem `components/` de domínio solto.** Componente ou é design system (`ui/`),
   ou é de feature (`features/<x>/components/`), ou é chrome de tela
   (`src/components/`, sem domínio). Não existe quarto lugar.

6. **Cor/espaçamento hardcoded é proibido no layout.** Use classes do NativeWind
   (tokens em `tailwind.config.js`). Para valores imperativos que o `className`
   não alcança — cor de ícone lucide, `stop` de SVG, `colors` de gradiente —
   use `@/constants/palette.ts` (espelho dos mesmos tokens). Nada de `#fff`
   espalhado pelo JSX.

---

## 4. Estilo & efeitos (o jeito React Native)

- **Layout e cor:** `className` via NativeWind. Tokens de cor/raio em
  `tailwind.config.js`. Não há CSS global de componente.
- **Vidro (glass):** não existe `backdrop-filter`. Use o `<GlassCard>`
  (`expo-blur` por baixo). Não recrie blur na mão.
- **Gradiente:** `expo-linear-gradient`. Gradiente radial / vinheta / halo:
  `react-native-svg` (`RadialGradient`).
- **Animação:** `Moti` para entradas/transições declarativas; `Reanimated 4`
  (worklets) para loops contínuos e partículas. Easings/springs em
  `@/ui/tokens/motion`. Não usar bibliotecas de animação feitas para web.
- **Ícones:** `lucide-react-native` para UI; ícones de clima são SVG próprio em
  `features/weather/components/WeatherIcon.tsx`.

---

## 5. Design system (`ui/`)

- Três níveis, nessa ordem de composição:
  - `tokens/` → springs/easings/durations (movimento). Cor/raio ficam no
    `tailwind.config.js` + `constants/palette.ts`.
  - `primitives/` → tijolos burros (Button, IconButton, GlassCard,
    SegmentedControl, AnimatedNumber, Skeleton).
  - `patterns/` → composições genéricas (MetricTile, SectionHeader, ScrollRow,
    FloatingDock, EmptyState).
- Primitivo não tem regra de negócio, não faz fetch, não tem estado global.
- Acessibilidade não é opcional: `accessibilityRole`/`accessibilityLabel`/
  `accessibilityState` em tudo que é interativo.
- Um componente só entra em `ui/` se puder ser usado em QUALQUER app sem
  alteração. Se carrega o nome de uma entidade do negócio, vai pra `features/`.
- Barrel único em `src/ui/index.ts`. Features importam de `@/ui`.

---

## 6. Features (`features/`)

- Uma pasta por área de domínio (hoje: `weather/`).
- Estrutura interna padrão:
  ```
  features/<x>/
  ├── components/   # UI que conhece o domínio (ex: CurrentWeather, DaySelector)
  ├── hooks/        # ex: useWeather
  └── types.ts      # tipos do domínio (reexporta o contrato de lib/api)
  ```
- Uma feature usa `ui/` e `lib/`. Não importa de outra feature diretamente — se
  precisa, o contrato compartilhado sobe pra `lib/`.
- Componente de feature compõe primitivos de `ui/`. Não recria botão, card, etc.

---

## 7. Dados / API (`lib/api/`)

- Um arquivo por recurso (`weather.ts`). O CONTRATO de tipos vive na camada mais
  baixa (`lib/api/weather.ts`) e é reexportado por `features/weather/types.ts`.
- Toda função retorna dado tipado ou lança erro. Sem UI aqui.
- Cliente base único (`client.ts`): baseURL, headers e (futuro) auth. `fetch` é
  global no RN.
- **Hoje é mock** (`getWeather` devolve dados locais). A assinatura é `async`
  justamente para virar `apiFetch` sem mudar os callers. Quando houver backend +
  auth, os hooks passam a usar TanStack Query — a interface pública não muda.

---

## 8. Rotas (`app/`) — expo-router

- Roteamento por arquivo. Cada arquivo em `src/app/` é uma rota; `_layout.tsx`
  define o navegador (Stack/Tabs); `(grupo)/` agrupa sem virar segmento de URL.
- A navegação principal é o grupo `(tabs)` com um **tabBar custom**
  (`FloatingDock` de `ui/`). `Tabs` vem de `expo-router/js-tabs` (o de
  `expo-router` está deprecado).
- Tela é fina: busca dados via `lib/api` e monta a `feature`. Sem lógica de UI
  ou de API na rota. Não há Server/Client Components — é tudo client (RN).

---

## 9. Nomenclatura

- Componentes: `PascalCase` (arquivo e export). `CurrentWeather.tsx`.
- Hooks: `camelCase` começando com `use`. `useWeather.ts`.
- Funções de API: verbo + recurso. `getWeather`, `listCities`.
- Tipos de domínio: `PascalCase`, no `types.ts` da feature. `WeatherData`.
- Rotas: minúsculas, casam com o nome do arquivo (`index`, `cities`, `radar`).
- Barrel (`index.ts`) só em `ui/`. Não criar barrel em feature.

---

## 10. Checklist antes de criar um arquivo novo

1. Isso é design system (reutilizável, sem domínio) ou feature (tem domínio)?
2. Se faz acesso a dado → vai pra `lib/api/`, não pro componente.
3. Estou importando "pra cima" na direção das camadas? Se sim, parei e repensei.
4. Estou hardcodando cor/espaço? Se sim, usei token/`palette`.
5. Texto está dentro de `<Text>`? Efeito (blur/gradiente/animação) usa a lib certa?
