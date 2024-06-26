import express from "express";
import port from "dotenv";
import connectDb from "./config/dbConfig";
import useRouter from "./routes/userRoutes";
import postRoute from "./routes/postRoutes";
import authRouter from "./routes/authRouter";
import cors from "cors";
import cookieParser from "cookie-parser";
import commentRoue from "./routes/commentRoute";
import path from "path";

const dirname = path.resolve();

const app = express();
port.config();

connectDb();
const Port = process.env.PORT || 5001;
app.use(express.json());
app.use(cookieParser());
// app.use(
//   cors({
//     credentials: false,
//   })
// );
app.enable("trust proxy");
app.listen(Port, () => {
  console.log("Server started successfully on Port: ", Port);
});

app.use("/api/user", useRouter);
app.use("/api/auth", authRouter);
app.use("/api/post", postRoute);
app.use("/api/comment", commentRoue);
// console.log(path.join(dirname, "/client/dist"), "path");
// app.use(express.static(path.join(dirname, "/client/dist")));  //needed for production

app.get("*", (req: express.Request, res: express.Response) => {
  // res.sendFile(path.join(dirname, "client", "dist", "index.html"));  //needed for production
  res.send({ Data: "Healthy" });
});
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const statusCode = err.statusCode || 500;
    console.log(err, "statusCode");
    const message = err.message || "Internal server Error";
    res.status(statusCode).json({ success: false, statusCode, message });
  }
);
