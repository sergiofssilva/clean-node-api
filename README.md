<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
* [Built With](#built-with)
* [Getting Started](#getting-started)
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Execution](#execution)
* [Usage](#usage)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)
* [Acknowledgements](#acknowledgements)



<!-- ABOUT THE PROJECT -->
## About The Project

Clean Node Api - Survey Application

NodeJs Rest API for Survey Application

This project is about an API to manage surveys.

### Built With
It was build with NodeJS/Typescript, ExpressJS, Clean Architecture and SOLID Pattern.
* NodeJS
* Typescript
* MongoDB
* ExpressJS


<!-- GETTING STARTED -->
## Getting Started

Follow this instructions to run the application

### Prerequisites

You should have installed some tools:

- **Docker** version 24.0.2 or above
- **Docker-compose** version 2.18.1, or above
- **Node** version 18.16, or above
- **NPM** version 9.5.1, or above

### Installation

>You should clone this project using the command below:

```
$ git clone https://github.com/sergiofssilva/clean-node-api.git
```

>Go to the project folder:

```
$ cd clean-node-api
```

>Installing the dependencies:
```
$ npm install
```

<!-- EXECUTION -->
## Execution

After the npm installation run:

```
$ npm run up
```

This command will build the dist folder with the tsc and will compose the containers application
After the container is up. The application will listen at http://localhost:5050/api

<!-- USAGE EXAMPLES -->
## Usage

There are 5 endpoints:

`POST /signup`
```
body: {
    "name": "user_name",
    "email": "user_mail@mail.com",
    "password": "1234",
    "passwordConfirmation": "1234"
}
```


`POST /login`
```
body: {
    "email": "user_mail@mail.com",
    "password": "1234"
}
```

`GET /survey`
```
body: <empty>
```

`POST /survey`
```
body: {
    "question": "Question 1",
    "answers": [{
        "image": "name-image-1",
        "answer": "Answer 1"
    },{
        "image": "name-image-2",
        "answer": "Answer 2"
    }]
}
```

`PUT /survey/:surveyId/results`
```
body: {
    "answer": "Answer 1"
}
```

`GET /survey/:surveyId/results`
```
body: <empty>
```


<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.


<!-- CONTACT -->
## Contact

[Sérgio Fernandes](https://github.com/sergiofssilva)

Project Link: [https://github.com/sergiofssilva/clean-node-api.git](https://github.com/sergiofssilva/clean-node-api.git)