import { registerUser } from "../../Controllers/authcontroller";

export default async function handler(req, res) {
  if (req.method === "POST") {
    return registerUser(req, res);
  }
  res.status(405).json({ message: "Method Not Allowed" });
}
