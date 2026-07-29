const home = (req, res) => {
    res.json({
        name: "VendorHub API",
        version: "1.0.0",
        status: "OK"
    })
};

export {home};