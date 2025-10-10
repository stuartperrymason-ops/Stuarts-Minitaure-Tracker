# Miniature Hobby Tracker

A web-based filing system to track the progress of tabletop gaming miniatures. Catalog your models, update their status from "purchased" to "game-ready," and visualize your collection's progress with an interactive dashboard.

![Miniature Hobby Tracker Screenshot](https://storage.googleapis.com/aistudio-ux-team-public/sdk-pro-assets/minis-tracker.png)

## Features

- **Detailed Tracking**: Log miniatures for various game systems with properties like model name, game system, army, status, and model count.
- **Interactive Dashboard**: Visualize your collection with statistics, a progress heatmap, and a status overview chart.
- **Dynamic Filtering & Sorting**: Easily filter your collection by game system or army, and sort the list by any column.
- **Global Search**: Instantly find miniatures by name, game system, or army.
- **Dynamic Theming**: The UI theme dynamically changes to match the aesthetic of the filtered game system or army.
- **Data Persistence**: Save your entire collection and history to a local JSON file for backup or transfer, with auto-saving to browser storage for convenience.
- **Undo/Redo**: Never lose a change with persistent undo and redo functionality.
- **Bulk Import/Export**: Easily manage your data by saving and loading your entire collection from a JSON file.

## Tech Stack

- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A strongly typed programming language that builds on JavaScript.
- **Vite**: A next-generation frontend tooling that provides an extremely fast development environment and build process.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **Recharts**: A composable charting library built on React components.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You will need to have [Node.js](https://nodejs.org/) (version 18.x or later) and a package manager like [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) installed on your system.

### Installation

1.  **Clone the repository or download the source code:**
    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```
2.  **Install dependencies:**
    Open your terminal in the project's root directory and run:
    ```bash
    npm install
    ```
    or if you use yarn:
    ```bash
    yarn install
    ```

### Running the Development Server

Once the dependencies are installed, you can start the local development server:

```bash
npm run dev
```
or
```bash
yarn dev
```

This will start the Vite development server. Open your web browser and navigate to the local URL provided in the terminal (usually `http://localhost:5173`) to see the application running. The app will automatically reload if you make any changes to the source files.

## Building for Deployment

When you are ready to create a production-ready version of your application, you can run the build command:

```bash
npm run build
```
or
```bash
yarn build
```

This command will compile the TypeScript/React code and bundle it into a `dist` directory in the project root. This folder contains optimized, static files (HTML, CSS, and JavaScript) that are ready to be deployed.

### Deployment

You can deploy the contents of the `dist` folder to any static hosting service. Some popular and easy-to-use options with generous free tiers are:

-   [Vercel](https://vercel.com/)
-   [Netlify](https://www.netlify.com/)
-   [GitHub Pages](https://pages.github.com/)

Simply drag and drop the `dist` folder onto the provider's dashboard, and they will give you a public URL to share with your friends.
