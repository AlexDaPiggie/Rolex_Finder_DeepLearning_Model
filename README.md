# [Rolex Finder(Click to see the website)](https://rolex-finder.vercel.app)
## Acknowledgement
Special thanks to my friend [Huy Phan, a.k.a. Hertzy](https://hertzy-da-poet.github.io/Hugo-Portfolio), for bringing the design of this project to life. Hertzy implemented the entire front end and crafted the visual effects that shape the user experience.

## Authors
| **Phong Nguyen (Alex)** | **Huy Phan (Hertzy)** |
|---|---|
| **Machine Learning / Backend** | **Frontend / UI-UX Design** |
| Built the Rolex classification model, web-scraping pipeline, recognition pipeline, backend API, model integration, and Modal deployment setup. | Brought the project design to life by implementing the frontend, UI layout, interactions, styling, visual effects, and Vercel deployment. |
| GitHub: [@AlexDaPiggie](https://github.com/AlexDaPiggie)<br>LinkedIn: [Hoai Phong Nguyen](https://www.linkedin.com/in/hoai-phong-nguyen-9367a4384/?isSelfProfile=true) | GitHub: [@hertzy-da-poet](https://github.com/hertzy-da-poet)<br>LinkedIn: [Huy Phan](https://linkedin.com/in/huy-linkedin) |


We are writing the doc for backend and frontend logic
## Frontend
### Key Features

-   **Intuitive Image Upload:** Supports pasting from the clipboard (Ctrl+V), browsing local files, and drag-and-drop functionality.
-   **AI-Powered Model Prediction:** Displays the most likely Rolex model along with a confidence percentage.
-   **Variant Candidate Analysis:** Shows a list of the closest known model variants, each with a match score and reference IDs.
-   **Quick Reference Search:** Provides one-click links to Google Images for each reference ID to aid in visual comparison and confirmation.
-   **Detailed Probability Breakdown:** Presents a table with the model's confidence scores across various Rolex families (e.g., Cellini, Daytona, Submariner).
-   **Responsive Design:** Features a clean, two-panel layout that adapts seamlessly to both desktop and mobile devices.
-   **Built-in Tutorial:** An interactive guide on the homepage helps first-time users get started quickly.

### Tech Stack

-   **Frontend:** React, Vite
-   **Libraries:** `react-dropzone` for file handling.
-   **Styling:** Custom CSS with a modern, responsive design.
-   **API:** The frontend communicates with a computer vision API hosted on [Modal](https://modal.run/) to perform the model recognition.

### How It Works

1.  The user visits the web application, which presents an image upload interface and a tutorial panel.
2.  An image of a Rolex watch is provided by pasting it, browsing local files, or dragging it into the drop zone.
3.  Upon clicking the "FIND" button, the application sends the image to the backend prediction API.
4.  The API processes the image and returns a JSON response with the prediction results.
5.  The right-hand panel updates to display the primary prediction, confidence score, variant candidates, and a detailed probability table.

## Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/hertzy-da-poet/rolex_models_recognition.git
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd rolex_models_recognition
    ```

3.  **Install the dependencies:**
    ```bash
    npm install
    ```

4.  **Start the development server:**
    ```bash
    npm run dev
    ```

5.  Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite). The development server is configured to proxy API requests to the live backend, so no additional setup is required.

### Project Structure

The project is organized to separate concerns, promoting maintainability and scalability.

-   `src/components/`: Contains reusable React components, categorized by feature (`Prediction`, `Upload`, `Tutorial`, `UI`).
-   `src/pages/`: Holds the main page components for the application, such as `Home.jsx`.
-   `src/data/`: Includes mock data used for development and testing.
-   `public/`: Stores static assets, including the tutorial GIFs.
-   `vite.config.js`: Vite configuration, including the proxy setup for API requests.

## Backend
