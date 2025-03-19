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

**Response Interface**
export interface AllDetails{
  dashBoardMetrics : DashboardMetricsData;
  chartData : CarbonChartProps;
  ecoscore : EcoScoreData;
  badges: BadgesType[]
  Level : number
}

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

```md
## 11. Save to Memory (`/update-to-memory`) [POST]

### Endpoint:
```
POST {NEXT_PUBLIC_BACKEND_URL}/update-chat-memory
```

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


