import jsPDF from "jspdf";

export default function generatePDF(scanResult) {
  const doc = new jsPDF();
  const { score, summary, vulnerabilities, session_id } = scanResult;

  // Page 1 — Cover
  doc.setFillColor(8, 8, 16);
  doc.rect(0, 0, 210, 297, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text("SecureAgent", 20, 40);
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(156, 163, 175);
  doc.text("Security Vulnerability Report", 20, 52);
  doc.setFontSize(11);
  doc.text(`Session: ${session_id}`, 20, 65);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 73);

  // Score
  const scoreColor = score >= 80 ? [29, 158, 117] : score >= 50 ? [186, 117, 23] : [226, 75, 74];
  doc.setTextColor(...scoreColor);
  doc.setFontSize(72);
  doc.setFont("helvetica", "bold");
  doc.text(String(score), 20, 140);
  doc.setFontSize(14);
  doc.setTextColor(156, 163, 175);
  doc.text("Security Score / 100", 20, 155);

  // Summary
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  const summaryLines = doc.splitTextToSize(summary || "", 170);
  doc.text(summaryLines, 20, 175);

  // Vulnerabilities — one per page
  vulnerabilities?.forEach((v, i) => {
    doc.addPage();
    doc.setFillColor(8, 8, 16);
    doc.rect(0, 0, 210, 297, "F");

    const sevColor = v.severity === "critical" ? [226, 75, 74] : v.severity === "high" ? [186, 117, 23] : [107, 114, 128];
    doc.setFillColor(...sevColor);
    doc.rect(0, 0, 4, 297, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`${i + 1}. ${v.title || v.rule_id}`, 14, 24);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(156, 163, 175);
    doc.text(`File: ${v.file}  |  Line: ${v.line}  |  ${v.owasp_classification || ""}`, 14, 34);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    const expLines = doc.splitTextToSize(v.explanation || "", 182);
    doc.text(expLines, 14, 48);

    if (v.business_impact) {
      doc.setTextColor(156, 163, 175);
      doc.setFontSize(10);
      const impLines = doc.splitTextToSize(`Impact: ${v.business_impact}`, 182);
      doc.text(impLines, 14, 48 + expLines.length * 6 + 8);
    }

    if (v.fixed_code) {
      doc.setFillColor(15, 15, 26);
      doc.rect(14, 120, 182, 40, "F");
      doc.setTextColor(134, 239, 172);
      doc.setFontSize(9);
      doc.setFont("courier", "normal");
      const fixLines = doc.splitTextToSize(v.fixed_code, 175);
      doc.text(fixLines.slice(0, 5), 18, 132);
    }
  });

  doc.save(`secureagent-report-${new Date().toISOString().split("T")[0]}.pdf`);
}
