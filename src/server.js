const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const eventRoutes = require('./routes/eventRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Middleware
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/', eventRoutes);

// Error Handling
app.use(errorMiddleware.notFound);
app.use(errorMiddleware.errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
