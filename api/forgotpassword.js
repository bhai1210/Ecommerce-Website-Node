import { forgotPassword } from "../../Controllers/authcontroller";

export default async function handler(req, res) {
  if (req.method === "POST") {
    return forgotPassword(req, res);
  }
  res.status(405).json({ message: "Method Not Allowed" });
}
