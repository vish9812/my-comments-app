import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/comments", (req, res) => {
  console.log("Got comments>>>");
  res.json([
    {
      commenter: "Rob Hope",
      time: new Date(2022, 0, 26, 21),
      text: `When you submit your work via the application form on we’ll ask you to explain a couple of the big architectural decisions you made, and anything you’d do differently next time around.`,
      upvotes: [],
    },
    {
      commenter: "Rob Hope",
      time: new Date(2022, 0, 26, 21, 5),
      text: `When you submit your work via the application form on we’ll ask you to explain a couple of the big architectural decisions you made, and anything you’d do differently next time around.`,
      upvotes: [],
    },
  ]);
});

app.listen(process.env.PORT, () => console.log("App is running"));
