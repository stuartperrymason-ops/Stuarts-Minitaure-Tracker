# Miniature Hobby Tracker

A web-based filing system to track the progress of tabletop gaming miniatures. This is a client-side React application that stores all your data in your browser's local storage. Catalog your models, update their status, and visualize your collection's progress with an interactive dashboard.

![Miniature Hobby Tracker Screenshot](https://storage.googleapis.com/aistudio-ux-team-public/sdk-pro-assets/minis-tracker.png)

## Features

- **Local Storage Persistence**: Your entire collection is saved directly in your browser.
- **Undo/Redo History**: Made a mistake? Easily undo and redo your actions.
- **Import/Export Data**: Create backups of your collection by exporting to a JSON file, and import them on any computer.
- **Detailed Tracking**: Log miniatures for various game systems with properties like model name, game system, army, status, and model count.
- **Interactive Dashboard**: Visualize your collection with statistics, a status breakdown pie chart, and a progress heatmap.
- **Dynamic Filtering & Sorting**: Easily filter your collection by game system or army, and sort the list by any column.
- **Dynamic Theming**: The UI theme dynamically changes to match the aesthetic of the filtered game system or army.

## Tech Stack

- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A strongly typed programming language that builds on JavaScript.
- **Vite**: A next-generation frontend tooling for development and building.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **Recharts**: A composable charting library built on React components.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

You will need to have [Node.js](https://nodejs.org/) (version 18.x or later) and a package manager like [npm](https://www.npmjs.com/) installed.

### Installation & Setup

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

### Running the Development Server

Once the dependencies are installed, you can start the Vite development server:

```bash
npm run dev
```

Open your web browser and navigate to the local URL provided by Vite (usually `http://localhost:5173`) to see the application running.

## Building for Production

When you are ready to create a production-ready version of your application, you can run the build command:

```bash
npm run build
```

This command will compile the TypeScript/React code and bundle it into a `dist` directory. You can deploy this `dist` folder to any static site hosting service.