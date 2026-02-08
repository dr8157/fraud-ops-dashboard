# Fraud Operations Dashboard 🛡️

> **Hackathon Project**: A real-time, dark-themed operations dashboard for monitoring fraud risks and transactions.

![Dashboard Preview](https://placehold.co/1200x600/0a0a0a/ffffff?text=Fraud+Dashboard+Preview)

## 🚀 Features

- **Real-time Monitoring**: Connects to a live risk engine webhook and auto-refreshes data every 15 seconds.
- **Institutional UI**: Professional dark mode aesthetic with glassmorphism effects.
- **Advanced Filtering**: Search by Order ID, User ID, or filter by Risk Level (Pass/Review/Block).
- **Deep Dive**: Detailed inspection drawer showing risk signals, device fingerprints, and shopping cart analysis.
- **Responsive**: Fully optimized for desktop and tablet operations.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Language**: TypeScript
- **State**: React Hooks (Custom polling logic)
- **Icons**: Lucide React

## 💻 How to Run Locally

Follow these steps to get the dashboard running on your system:

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` (comes with Node.js)

### Installation

1.  **Clone the repository** (or unzip the project folder):
    ```bash
    git clone <your-repo-url>
    cd fraud-dashboard
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Start the development server**:
    ```bash
    npm run dev
    ```

4.  **Open the application**:
    Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Building for Production

To create an optimized production build:

```bash
npm run build
npm start
```

## 📂 Project Structure

- `app/`: Next.js App Router pages and layouts.
- `app/components/dashboard/`: Core business logic components (KPIs, Tables).
- `app/components/ui/`: Reusable design system components.
- `lib/`: API clients and utility functions.
- `types/`: Type definitions for the fraud data model.

---

*Built with ❤️ for the Hackathon.*
