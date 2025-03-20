## API Documentation

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
```json
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
```json
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


## 11. Save to Memory (`/update-to-memory`) [POST]

### Endpoint:

POST {NEXT_PUBLIC_BACKEND_URL}/update-chat-memory

### Description:
Saves chat memory by sending the user’s request and response along with their email.

### Request Body (JSON):
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
