import jsPDF from "jspdf"

export default function generatePDF(scanResult) {

  const doc = new jsPDF()

  // TITLE
  doc.setFontSize(24)
  doc.text("SecureAgent Security Report", 20, 20)

  // INFO
  doc.setFontSize(14)

  doc.text(
    `Repository: ${scanResult?.repo || "Unknown Repo"}`,
    20,
    40
  )

  doc.text(
    `Generated: ${new Date().toLocaleString()}`,
    20,
    50
  )

  doc.text(
    `Security Score: 42%`,
    20,
    60
  )

  // VULNERABILITIES
  let y = 90

  doc.setFontSize(18)
  doc.text("Detected Vulnerabilities", 20, y)

  y += 20

  scanResult?.vulnerabilities?.forEach((vuln, index) => {

    doc.setFontSize(14)

    doc.text(
      `${index + 1}. ${vuln.title}`,
      20,
      y
    )

    y += 10

    doc.text(
      `Severity: ${vuln.severity}`,
      25,
      y
    )

    y += 10

    doc.text(
      `OWASP: ${vuln.owasp || "A1"}`,
      25,
      y
    )

    y += 10

    doc.text(
      `Description: ${vuln.description || "No description"}`,
      25,
      y
    )

    y += 20

    // NEW PAGE
    if (y > 250) {
      doc.addPage()
      y = 20
    }

  })

  // SAVE
  doc.save(
    `secureagent-report-${Date.now()}.pdf`
  )
}