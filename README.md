# Miniature Hobby Tracker

A web-based filing system to track the progress of tabletop gaming miniatures. This is a full-stack application with a React frontend and a Node.js/SQLite backend. Catalog your models, update their status, and visualize your collection's progress with an interactive dashboard.

![Miniature Hobby Tracker Screenshot](https://storage.googleapis.com/aistudio-ux-team-public/sdk-pro-assets/minis-tracker.png)

## Features

- **Persistent Database**: All data is stored in a robust SQLite database file.
- **Detailed Tracking**: Log miniatures for various game systems with properties like model name, game system, army, status, and model count.
- **Interactive Dashboard**: Visualize your collection with statistics and charts.
- **Dynamic Filtering & Sorting**: Easily filter your collection by game system or army, and sort the list by any column.
- **Global Search**: Instantly find miniatures by name, game system, or army.
- **Dynamic Theming**: The UI theme dynamically changes to match the aesthetic of the filtered game system or army.

## Tech Stack

- **Frontend**:
    - **React**: A JavaScript library for building user interfaces.
    - **TypeScript**: A strongly typed programming language that builds on JavaScript.
    - **Vite**: A next-generation frontend tooling for development and building.
    - **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
    - **Recharts**: A composable charting library built on React components.
- **Backend**:
    - **Node.js**: A JavaScript runtime environment.
    - **Express**: A minimal and flexible Node.js web application framework.
    - **SQLite**: A C-language library that implements a small, fast, self-contained, high-reliability, full-featured, SQL database engine.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

You will need to have [Node.js](https://nodejs.org/) (version 18.x or later) and a package manager like [npm](https://www.npmjs.com/) installed on your system.

### Installation

1.  **Clone the repository or download the source code:**
    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```
2.  **Install dependencies:**
    This command will install both the frontend and backend dependencies.
    Open your terminal in the project's root directory and run:
    ```bash
    npm install
    ```

### Running the Development Server

Once the dependencies are installed, you can start both the backend server and the frontend development server with a single command:

```bash
npm run dev
```

This will:
1.  Start the backend Node.js server, which will connect to the SQLite database. You will see log output for this in your terminal.
2.  Start the Vite development server for the frontend.

Open your web browser and navigate to the local URL provided by Vite (usually `http://localhost:5173`) to see the application running.

## Building for Deployment

When you are ready to create a production-ready version of your application, you can run the build command:

```bash
npm run build
```

This command will compile the TypeScript/React code and bundle it into a `dist` directory. To deploy this, you would need to run the backend server (`npm run server`) on a hosting provider (like a VPS or PaaS) and configure it to serve the static files from the `dist` folder.