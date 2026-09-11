import jwt from "jsonwebtoken"

const authTokenGen = (vendor) => {
    return jwt.sign({ id: vendor.id, email: vendor.email }, process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
};

export {authTokenGen};