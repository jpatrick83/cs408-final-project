# Web Dev Starter Code

## Project Spec

Holiday Planner Web App
1. General Theme
The Holiday Planner is a personal productivity web app designed to help users organize their Christmas (or other holiday) season.
 It will combine three primary tools—To-Do List, Grocery List, and Gift List—into one interface that can be accessed from any browser.
The goal is to help users manage time, track shopping needs, and stay within budget during the busy holiday period.
 Users will be able to add, edit, and delete items in each list, all stored in an AWS-hosted database so that their data persists between sessions.

2. What It Will Do
The app will provide a clean, user-friendly front-end written in HTML, CSS, and JavaScript that communicates with AWS (via API Gateway + Lambda + DynamoDB or similar) to perform CRUD operations.
Core Functionalities
To-Do List Page


Users can add daily or weekly holiday tasks (e.g., Decorate the tree, Send cards, Clean guest room).


Each task can be marked complete or deleted.


The data will be stored and retrieved dynamically from AWS.


Grocery List Page


Users can maintain a list of grocery items for holiday meals.


Each entry includes an item name, quantity, and optional note.


The user can mark items as “purchased” and remove them once done.


Gift List Page


Users can record who they’re buying gifts for, gift ideas, and a budget amount.


The list will allow marking gifts as “purchased” or “wrapped.”


The app can later include a total budget tracker as a stretch goal.


Landing Page (index.html)


A festive home screen introducing the app with a quick overview and navigation buttons to the three main list pages.


It will also include a short “Add a task for today” form directly on the landing page to meet the C-level requirements.


Technical Details
Front-End: HTML, CSS, JavaScript (using Fetch or Axios to interact with AWS endpoints).


Back-End: AWS Lambda functions connected to DynamoDB for data persistence.


Form Submission: User input from each page is sanitized before sending to AWS to prevent injection or malformed data.


Testing: Front-end JavaScript will have Jest or similar tests to verify input handling, DOM manipulation, and API calls.



3. Target Audience
This project is aimed at anyone preparing for the holidays, including families, students, and working adults.
 The interface will be simple enough for non-technical users but structured enough to demonstrate software design and web development skills.
The app could also be repurposed later for other seasonal events (Thanksgiving, Easter, birthdays, etc.) by changing styling and labels.

4. Data to Manage
The following data will be dynamic and stored in AWS:
List Type
Example Fields
Notes
To-Do
taskId, taskName, isCompleted, dateAdded
Simple daily planner
Grocery
itemId, itemName, quantity, isPurchased
For meal and party planning
Gift
giftId, recipient, giftIdea, budget, status
Tracks gifts, cost, and completion

All these lists will be created, read, updated, and deleted through the web interface.
Static data (like headers, images, and icons) will live in the front-end only.

5. Stretch Goals
Once all required functionality is working, I plan to add several enhancements:
 -  Custom Themes: Users can switch between holiday color themes (Christmas, Hanukkah, New Year).


 - Budget Summary: The Gift List could calculate total spending versus budget.


- Countdown Timer: A live countdown to Christmas Day on the landing page.


- User Login: Add Cognito authentication so each user can have private lists.


- Calendar Integration: Display upcoming tasks on a small interactive calendar.


## Project Wireframe

TODO: Replace the wireframe below with you own design.

![wireframe](wireframe-example.png)
