# WebSocket Feed - React Application

A simple React application that connects to a WebSocket feed and displays live data.

## Features

- Real-time WebSocket connection to `wss://feed.iel.net.pk`
- Subscribe to multiple symbols (e.g., AAPL, MSFT)
- Live data display with timestamps
- Connection status indicator
- Responsive design

## Development

Install dependencies:
```bash
npm install
```

Run development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

## Deployment on Vercel

1. Push this repository to GitHub
2. Go to [Vercel](https://vercel.com) and sign in
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will automatically detect Vite and configure the build settings
6. Click "Deploy"

Alternatively, use Vercel CLI:
```bash
npm install -g vercel
vercel
```

## Usage

1. Enter a symbol (or multiple symbols separated by commas) in the input field
2. Click "Subscribe" or press Enter
3. The application will send a subscription message and display incoming data
4. Data will be displayed in real-time as it arrives from the WebSocket
