# Expense Tracker

A modern, full-featured expense tracking application built with Next.js, Firebase, and TypeScript. Track your expenses, set saving goals, and analyze your spending patterns with beautiful visualizations.

## Features

- 🔐 **Authentication**: Secure user authentication using Firebase
- 💰 **Expense Tracking**: Add, edit, and delete expenses with categories
- 🎯 **Saving Goals**: Set and track your financial goals
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🤖 **AI Integration**: Smart expense categorization using OpenAI

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **UI Components**: Heroicons
- **Animations**: Framer Motion
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account and project setup

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/expense-tracker.git
cd expense-tracker
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
OPENAI_API_KEY=your_openai_api_key
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Available Scripts

- `npm run dev` - Start the development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code linting

## Project Structure

```
expense-tracker/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── lib/             # Utility functions and contexts
│   └── types/           # TypeScript type definitions
├── public/              # Static assets
└── ...config files
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
