const app = require("./app");
const connection = require("./config/db");

const PORT = 3000;

connection
  .then(() => {
    app.listen(PORT, () => {
      console.log(`SERVER RUNNING ON PORT: ${PORT}`);
    });
  })
  .catch((err) =>
    console.log(`ERROR: ${err}, error en conexion con base de datos`)
  );
