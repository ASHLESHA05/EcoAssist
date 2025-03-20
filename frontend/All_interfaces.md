## API Documentation
### Documented By @ashubhai [ASHLESHA05]
### 1. Get User Details - Sidebar

**Endpoint:** `/get-userDetails` [GET]

**Request Parameters:**

```json
{
  "name": "user?.name", // Pass user name
  "email": "user?.email" // Pass user email
}
```

**Response Type:**

```typescript
interface UserDetails {
  name: string;
  email: string;
  joinedDate: Date;
  location: string;
  level: number;
  levelProgress: number;
  profileVisibility: boolean; // true: visible, false: private
}
```

---

### 2. Get Notification Settings

**Endpoint:** `/get-notificationSettings` [GET]

**Request Parameters:**

```json
{
  "email": "user?.email"
}
```

**Response Type:**

```typescript
interface NotificationType {
  dailyTips: boolean;
  achievementAlert: boolean;
  friendActivity: boolean;
}
```

---

### 3. Update Notification Settings

**Endpoint:** `/update-notifications` [POST]

**Request Body:**

```json
{
  "key": "dailyTips" | "achievementAlert" | "friendActivity",
  "value": "newState[key]",
  "name": "user?.name",
  "email": "user?.email"
}
```

---

### 4. Update User Profile

**Endpoint:** `/update-user` [PUT]

**Request Body:**

```json
{
  "email": "user.email",
  "userData": {
    "name": "userData.name",
    "email": "userData.email",
    "joinedDate": "userData.joinedDate",
    "location": "userData.Location",
    "level": "userData.Level",
    "levelProgress": "userData.levelProgress",
    "profileVisibility": "userData.profileVisibility"
  }
}
```

---

### 5. Update Profile Visibility

**Endpoint:** `/update-profile-visibility` [POST]

**Request Body:**

```json
{
  "email": "user.email",
  "profileVisibility": "newVisibility"
}
```

---

### 6. Delete User

**Endpoint:** `/delete-user` [DELETE]

**Request Parameters:**

```json
{
  "email": "userData?.email"
}
```

---

### 7. Get All Details

**Endpoint:** `/get-all-details` [GET]

**Request Parametrs:**
```json
{ "email": "user?.email" }
```

**Response Type:**
```
{
    dashBoardMetrics : data,
    chartData : {
      weeklyData: weeklyData,
      monthlyData: monthlyData,
      yearlyData : yearlyData,
      maxData : maxData
    },
    ecoscore : ecoscoredata,
    badges: Badges,
    Level : Level
}
```


**Response Interface**
```
export interface AllDetails{
  dashBoardMetrics : DashboardMetricsData;
  chartData : CarbonChartProps;
  ecoscore : EcoScoreData;
  badges: BadgesType[]
  Level : number
}
```
**Do check /frontend/types/types.ts for more info**
---

### 8. Get Suggestion Cards

**Endpoint:** `/get-Suggestions` [GET]

**Request Parameters:**

```json
{
  "name": "user?.name",
  "email": "user?.email"
}
```

**Response Type:**

```typescript
interface SuggestionCard {
  title: string;
  description: string;
  icon: React.ComponentType;
  color: string; // e.g., 'text-blue-500'
  bgColor: string; // e.g., 'bg-blue-500/10'
}
```

---

### 9. Get Suggestion Description from AI Model

**Endpoint:** `/get-Suggestion-desc` [GET]

**Request Parameters:**

```json
{
  "title": "data.title",
  "description": "data.description"
}
```

**Response Type:**

```typescript
interface SuggestionDescription {
  detail: string;
  link: string; // article link
}
```

---

### 10. Get Actions from AI Model

**Endpoint:** `/get-Actions` [GET]

**Request Parameters:**

```json
{
  "email": "user?.email"
}
```

**Response Type:**

```typescript
interface Action {
  title: string;
  icon: React.ComponentType;
  points: number;
}
```

---
Here’s the markdown version of your API documentation:  


### 11. Save to Memory

**Endpoint:** `/update-chat-memory` [POST]

**Description:**
Saves chat memory by sending the user’s request and response along with their email.

**Request Body (JSON):**
```json
{
  "req": "How can I reduce my electricity bill?",
  "res": "To reduce your electricity bill, try: 1) Unplug devices when not in use, 2) Switch to LED bulbs, 3) Use natural light during the day.",
  "userEmail": "user@example.com"
}
```

### Example Usage:
```js
await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/update-chat-memory`, {
  req,
  res,
  userEmail, // Include the user's email in the request body
});
```

---

---


### 12. GetCalutationsData 

/get-calcData [GET]

request body
```
            params: {
              email: user?.email,
            },
```

response:
```
{
  transportData : {
    transportationMode: "car",
    commuteDistance: 12, 
    flightsCount: "1-2",
  },
  homeData : {
    energySource: "grid",
    electricityUsage: 80,
    homeSize: "medium",
    heatingType: "electric",
  },
  foodData : {
    dietType: "mixed",
    localFoodPercentage: 50,
    foodWaste: "medium",
    OrganicFood: "some",
  }
  shoppingData : {
    shoppingType: "moderate",
    sustainableProducts: 50,
    RecyclingHabbits: "most",
    fashionVsustainable: "mixed",
  }
  emissionData : {
    tansport : 120,
    home : 80,
    food : 60,
    shopping : 40
  }
}
```







---


## 13. Calculator AI with Backend (TODO)

**Endpoint:** `/calculate-carbon-update` [GET, POST]  
**Description:** Calculates the total amount of carbon footprint.

### Request Body (JSON):
```json
{
  "params": {
    "email": "user?.email",
    "paramsData": {
      "transport": "category === 'transport' ? data : transport",
      "home": "category === 'home' ? data : home",
      "food": "category === 'food' ? data : food",
      "shopping": "category === 'shopping' ? data : shopping"
    }
  }
}
```
**TODO:** Pass this to the AI model, get a response, store it in the database, and return all emission data.

### Response Body (JSON):
```json
{
  "emissionData": {
    "transport": 120,
    "home": 80,
    "food": 60,
    "shopping": 40
  }
}
```

---

## 14. Calculating Carbon - AI

**Endpoint:** `/calculate-carbon` [POST]  

### Request Parameters:
```json
{
  "params": {
    "transportdata": "transport",
    "homedata": "home",
    "fooddata": "food",
    "shoppingdata": "shopping"
  }
}
```

### Response:
```json
{
  "emissionData": {
    "transport": 120,
    "home": 80,
    "food": 60,
    "shopping": 40
  }
}
```

---

## 15. Save User Plan

**Endpoint:** `/savePlan` [PUT]  

### Request Body:
```json
{
  "email": "email",
  "title": "string",
  "description": "string"
}
```

---

## 16. Clear User Plan

**Endpoint:** `/clearPlan` [DELETE]  

### Request Body:
```json
{
  "email": "email"
}
```

---

## 17. User Register Check

**Endpoint:** `/userLogin` [POST]  

### Request Body:
```json
{
  "name": "string",
  "email": "email",
  "Location": "string"
}
```

---

## 18. Get User Plans  

**Endpoint:** `/getMyPlan` [GET]  

### Request:
```json
{
  "email": "email"
}
```

### Response:
```json
{
  "title": "string",
  "description": "string"
}
```
**Note:** Returns `500` if no plans exist.

---

## 19. Check if User is New or Old  

**Endpoint:** `/isNewUser` [GET]  

### Request:
```json
{
  "email": "email"
}
```

### Response:
```json
{
  "value": "bool" // true if the user is new
}
```

---

## 20. Get Survey Questions (AI + Backend)  

**Endpoint:** `/getSurveyQuestions` [GET]  

### Request:
```json
{
  "email": "email"
}
```

### Description:
- The backend should fetch all user data (as done in the dashboard) and pass it to a function called `AISurvey()`.
- If no data is found in the database, pass a default dictionary to AI:
```json
{
  "type": "newUser/OldUser",
  "data": {
    "all user data"
  }
}
```
- The AI will respond with survey questions.

### Response:
```json
{
  "id": "string",
  "question": "string",
  "type": "string",
  "options": [] // Only if type is "multiple-choice"
}
```

---

## 21. Submit Survey Answer  

**Endpoint:** `/surveyAnswer` [PUT]  

### Request Body:
```json
{
  "question": "answer"
}
```

**Example:**
```json
{
  "Do you smoke?": "No"
}
```

**Note:** This data may be used later for AI models.

---

## Function: Retrieve Survey Data from Database  

```python
def getSurveyData(email):
    return {"question": "answers"}
```
---
## 22. PopupNotify - AI + Backend (No DB)  

**Task:**  
- Get the user's email from the request parameters.  
- Fetch user details that include the following:  
  - `carbonFootprint`  
  - `waterSaved`  
  - `energySaved`  
  - `wasteReduced`  
- This data should be fetched from the database similarly to how it is done for the "Get All Details" in the dashboard, but with limited fields.  
- Send this data to the AI using the function `getNotification(data)`.  
- AI will respond with a notification that includes a **title**, **description**, and **quote**.  

---

**Endpoint:** `/popupNotify` [GET]  

### Request:
```json
{
  "email": "email"
}
```
---

## 23.ActivityUpdate
**Endpoint**
`POST /updateDailyActivities`

## Request
Sends a POST request to update daily activities for a user.

### Code Example
```typescript
const response = await axios.post(
  `${process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8080"}/updateDailyActivities`,
  {
    email: user.email,
    activities: activities (json),
  }
);
```

just store as email, json  ...where json has {act1: 'jj'}
on recieving updae append to json..
on 12 AM reset


## 24. Endpoint
`GET /getDailyActivity`

## Request
Sends a GET request to retrieve the daily activities of a user.

### Code Example
```typescript
const response = await axios.get(
  `${process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8080"}/getDailyActivity`,
  {
    params: {
      email: user.email,
    },
  }
);












```
prompt = """
data = {
  "usageMetrics": {
    "carbonFootprint": {
      "carbonFootPrintQty": 0,  # Replace with actual number
      "PrevMonthCmp": 0,  # Replace with actual number
      "isIncreaseCarbon": False,  # Replace with actual boolean
      "RemainingMonthlyGoal": 0,  # Replace with actual number
    },
    "waterSaved": {
      "waterSaved": 0,  # Replace with actual number
      "waterPrevMonthCmp": 0,  # Replace with actual number
      "isIncreaseWater": False,  # Replace with actual boolean
      "waterRemainingMonthlyGoal": 0,  # Replace with actual number
    },
    "power": {
      "powerSaved": 0,  # Replace with actual number
      "powerPrevMonthCmp": 0,  # Replace with actual number
      "isIncreasePower": False,  # Replace with actual boolean
      "powerRemainingMonthlyGoal": 0  # Replace with actual number
    },
    "waste": {
      "wasteReduced": 0,  # Replace with actual number
      "wastePrevMonthCmp": 0,  # Replace with actual number
      "isIncreaseWaste": False,  # Replace with actual boolean
      "wasteRemainingMonthlyGoal": 0  # Replace with actual number
    }
  },
  "ecoscore": 0,  # Replace with actual number
  "userCarbonHistoryData": {
    "weeklyAvgData": 0,  # Replace with actual number
    "monthlyAvgData": 0,  # Replace with actual number
    "yearlyAvgData": 0,  # Replace with actual number
    "maxAvgData": 0  # Replace with actual number
  },
  "AdditionalUserBehaviour": {
    "FeedbackForm": {}  # Replace with actual user preference JSON
  }
}

Based on the provided data about the user's carbon footprint, water usage, power consumption, waste management, eco-score, and historical carbon data, generate 5 personalized plans for carbon footprint reduction.

Each plan should be formatted as follows:
{
  "plan_1": {
    "title": "Title of the first plan",
    "description": "Detailed description of the first plan"
  },
  "plan_2": {
    "title": "Title of the second plan",
    "description": "Detailed description of the second plan"
  },
  ... and so on for plans 3, 4, and 5
}

The plans should be personalized based on the data provided, addressing specific areas where the user can improve their environmental impact. Make references to their current metrics, goals, and historical data to create meaningful and relevant recommendations.
"""
