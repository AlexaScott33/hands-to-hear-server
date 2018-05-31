# Hands to Hear

[Hands to Hear](https://compassionate-fermi-44db9e.netlify.com/) is an app designed using a Spaced Repetition algorithm to help you learn basic ASL (American Sign Language).

## View the Frontend code here:
https://github.com/thinkful-ei19/Alexa-Megan-Spaced-Repetition-Client

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

### Deployment
* Heroku
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
    * Register new user

### Auth (/login)

* POST
    * Login existing user and returns an authToken

### Questions (/questions)

* GET
    * Requires Authentication
    * Gets a specific user's first question from the list

* POST
    * Requires Authentication
    * Gets user and makes changes to user's questions
    * Users algorithm to determine where in the list the question should be inserted

