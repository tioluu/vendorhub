import prisma from "../../lib/prisma.js";
import bcrypt from "bcrypt";

const register = async (req, res) => {
    const { fullName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const emailExists = await prisma.user.findUnique({
        where: { email: email },
    });

    if (emailExists) {
        return res.status(400)
        .json({ error: "Email is already taken" });
    }

    const user = await prisma.user.create({
    data: {
      fullName,
      email,
      passwordHash: hashedPassword,
    },
    });

    res.status(201).json({
        message: "User created",
    });
    };

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    return res.status(400)
    .json({ error: "Invalid email or password" });
  }

  const verifypass = await bcrypt.compare(password, user.passwordHash);
  console.log(verifypass)
  if (!verifypass) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  delete user.passwordHash
  return res.status(200).json({
    message: "User retrieve successful", user
  })
};

export {register};
export {login};
