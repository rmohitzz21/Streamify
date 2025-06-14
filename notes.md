📌 1. Validation Logic (on signup and login)
✅ Checks for empty fields (email, password, fullName)

✅ Password length check (minimum 6 characters)

✅ Validates email format using Regex

✅ Prevents duplicate user registration by checking if the email already exists in the database

🔒 2. Password Hashing and Matching
✅ You should be using Mongoose pre-save hook in your User model to hash passwords

user.matchPassword(password) is a method to compare plain vs hashed password using bcrypt

💡 Make sure your User.js model handles password hashing and has a matchPassword method!

🧠 3. JWT Token Generation & Cookie Handling
js
Copy code
const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
res.cookie("token", token, { ... });
Used for authentication after signup/login

Stored in HTTP-only cookies for security

Token is set with sameSite, secure, httpOnly, and maxAge options

🔐 httpOnly = client-side JavaScript can’t access cookie (prevents XSS)

🎭 4. Middleware: protectRoute
You need this to:

Extract token from cookie

Verify it using jwt.verify(token, secret)

Attach userId to req.userId

Restrict access to authenticated users only

✅ Protect private routes like:

js
Copy code
router.post("/onboarding", protectRoute, onboard);
💬 5. Stream Chat Integration
You are syncing users to Stream Chat API:

js
Copy code
await upsertStreamUser({
  id: newUser._id.toString(),
  name: newUser.fullName,
  image: newUser.profilePic || "",
});
Uses upsertUsers() to create or update a user in Stream

Keeps user in sync with your app's user

Needs a StreamChat.getInstance(apiKey, apiSecret) client

🔐 6. Logout
js
Copy code
res.clearCookie("token")
Clears the JWT token from browser

Logs user out by removing authentication state

⚠️ You're currently calling res.clearCookie("jwt"), but cookie is set as "token" – this needs to match or logout won't work.

✅ Fix:

js
Copy code
res.clearCookie("token");
✏️ 7. To Do: Onboarding Controller
You declared this but haven't implemented:

js
Copy code
export async function onboard(req, res) { }
🔧 You can use this to:

Store onboarding details (e.g. interests, bio)

Update user's first-login status

Create a welcome channel in Stream, etc.


Use daisy Ui  -> For Easy Button Code

Tailwind
React Route
React-host-toast -> For Alertv ✅

 axios
 react query 
 tanstack query :=> TanStack Query (React Query) simplifies working with remote data (like APIs). Instead of manually handling loading, error states, caching, and re-fetching, it does all that for you with hooks like useQuery.


✅ When to Use TanStack Query?
Use it when:

You need to fetch data from APIs.
You want auto caching, re-fetching, and background updates.
Your app grows and you need organized data fetching logic.

✅ What is Axios?
Axios is a promise-based HTTP client for the browser and Node.js, used to send HTTP requests (like GET, POST, PUT, DELETE) to APIs.

It's an alternative to the built-in fetch() method in JavaScript — but with more features and a simpler syntax.


For Chat Page
 We Use Get Stream Io Package : npm i  stream-chat stream-chat-react


 -------Chat-------
 const chanelId = [authUser._id, targetUserId].sort().join("-");

🔍 The Problem
If you don’t sort:

If you start the chat, ID becomes:
channelId = "A-B"

If your friend starts the chat, ID becomes:
channelId = "B-A"

➡️ Now you have two different channel IDs for the same two users — ❌ bad.

✅ The Solution
By using .sort():
[A, B].sort() → [A, B]
[B, A].sort() → [A, B]
