const express = require("express")
const app = express();

const route = require("./routes")

app.use(express.json());

app.use("/", route);

const port = 5000;
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
