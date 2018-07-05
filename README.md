# Hands to Hear

[Hands to Hear](https://hands-to-hear.netlify.com/) is an app designed using a Spaced Repetition algorithm to help you learn basic ASL (American Sign Language).

## View the Frontend code here:
https://github.com/AlexaScott33/hands-to-hear-client

## Link to Heroku:
https://alex-megan-spaced-repetition.herokuapp.com/

## Tech Used

### Front-End
* React
* Redux
* HTML
* CSS

### Back-End
* Node
* Express
* MongoDB
* Mongoose
* Passport
* Bcrypt

### Testing and Deployment
* Mocha
* Chai
* Heroku
* mLab
* Netlify

## Running Locally

* Clone this repository: `git clone https://github.com/thinkful-ei19/Alexa-Megan-Spaced-Repetition-App-Server.git`

* Move into the project directory: `cd Alexa-Megan-Spaced-Repetition-App-Server/`
* Install the dependencies: `npm install`
* Run the development task: `npm start`
    * Starts a server running at http://localhost:8080

## Resources

### Users (/users)

* GET
    * Get user info

* POST
    * Register new user <br />
        requires: username, password <br />
        responds with username, password

### Auth (/login)

* POST
    * Login existing user <br />
        requires: username, password <br />
        responds with authToken

### Questions (/questions)

* GET
    * Gets a specific user's first question from the list <br />
        requires: username <br />
        responds with first question in user's list

* POST
    * Gets user and makes changes to user's questions list
    * Uses an algorithm where each question has a certain M value to determine where in the list question should be inserted <br />
        requires: username, answer (in body) <br />
        responds with new first question in user's list

## Schemas

### Users

<img width="470" alt="screen shot 2018-05-31 at 7 15 29 pm" src="https://user-images.githubusercontent.com/35544816/40813085-16d85470-6507-11e8-8e30-389d3ef78e79.png">

### Questions

<img width="382" alt="screen shot 2018-05-31 at 7 15 45 pm" src="https://user-images.githubusercontent.com/35544816/40813104-2abba53c-6507-11e8-8297-caace2c0dcc9.png">




