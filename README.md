# MTG-Next

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Follow these steps to set up and run the project from scratch:

### Prerequisites

Make sure you have the following installed on your system:
- **Node.js** (version 18 or later) - [Download here](https://nodejs.org/)
- **pnpm** (recommended package manager) - Install with `npm install -g pnpm`

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd MTG-Next
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure environment variables:**
   
   Copy the example environment file and configure it:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and set the API URL:
   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```
   
   **Important:** The API URL should point to your MTG API server. The default value assumes the API server is running on `localhost:4000`.

### Running the Development Server

Start the development server with:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

### Building for Production

To create an optimized production build:

```bash
pnpm build
```

### Running in Production Mode

After building, you can start the production server:

```bash
pnpm start
```

### Other Available Scripts

- **Lint the code:** `pnpm lint`
- **Development with Turbopack:** Already enabled by default in `pnpm dev`

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

Time Spent: Approximately 2-3 hours on implementation and documentation

**Author**: Paul Turpin