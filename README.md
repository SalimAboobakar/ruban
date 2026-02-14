# Sohar Digital Twin Platform

## Project Structure

The project is located in the `sohar-digital-twin/` subdirectory.

## Netlify Deployment

This project is configured for Netlify deployment with the following settings:
- **Base directory**: `sohar-digital-twin`
- **Build command**: `npm run build`
- **Publish directory**: `sohar-digital-twin/dist`

The `netlify.toml` file in the root directory configures these settings automatically.

## Local Development

To run the project locally:

```bash
cd sohar-digital-twin
npm install
npm run dev
```

## Build

To build for production:

```bash
cd sohar-digital-twin
npm run build
```

The built files will be in `sohar-digital-twin/dist/`.
