# HumanVsRobot

## Survey App

### Purpose
The purpose of this survey app is to collect user ratings on various answers, evaluating them based on three criteria: Knowledge, Helpfulness, and Empathy.

### App Structure

#### Landing Page
- Brief introduction to the survey's purpose
- Basic user information collection
- Clear instructions on how the rating process works

#### Question Presentation
- Display a single question and answer at a time
- Present the three rating criteria (Knowledge, Helpfulness, Empathy)

#### Rating Interface
- For each answer, allow users to provide a rating for each of the three criteria
- Use a 5-point Likert scale (Veldig dårlig, Dårlig, Middels, Bra, Veldig bra)

#### Progression & Submission
- After rating an answer, move users to the next one automatically
- Clearly indicate progress (e.g., "Question 2 of 5")
- Once all answers are rated, present a submission button
- Include a "Thank You" page upon submission with an option for additional feedback

### Backend & Database

#### Secure Data Storage
- Uses PostgreSQL database
- Implements proper data sanitization and validation

#### Data Structure
- Stores user information, questions, answers, and ratings

#### API Endpoints
- Fetching questions and answers
- Storing user ratings
- Submitting user feedback

### Usage Instructions
1. Clone the repository
2. Install dependencies using `npm install`
3. Start the development server using `npm start`
4. Open the app in your browser at `http://localhost:3000`
5. Follow the instructions on the landing page to complete the survey

### Database Setup
1. Install PostgreSQL on your machine if you haven't already.
2. Create a new database for the survey app.
3. Update the database connection details in `src/backend/database.js` with your database credentials.
4. Run the following command to create the necessary tables:
   ```bash
   node src/backend/models.js
   ```
5. Start the backend server using `npm run start-backend`.

### Importing Questions and Answers from CSV
1. Prepare a CSV file with the following headers: "question", "answer1", "answer2".
2. Place the CSV file in the root directory of the project.
3. Run the following command to import the questions and answers from the CSV file:
   ```bash
   node src/backend/models.js import <path_to_csv_file>
   ```
4. The questions and answers will be imported into the database.

### Exporting Survey Data
1. Ensure the backend server is running.
2. To export the survey data, run the following command:
   ```bash
   node src/backend/export.js
   ```
3. The exported data will be saved as a CSV file in the `exports` directory with a timestamp in the filename.
4. The exported CSV file will contain user ratings and feedback.

### Technologies Used
- Frontend: React, React Router
- Backend: Node.js, Express
- Database: PostgreSQL
- Additional libraries: bcrypt, cors, csv-parser, csv-writer, dotenv

### Deployment
The app is configured for deployment on Heroku. Use the following command to build the app for production:
```bash
npm run build
```