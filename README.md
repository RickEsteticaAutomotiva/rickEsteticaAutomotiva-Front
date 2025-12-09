# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


## Acessar o Projeto do Celular na Mesma Rede

**1. Inicie o servidor com acesso à rede:**
```bash
npm run dev -- --host 0.0.0.0 --port 3000
```

**2. Encontre o IP da sua máquina:**
```bash
ipconfig
```
Procure pelo **IPv4 Address** (exemplo: `192.168.1.100`)

**3. No celular, acesse:**
```
http://SEU_IP:3000
```

**Exemplo:**
```
http://192.168.1.100:3000
```

> ⚠️ **Certifique-se que o celular e o PC estão conectados à mesma rede WiFi**