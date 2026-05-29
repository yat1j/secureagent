const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("SecureAgent Backend Running")
})

app.post("/scan", (req, res) => {

  const { repoUrl } = req.body

  console.log("Scanning Repo:", repoUrl)

  res.json({
    success: true,
    message: "Repository scanned successfully",
    vulnerabilities: [
      {
        title: "SQL Injection",
        severity: "Critical"
      },
      {
        title: "Weak Password Logic",
        severity: "Medium"
      }
    ]
  })

})

app.listen(5000, () => {
  console.log("Server running on port 5000")
})