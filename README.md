# Vitrio UI

A clean, simple React + TypeScript UI component library with CLI support.

## Install

```bash
npm install vitrio-ui
```

Peer deps:

```bash
npm install react react-dom
```

## Usage

```tsx
import { Button } from 'vitrio-ui';

export default function App() {
  return <Button onClick={() => alert('Clicked!')}>Click me</Button>;
}
```

## CLI

Generate a new component scaffold:

```bash
npx vitrio-cli generate MyComponent
```

This creates `src/components/MyComponent/MyComponent.tsx` and `src/components/MyComponent/MyComponent.module.css`.

## Development

- Build: `npm run build`
- Test: `npm run test`
- Dev (Vite): `npm run dev`

## License

MIT 