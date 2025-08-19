import { resetPassword } from "../../Controllers/authcontroller";

export default async function handler(req, res) {
  if (req.method === "POST") {
    return resetPassword(req, res);
  }
  res.status(405).json({ message: "Method Not Allowed" });
}
