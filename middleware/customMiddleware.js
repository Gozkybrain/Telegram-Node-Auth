function customMiddleware(req, res, next) {
    console.log(`Request received at ${new Date().toISOString()}`);
    next(); // Call the next middleware or route handler
}

module.exports = { customMiddleware };
