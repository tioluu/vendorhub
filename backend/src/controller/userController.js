import prisma from "../../lib/prisma.js";

const forgot_password = async (req, res) => {
  const {email} = req.body;

  const verifyEmail = await prisma.user.findUnique({
    where: {email: email},
  });

  res.status(200)
      .json({ error: "If an account with that email exists, a password reset link has been sent."
    });
};

export {forgot_password};