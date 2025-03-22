This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


To add a `GET` request handler that fetches data for a specific user based on their email (passed as a query parameter), you can extend the existing API route. Here's the updated code:

---


### **Explanation of Changes**

1. **GET Request Handler**:
   - The `GET` request fetches data for a specific user based on their email.
   - The email is passed as a query parameter (`req.query.email`).
   - If the email is missing or invalid, the API returns a `400 Bad Request` error.
   - If no user is found with the provided email, the API returns a `404 Not Found` error.

2. **Query Parameter**:
   - The email is accessed via `req.query.email`.
   - Example request: `/api/saveData?email=user@example.com`.

3. **Error Handling**:
   - Proper error handling is added for missing/invalid email and database errors.

4. **Database Connection**:
   - The MongoDB connection is reused for both `POST` and `GET` requests to avoid redundant connections.

---

### **Example Requests**

#### **POST Request**
- **Endpoint**: `/api/saveData`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "water": 100,
    "energy": {
      "lights": { "count": 5, "consumption": 50 },
      "fan": { "count": 2, "consumption": 75 },
      "heater": { "count": 1, "consumption": 1500 }
    },
    "waste": 10
  }
  ```

#### **GET Request**
- **Endpoint**: `/api/saveData?email=user@example.com`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "_id": "64f1b2c3e4b0a1b2c3d4e5f6",
    "email": "user@example.com",
    "water": 100,
    "energy": {
      "lights": { "count": 5, "consumption": 50 },
      "fan": { "count": 2, "consumption": 75 },
      "heater": { "count": 1, "consumption": 1500 }
    },
    "waste": 10
  }
  ```

---

### **Testing the API**

1. **Save Data (POST)**:
   - Use a tool like Postman or `curl` to send a `POST` request with the required body.

2. **Fetch Data (GET)**:
   - Use a browser or `curl` to send a `GET` request with the email as a query parameter:
     ```bash
     curl "http://localhost:3000/api/saveData?email=user@example.com"
     ```

---

### **Optional: Add Caching**
If the data doesn't change frequently, you can add caching to improve performance. For example, use `res.setHeader` to set cache headers:
```typescript
res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate")
```

---

This implementation allows you to save and fetch user data using the same API route. Let me know if you need further assistance!
