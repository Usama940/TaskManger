import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "5d",
  });

  // Agar cookie use nahi karni to ye hata do:
  // res.cookie("jwt", token, {
  //   httpOnly: true,
  //   secure: true,
  //   sameSite: "strict",
  // });

  // JSON me token return karo
  return res.json({
    success: true,
    token: token,
  });
};
