import prisma from "../../lib/prisma.js";
import bcrypt from "bcrypt";
import { authTokenGen } from "../utils/authTokenGen.js";


const register = async (req, res) => {
    const { fullName, email, password } = req.body;

    const emailExists = await prisma.vendor.findUnique({
        where: { email: email },
    });

    if (emailExists) {
        return res.status(400)
        .json({ error: "Email is already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const vendor = await prisma.vendor.create({
    data: { fullName, email, passwordHash: hashedPassword },
    });

    res.status(201).json({
        message: "Vendor created",

    });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const vendorLogin = await prisma.vendor.findUnique({ where: { email: email }
  });

  if (!vendorLogin) {
    return res.status(400).json({ error: "Invalid email or password" });
  }
  
  const verifypass = await bcrypt.compare(password, vendorLogin.passwordHash);
  console.log(verifypass)

  if (!verifypass) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  
  delete vendorLogin.passwordHash
  
  const token = authTokenGen(vendorLogin);

  res.status(200).json({
    token,
    message: "Vendor retrieve successful", vendorLogin
    
  })
};

const logout = async (req, res) => {
  res.status(200).json({
    message: "Logout successful"
  })

};

const getCurrentUser = async (req, res) => {
    try {
        const vendor = await prisma.vendor.findUnique({
          where: {
            id: req.vendor.id
            },
          });

    if (!vendor) {
      return res.status(404).json({ 
        "message": "Vendor not found" });
    }

    delete vendor.passwordHash;
    res.json(vendor);

  } catch (error) {
  console.error(error);

  res.status(500).json({
    message: error.message
  });
}
};

const deleteAccount = async (req, res) => {
  try {
    await prisma.vendor.delete({ where: { id: req.vendor.id } });
    res.status(200).json({ message: "Account deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export {register};
export {login};
export {getCurrentUser};
export {deleteAccount};
export {logout};
