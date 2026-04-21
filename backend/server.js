const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({
    code: 200,
    msg: "后端连接成功！",
    data: "Netlify H5 + Render 后端完美运行"
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("后端启动成功");
});