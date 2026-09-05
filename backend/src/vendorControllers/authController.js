import prisma from "../../lib/prisma.js";
import bcrypt from "bcrypt";
import { authTokenGen } from "../utils/authTokenGen.js";


const register = async (req, res) => {
    const { fullName, email, password } = req.body;

    const emailExists = await prisma.user.findUnique({
        where: { email: email },
    });

    if (emailExists) {
        return res.status(400)
        .json({ error: "Email is already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
    data: { fullName, email, passwordHash: hashedPassword },
    });

    res.status(201).json({
        message: "User created",
    });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const userLogin = await prisma.user.findUnique({ where: { email: email }
  });

  if (!userLogin) {
    return res.status(400).json({ error: "Invalid email or password" });
  }
  
  const verifypass = await bcrypt.compare(password, userLogin.passwordHash);
  console.log(verifypass)

  if (!verifypass) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  
  delete userLogin.passwordHash
  
  const token = authTokenGen(userLogin);

  res.status(200).json({
    token,
    message: "User retrieve successful", userLogin
    
  })
};

const logout = async (req, res) => {
  res.status(200).json({
    message: "Logout successful"
  })

};

const getCurrentUser = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
          where: {
            id: req.user.id
            },
          });

    if (!user) {
      return res.status(404).json({ 
        "message": "User not found" });
    }

    delete user.passwordHash;
    res.json(user);

  } catch (error) {
  console.error(error);

  res.status(500).json({
    message: error.message
  });
}
};

export {register};
export {login};
export {getCurrentUser};
export {logout};
