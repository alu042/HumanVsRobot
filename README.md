# HumanVsRobot

## Survey App

### Purpose
The purpose of this survey app is to collect user ratings on various questions, comparing two different answers based on three criteria: Knowledge, Correctness, and Empathy.

### App Structure

#### Landing Page
- Brief introduction to the survey's purpose
- Basic user information collection (e.g., age group, gender, any relevant demographic data)
- Clear instructions on how the rating process works

#### Question Presentation
- Display a single question at a time
- Show the two different answers side-by-side or in a clear, distinguishable format
- Present the three rating criteria (e.g., Knowledge, Correctness, Empathy)

#### Rating Interface
- For each answer, allow users to provide a rating for each of the three criteria
- Use a suitable rating scale (e.g., 1-5 stars, Likert scale) that is visually intuitive
- Consider adding an optional text field for users to provide additional comments or feedback

#### Progression & Submission
- After rating a question, move users to the next one automatically
- Clearly indicate progress (e.g., "Question 2 of 5")
- Once five questions are rated, present a submission button
- Optionally, include a "Thank You" page upon submission

### Backend & Database

#### Secure Data Storage
- Choose a robust database solution (e.g., PostgreSQL, MySQL)
- Implement proper data sanitization and validation to prevent SQL injection and other vulnerabilities
- Encrypt sensitive user information (if collected) both in transit and at rest

#### Data Structure
- Create tables to store:
  - User information (anonymized or minimally identifiable)
  - Questions and their corresponding answers
  - Ratings for each answer and criteria
  - Any additional comments

#### API Endpoints
- Develop secure API endpoints to handle:
  - Fetching questions and answers
  - Storing user ratings and comments
  - Retrieving aggregated data for analysis (for your use)

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
3. The exported data will be saved as a CSV file in the `exports` directory with a timestamp in the filename (e.g., `survey_data_2023-05-10_145623.csv`).
4. The exported CSV file will contain the following columns:
   - User ID
   - Question
   - Answer 1
   - Answer 2
   - Knowledge Rating (Answer 1)
   - Correctness Rating (Answer 1)
   - Empathy Rating (Answer 1)
   - Knowledge Rating (Answer 2)
   - Correctness Rating (Answer 2)
   - Empathy Rating (Answer 2)
   - User Comments
