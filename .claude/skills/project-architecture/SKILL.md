---
name: project-architecture
description: Arquitetura e convenções obrigatórias deste app Expo / React Native (camadas app→features→ui/lib, design system, lib/api, expo-router, NativeWind). Use SEMPRE que for criar, mover ou refatorar arquivos/pastas, scaffolding de feature, componente, chamada de API, ou decidir onde algo vive. Consulte ANTES de escrever código.
---

# Arquitetura & Convenções do projeto (Expo / React Native)

Regras para qualquer dev (humano ou agente) que tocar neste projeto.
**Não inventar estrutura nova. Não "melhorar" a organização por conta própria.**
Seguir exatamente o que está descrito aqui. Na dúvida, perguntar antes de criar pasta.

Fonte de verdade completa: `ARQUITETURA.md` na raiz. Esta Skill é o resumo operacional — em conflito, vale `ARQUITETURA.md`.

> Stack: **Expo SDK 56**, RN 0.85, React 19.2, **expo-router**, **NativeWind v4**,
> **Reanimated 4 + Moti**, **react-native-svg / expo-linear-gradient / expo-blur**.

## 1. Princípio único (manda em todas as outras)

A dependência flui em UMA direção só:

```
app/  →  features/  →  ui/ + lib/
```

Camada de baixo NUNCA importa de camada de cima.

- `ui/` não importa de `features/` nem de `lib/api/`.
- `lib/` não importa de `features/` nem de `app/`.
- `features/` pode usar `ui/` e `lib/`.
- `app/` orquestra: telas finas que montam `features/`.
- Uma `feature` NÃO importa de outra feature direto — o contrato compartilhado sobe pra `lib/`.

Se um arquivo precisa quebrar essa direção, ele está no lugar errado. **Mover, não contornar.**

> **Estrutura deste projeto:** tudo sob `src/`. Alias `@/*` → `./src/*`. As rotas
> ficam em `src/app/` (expo-router).

## 2. Onde cada coisa vive

| O que é                                   | Onde vai                              |
|-------------------------------------------|---------------------------------------|
| Rota / tela                               | `src/app/.../<rota>.tsx`             |
| Layout de navegação (Stack/Tabs)          | `src/app/.../_layout.tsx`           |
| Chamada à API (fetch/mutation)            | `src/lib/api/<recurso>.ts`           |
| Cliente base da API                       | `src/lib/api/client.ts`              |
| Tokens de movimento (springs/easings)     | `src/ui/tokens/`                     |
| Cor/raio (tokens)                         | `tailwind.config.js` + `src/constants/palette.ts` |
| Primitivo burro reutilizável (Button...)  | `src/ui/primitives/`                 |
| Composição genérica (MetricTile, Dock)    | `src/ui/patterns/`                   |
| Componente que conhece o domínio          | `src/features/<feature>/components/` |
| Hook de domínio                           | `src/features/<feature>/hooks/`      |
| Tipo de domínio                           | `src/features/<feature>/types.ts`    |
| Util genérico (sem domínio)               | `src/lib/utils/`                     |
| Config / env (`EXPO_PUBLIC_*`)            | `src/lib/config.ts`                  |
| Chrome de tela compartilhado              | `src/components/`                    |

## 3. Regras invioláveis (NUNCA)

1. **Lógica de API nunca dentro de componente.** Nenhum `fetch` dentro de `.tsx`. Todo acesso à API vive em `lib/api/`; o componente chama uma função de lá.
2. **Componente em `ui/` nunca conhece domínio.** Se menciona uma entidade do negócio (clima, cidade, alerta...), pertence a `features/`, não a `ui/`.
3. **Nenhuma chave/segredo no bundle.** Só `EXPO_PUBLIC_*` é público; segredo de verdade fica no backend.
4. **Texto sempre dentro de `<Text>`.** String solta em `<View>` quebra no RN.
5. **`components/` só p/ chrome sem domínio.** O resto é design system (`ui/`) ou feature (`features/<x>/components/`).
6. **Cor/espaço hardcoded é proibido no layout.** Use `className` (NativeWind). Valores imperativos (ícone lucide, SVG, gradiente) usam `@/constants/palette`.

## 4. Estilo & efeitos (jeito React Native)

- Layout/cor: `className` (NativeWind). Tokens em `tailwind.config.js`.
- Glass: `<GlassCard>` (expo-blur). Não existe `backdrop-filter`.
- Gradiente: `expo-linear-gradient`; radial/vinheta/halo: `react-native-svg`.
- Animação: `Moti` (declarativo) + `Reanimated 4` (loops/partículas). Não usar libs de animação feitas para web.
- Ícones: `lucide-react-native`; ícone de clima é SVG próprio (`WeatherIcon`).

## 5. Design system (`ui/`)

- Três níveis: `tokens/` (movimento) → `primitives/` → `patterns/`.
- Primitivo: sem regra de negócio, sem fetch, sem estado global. Aceita `className`/props nativas.
- Acessibilidade não é opcional: `accessibilityRole`/`Label`/`State` em tudo interativo.
- Só entra em `ui/` o que serve a QUALQUER app sem alteração. Carregou nome de entidade → `features/`.
- Barrel único em `src/ui/index.ts`.

## 6. Features (`features/`)

- Uma pasta por área de domínio (hoje: `weather/`).
  ```
  features/<x>/
  ├── components/   # UI que conhece o domínio
  ├── hooks/        # ex: useWeather
  └── types.ts      # tipos do domínio
  ```
- Feature compõe primitivos de `ui/` — não recria botão/card/etc.

## 7. Dados / API (`lib/api/`)

- Um arquivo por recurso (`weather.ts`). Contrato de tipos vive aqui e é reexportado por `features/<x>/types.ts`.
- Cada função retorna dado tipado ou lança erro. Sem UI.
- **Hoje é mock**; assinatura `async` pronta pra virar `apiFetch`. Dado dinâmico no futuro: TanStack Query, nunca `fetch` solto em `useEffect`.

## 8. Rotas (`app/`) — expo-router

- Roteamento por arquivo. `_layout.tsx` = navegador; `(grupo)/` agrupa sem virar segmento.
- Tabs principais: grupo `(tabs)` com tabBar custom (`FloatingDock`). `Tabs` vem de `expo-router/js-tabs`.
- Rota de fallback: `src/app/+not-found.tsx`.
- Tela é fina: busca via `lib/api` e monta a feature. É tudo client (React Native).

## 9. Nomenclatura

- Componentes: `PascalCase` — `CurrentWeather.tsx`.
- Hooks: `camelCase` com `use` — `useWeather.ts`.
- Funções de API: verbo + recurso — `getWeather`.
- Tipos de domínio: `PascalCase` no `types.ts` — `WeatherData`.
- Barrel (`index.ts`) só em `ui/`.

## 10. Checklist antes de criar um arquivo novo

1. Design system (sem domínio) ou feature (com domínio)?
2. Acesso a dado → `lib/api/`, não no componente.
3. Importando "pra cima"? Parei e repensei.
4. Cor/espaço hardcoded? Usei token/`palette`.
5. Texto em `<Text>`? Efeito usando a lib certa (blur/gradiente/animação)?

## ⚠️ Antes de escrever código Expo

Este projeto usa **Expo SDK 56** com breaking changes vs. o conhecimento padrão.
Ler a doc versionada em https://docs.expo.dev/versions/v56.0.0/ antes de mexer em
rota/navegação/config. Respeitar deprecações (ex.: `Tabs` em `expo-router/js-tabs`).
