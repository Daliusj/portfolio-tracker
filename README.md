# Investment Portfolio Tracker

## Project Description

The Investment Portfolio Tracker is a comprehensive application designed to help users manage and track their investment portfolios.
It offers features such as portfolio creation, asset management, historical data retrieval, and valuation services.
The application leverages tRPC for seamless communication between the client and server, providing a robust and efficient API interface.

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/Daliusj/portfolio-tracker.git
   cd portfolio-tracker/
   ```

2. Install the dependencies:

   ```sh
   npm install
   ```

3. Set up the environment variables:
   Create a `.env` file in the root directory and add the following:
   ```sh
    DATABASE_URL=postgres://username:password@localhost:5432/prod_database_name
    TEST_DATABASE_URL=postgres://username:password@localhost:5432/test_database_name
    TOKEN_KEY=supersecretkey
    FMP_API_KEY=<your_api_key>
    EXCHANGE_RATE_API_KEY=<your_api_key>
    DB_INIT_SEED='false' #choose 'true' to run database seeding at the project initialization.
    DB_UPDATE='false' #choose 'true' to run database data update at the project initialization.
   ```

## Running the Application

1. cd server/
1. Run database migrations
   ```sh
   npm run migrate:latest
   npm run gen:types
   ```
1. Run the server:

   ```sh
   npm run dev

   ```

1. The server should now be running.

## Usage

### tRPC Routes Interaction

The Investment Portfolio Tracker uses tRPC for defining and interacting with API routes. Below is a guide on how to interact with the available tRPC routes.

#### Accessing the tRPC Panel

1. Start the development server
   ```sh
   npm run dev
   ```
2. Navigate to http://localhost:3000/api/v1/trpc-panel in your web browser.

### Example Interactions

Here are some examples of how to interact with different routes using the tRPC panel:

#### Authentication

Some routes require authentication. After successful user login the response will display the generated access token. The tRPC panel provides fields to input and manage headers for authenticated routes.
In the 'key' field enter 'Autorization' and in the 'Value' field enter 'Bearer <your_access_token>' press confirm and you will be able to interact with routes that require authorization.

### User Routes

#### User Login

- **Route**: `user.login`
- **Description**: Authenticate a user and generate an access token.
- **Input Parameters**:
  - `email`: The user's email address (e.g., "user@example.com").
  - `password`: The user's password (e.g., "password123").
- **Example**:
  - Fill in the `email` and `password` fields with appropriate values.
  - Click "Send".
  - The response will display the generated access token.

#### User Signup

- **Route**: `user.signup`
- **Description**: Register a new user account.
- **Input Parameters**:
  - `email`: The user's email address (e.g., "newuser@example.com").
  - `password`: The user's password (e.g., "password123").
  - `userName`: The user's name (e.g., "newuser").
- **Example**:
  - Fill in the `email`, `password`, and `userName` fields with appropriate values.
  - Click "Send".
  - The response will display the details of the newly created user.

### Portfolio Routes

#### Create Portfolio

- **Route**: `portfolio.create`
- **Description**: Create a new investment portfolio.
- **Input Parameters**:
  - `currencySymbol`: The currency symbol for the portfolio (e.g., "USD").
- **Example**:
  - Fill in the `currencySymbol` field with "USD".
  - Click "Send".
  - The response will display the newly created portfolio details.

#### Get Portfolio by User ID

- **Route**: `portfolio.get`
- **Description**: Retrieve portfolios for the authenticated user.
- **Input Parameters**: None.
- **Example**:
  - Click "Send".
  - The response will display the portfolios associated with the authenticated user.

#### Update Portfolio

- **Route**: `portfolio.update`
- **Description**: Update an existing portfolio.
- **Input Parameters**:
  - `id`: The portfolio ID (e.g., 1).
  - `currencySymbol`: The new currency symbol for the portfolio (e.g., "EUR").
- **Example**:
  - Fill in the `id` field with "1".
  - Fill in the `currencySymbol` field with "EUR".
  - Click "Send".
  - The response will display the updated portfolio details.

#### Remove Portfolio

- **Route**: `portfolio.remove`
- **Description**: Remove a portfolio.
- **Input Parameters**:
  - `id`: The portfolio ID (e.g., 1).
- **Example**:
  - Fill in the `id` field with "1".
  - Click "Send".
  - The response will display the details of the removed portfolio.

### Asset Routes

#### Get Assets by Query

- **Route**: `asset.get`
- **Description**: Retrieve assets based on a search query.
- **Input Parameters**:
  - `query`: A string representing the asset query (e.g., "AAPL").
- **Example**:
  - Fill in the `query` field with "AAPL".
  - Click "Send".
  - The response will display assets matching the query.

#### Get Assets by ID

- **Route**: `asset.getById`
- **Description**: Retrieve assets based on their ID.
- **Input Parameters**:
  - `id`: An array of asset IDs (e.g., [1, 2, 3]).
- **Example**:
  - Fill in the `id` field with [1, 2, 3].
  - Click "Send".
  - The response will display the assets with the specified IDs.

### Portfolio Item Routes

#### Create Portfolio Item

- **Route**: `portfolioItem.create`
- **Description**: Create a new portfolio item.
- **Input Parameters**:
  - `portfolioId`: The portfolio ID (e.g., 1).
  - `assetId`: The asset ID (e.g., 2).
  - `quantity`: The quantity of the asset (e.g., 10).
  - `purchasePrice`: The purchase price of the asset (e.g., 150).
  - `purchaseDate`: The purchase date of the asset (e.g., "2024-07-01").
- **Example**:
  - Fill in the fields with appropriate values.
  - Click "Send".
  - The response will display the newly created portfolio item details.

#### Get Items by Portfolio ID

- **Route**: `portfolioItem.get`
- **Description**: Retrieve items for a specific portfolio.
- **Input Parameters**:
  - `portfolioId`: The portfolio ID (e.g., 1).
- **Example**:
  - Fill in the `portfolioId` field with "1".
  - Click "Send".
  - The response will display the items associated with the specified portfolio.

#### Update Portfolio Item

- **Route**: `portfolioItem.update`
- **Description**: Update an existing portfolio item.
- **Input Parameters**:
  - `id`: The portfolio item ID (e.g., 1).
  - `quantity`: The new quantity of the asset (e.g., 20).
  - `purchasePrice`: The new purchase price of the asset (e.g., 140).
- **Example**:
  - Fill in the fields with appropriate values.
  - Click "Send".
  - The response will display the updated portfolio item details.

#### Remove Portfolio Item

- **Route**: `portfolioItem.remove`
- **Description**: Remove a portfolio item.
- **Input Parameters**:
  - `id`: The portfolio item ID (e.g., 1).
- **Example**:
  - Fill in the `id` field with "1".
  - Click "Send".
  - The response will display the details of the removed portfolio item.

### Historical Data Routes

#### Get Historical Data

- **Route**: `historicalData.get`
- **Description**: Retrieve historical data for a given asset.
- **Input Parameters**:
  - `symbol`: The asset symbol (e.g., "AAPL").
  - `dateFrom`: The start date for the data range (e.g., "2023-01-01").
  - `dateTo`: The end date for the data range (e.g., "2023-12-31").
- **Example**:
  - Fill in the `symbol`, `dateFrom`, and `dateTo` fields with appropriate values.
  - Click "Send".
  - The response will display the historical data for the specified asset and date range.

### Portfolio Value Routes

#### Get Total Portfolio Value

- **Route**: `portfolioValue.getTotalValue`
- **Description**: Retrieve the total value of a portfolio.
- **Input Parameters**:
  - `portfolioId`: The portfolio ID (e.g., 1).
- **Example**:
  - Fill in the `portfolioId` field with "1".
  - Click "Send".
  - The response will display the total value of the specified portfolio.

#### Get Portfolio Value by Asset Type

- **Route**: `portfolioValue.getAssetsTypeValue`
- **Description**: Retrieve the value of assets in a portfolio by type.
- **Input Parameters**:
  - `portfolioId`: The portfolio ID (e.g., 1).
  - `type`: The asset type (e.g., "stock").
- **Example**:
  - Fill in the `portfolioId` and `type` fields with appropriate values.
  - Click "Send".
  - The response will display the value of the specified asset type in the portfolio.

#### Get Asset Value in Portfolio

- **Route**: `portfolioValue.getAssetValue`
- **Description**: Retrieve the value of a specific asset in a portfolio.
- **Input Parameters**:
  - `portfolioId`: The portfolio ID (e.g., 1).
  - `assetId`: The asset ID (e.g., 2).
- **Example**:
  - Fill in the `portfolioId` and `assetId` fields with appropriate values.
  - Click "Send".
  - The response will display the value of the specified asset in the portfolio.
