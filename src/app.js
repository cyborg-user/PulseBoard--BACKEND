import express from "express"
import authRoute from "./modules/auth/auth.routes.js"
import ApiError from "./common/utils/api-error.js"
import cookieParser from "cookie-parser"
import pollRoute from "./modules/poll/poll.routes.js"
import responseRoutes from "./modules/response/response.routes.js"
import analyticsRoutes from "./modules/analytics/analytics.routes.js";

const app= express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


app.use("/api/auth", authRoute);
app.use("/api/poll/", pollRoute)
app.use("/api/response/",responseRoutes)
app.use("/api/analytics/",analyticsRoutes)


app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// Catch-all for undefined routes
app.all("{*path}", (req, res) => {
  throw ApiError.notfound(`Route ${req.originalUrl} not found`);
});


export default app;
