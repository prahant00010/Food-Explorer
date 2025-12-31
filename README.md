## Food Product Explorer
## Project Description

    Food Product Explorer is a responsive web application built using React.js that integrates the OpenFoodFacts public API. The application allows users to search, filter, sort, and explore detailed                information about food products, including ingredients, nutritional values, and labels. The project follows a clean, component-based architecture and focuses on usability, performance, and real-world API        handling.

    This repository documents the methodology used to solve the given problem, along with the complete implementation.

## Objective

  The goal of this project is to build a user-friendly web application that:

    -->Fetches real-world food product data using OpenFoodFacts API

    -->Enables searching products by name and barcode

    -->Supports filtering by food categories

    -->Allows sorting by product name and nutrition grade

    -->Displays detailed nutritional and ingredient information

    -->Works seamlessly across mobile and desktop devices

## Technologies Used

    -->Frontend: React.js

    -->Styling: TailwindCSS 

    -->API Integration: OpenFoodFacts Public REST API

    -->State Management:  Context API 



## Features Implemented
  ## Homepage

    -->Displays a list of food products fetched from the OpenFoodFacts API

     Each product shows:
      1.Product name
      2.Product image
      3.Category
      4.Ingredients (if available)
      5.Nutrition Grade (A–E)

    -->Pagination implemented using infinite scroll or load-more functionality
    
## Product Detail Page

    -->Displays:
      1.Product image
      2.Full ingredients list
      3.Nutritional values (energy, fat, carbs, proteins)
      4.Product labels (vegan, gluten-free, etc.)

## Responsive Design

    1.Fully responsive UI
    2.Optimized for mobile, tablet, and desktop screens

## Project Structure
    src/
    ├── components/
    ├── pages/
    ├── services/
    ├── context/ (optional)
    ├── styles/
    ├── App.jsx
    └── index.js

## How to Run the Project
    1.git clone https://github.com/prahant00010/Food-Explorer.git
    2.cd Food-Explorer
    3.npm install
    4.npm start


