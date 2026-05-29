import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const HEIGHT = 280
const MIN_LABEL_WIDTH = 40
const RISK_LOW = '#1D9E75'
const RISK_HIGH = '#E24B4A'

function basename(file) {
  if (!file) return ''
  const parts = file.split(/[/\\]/)
  return parts[parts.length - 1] || file
}

function riskColor(interpolate, riskScore) {
  const t = Math.min(100, Math.max(0, riskScore ?? 0)) / 100
  return interpolate(t)
}

export default function FileHeatmap({ files = [], onFileClick }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.replaceChildren()
    if (!files.length) return

    const width = container.clientWidth || 600
    const interpolate = d3.interpolateRgb(RISK_LOW, RISK_HIGH)
    const totalLines = files.reduce((sum, f) => sum + (f.line_count || 0), 0)

    const root = d3
      .hierarchy({ children: files })
      .sum((d) => (totalLines === 0 ? 1 : d.line_count || 0))
      .sort((a, b) => b.value - a.value)

    d3.treemap()
      .tile(d3.treemapSquarify)
      .size([width, HEIGHT])
      .paddingInner(2)
      .round(true)(root)

    const svg = d3
      .select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', HEIGHT)

    const tooltip = d3
      .select(container)
      .append('div')
      .style('position', 'absolute')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('padding', '6px 10px')
      .style('border-radius', '4px')
      .style('background', 'rgba(15, 23, 42, 0.92)')
      .style('color', '#f8fafc')
      .style('font-size', '12px')
      .style('line-height', '1.4')
      .style('white-space', 'nowrap')
      .style('z-index', 1)

    const cell = svg
      .selectAll('g')
      .data(root.leaves())
      .join('g')
      .attr('transform', (d) => `translate(${d.x0},${d.y0})`)

    cell
      .append('rect')
      .attr('width', (d) => Math.max(0, d.x1 - d.x0))
      .attr('height', (d) => Math.max(0, d.y1 - d.y0))
      .attr('fill', (d) => riskColor(interpolate, d.data.risk_score))
      .style('cursor', onFileClick ? 'pointer' : 'default')
      .on('click', (event, d) => {
        event.stopPropagation()
        onFileClick?.(d.data.file)
      })
      .on('mouseenter', function (_event, d) {
        d3.select(this).attr('stroke', '#ffffff').attr('stroke-width', 1)
        tooltip
          .style('opacity', 1)
          .html(
            `<strong>${d.data.file}</strong><br/>Vulns: ${d.data.vuln_count ?? 0}<br/>Risk: ${d.data.risk_score ?? 0}`,
          )
      })
      .on('mousemove', (event) => {
        const bounds = container.getBoundingClientRect()
        tooltip
          .style('left', `${event.clientX - bounds.left + 12}px`)
          .style('top', `${event.clientY - bounds.top + 12}px`)
      })
      .on('mouseleave', function () {
        d3.select(this).attr('stroke', null).attr('stroke-width', null)
        tooltip.style('opacity', 0)
      })

    cell
      .append('text')
      .attr('x', 4)
      .attr('y', 14)
      .attr('fill', '#ffffff')
      .attr('font-size', 11)
      .style('pointer-events', 'none')
      .style('user-select', 'none')
      .text((d) => basename(d.data.file))
      .attr('display', (d) =>
        d.x1 - d.x0 >= MIN_LABEL_WIDTH ? null : 'none',
      )

    return () => {
      container.replaceChildren()
    }
  }, [files, onFileClick])

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '100%', height: HEIGHT }}
    />
  )
}
