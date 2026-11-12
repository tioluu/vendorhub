const home = (req, res) => {
    res.json({
        name: "VendorHub API",
        version: "1.0.1",
        status: "OK"
    })
};

export {home};