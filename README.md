# ABI Function Selector

## Description

The ABI Function Selector is a web-based tool that helps developers working with Ethereum smart contracts to easily extract function names and their corresponding function selectors from a contract's ABI (Application Binary Interface).

Live demo: [ABI Function Selector](https://function-extractor-page.vercel.app)

## Features

- Parse and analyze Ethereum contract ABIs
- Extract function names from the ABI
- Generate function selectors for each function
- Display results in an easy-to-read format

## How It Works

1. The user pastes the ABI of an Ethereum smart contract into the provided text area.
2. Upon submission, the application parses the ABI and extracts all function definitions.
3. For each function, it generates the function selector by:
   - Creating a function signature string
   - Converting the signature to UTF-8 bytes
   - Calculating the Keccak-256 hash of the bytes
   - Taking the first 4 bytes (8 characters) of the hash as the selector
4. The results are displayed, showing each function name paired with its selector.

## Usage

1. Visit the [ABI Function Selector](https://function-extractor-page.vercel.app) website.
2. Paste your Ethereum contract ABI into the text area.
3. Click the "Get Selectors" button.
4. View the results, which will show each function name and its corresponding selector.

## Technical Details

- Built with React.js
- Uses the ethers.js library for Ethereum-related calculations
- Hosted on Vercel

## Development

To run this project locally:

1. Clone the repository
2. Install dependencies with `npm install`
3. Run the development server with `npm run dev`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)

## Contact

If you have any questions or feedback, please open an issue in the GitHub repository.


