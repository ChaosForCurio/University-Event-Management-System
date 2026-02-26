exports.notFound = (req, res, next) => {
    res.status(404).render('pages/404', {
        view: 'error',
        currentUser: { role: 'guest' },
        message: "Page not found"
    });
};

exports.errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).render('pages/500', {
        view: 'error',
        currentUser: { role: 'guest' },
        error: process.env.NODE_ENV === 'production' ? {} : err,
        message: err.message || "An unexpected error occurred"
    });
};
