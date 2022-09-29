const app = require('./app');
const PORT = 3000;

//

const routes = require('./routes');
app.use(routes);

//


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
});