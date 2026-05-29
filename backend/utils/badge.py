def generate_badge_svg(score: int) -> str:
    score = max(0, min(100, int(score)))
    if score >= 80:
        color = "#1D9E75"
    elif score >= 50:
        color = "#BA7517"
    else:
        color = "#E24B4A"

    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="110" height="20" role="img" aria-label="SecureAgent: {score}/100">
  <title>SecureAgent security score: {score}/100</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r"><rect width="110" height="20" rx="3" fill="#fff"/></clipPath>
  <g clip-path="url(#r)">
    <rect width="62" height="20" fill="#555"/>
    <rect x="62" width="48" height="20" fill="{color}"/>
    <rect width="110" height="20" fill="url(#s)"/>
    <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11">
      <text x="31" y="14">SecureAgent</text>
      <text x="86" y="14">{score}</text>
    </g>
  </g>
</svg>"""
