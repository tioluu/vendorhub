import jwt from "jsonwebtoken"

const tokenGen = (user) => {
    return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET,
    { expiresIn: "50m" }
  );
};

export {tokenGen};