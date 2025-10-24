import jwt from "jsonwebtoken";

export const tokenGeneration = (userId, res) => {
  const secret = process.env.JWT_SECRET || process.env.secretkey;
  if (!secret) throw new Error("JWT secret is not configured");

  const token = jwt.sign({ userId }, secret, {
    expiresIn: "7d",
  });

  // Return token in response body (frontend will store in localStorage)
  // Also set cookie for backward compatibility, but token in body is primary
  const isProd = process.env.NODE_ENV === "production";
  const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  };

  res.cookie("jwt", token, cookieOptions);
  console.log("✓ Token generated and cookie set");
  
  // Return token in response so frontend can store it
  res.locals.token = token;
};
