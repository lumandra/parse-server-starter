# Mural VR Manager Backend

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Description

The Mural VR Manager Backend is a parse-server, node, express, MongoDB web application designed to integrate with the Mural REST API and the Mural VR application for Unity. It serves as the backend for managing VR experiences and data related to the Mural VR application.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Installation

Should you want to run your Parse Server instance locally, you can...

Clone this repository locally.

```bash
git clone <repo url>
cd <project name>
```

You should install MongoDB (if you haven't it yet):

```bash
brew install mongodb
```

Before running server, you should start MongoDB daemon:

```bash
mongod --dbpath <path to data directory>
```

### Install Dependencies

```bash
npm install
```

Next, run the server:

```bash
npm start
```

## Usage

- Parse Server will be running on http://localhost:1337/parse
- If you have enabled the Parse Dashboard, this will be running at http://localhost:1337/dashboard

## Configuration

You can setup configuration in config.json file. Also some parameters can be passed by process.env. In config.json file, in parseConfig object you can pass any parameters of original Parse Server, so checkout its docs. Main parameters with process.env aliases:

| Parameter | config.json  | process.env  |
| :---:   | :-: | :-: |
| Parse server port | port | PORT |
| Parse server URL | URLserver | SERVER_URL |
| Database URI | URLdb | DATABASE_URI, MONGODB_URI |
| Parse application ID | appId | APP_ID |
| Parse master key | masterKey | MASTER_KEY |

In `emailAdapter` there are settings for email adapter. To using email features (users' verification) you should replace `fromAddress`, `domain` and `apiKey` parameters to yours (or even change the adapter if you don't use Mailgun).

Also you can configure integrated Parse Dashboard (in `extraConfig` object in `config.js`):

| Parameter | config.json  | process.env  |
| :---:   | :-: | :-: |
| Dashboard enabled | dashboardActivated | DASHBOARD_ACTIVATED |
| Email for dashboard | userEmail | USER_EMAIL |
| Password for dashboard | userPassword | USER_PASSWORD |

## API Documentation

View the extensive Parse Platform guides for information about how to further configure Parse Server and make use of the many features available.

## Contributing

Please follow the Mural SDLC process for contributions via pull requests.

## License

This project is licensed under the [MIT License](LICENSE). Make sure to include a copy of the license file in your project.

## Contact

Author: Steve Schofield [steves@mural.co](mailto:steves@mural.co)

