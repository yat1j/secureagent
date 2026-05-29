import { useEffect, useId, useRef } from 'react'
import * as d3 from 'd3'

const HEIGHT = 320
const NODE_RADIUS = 14

function severityFill(severity) {
  const s = (severity || '').toLowerCase()
  if (s === 'critical') return '#ef4444'
  if (s === 'high') return '#f59e0b'
  return '#9ca3af'
}

function basename(file) {
  if (!file) return ''
  const parts = file.split(/[/\\]/)
  return parts[parts.length - 1] || file
}

export default function AttackGraph({ nodes = [], edges = [], onNodeClick }) {
  const svgRef = useRef(null)
  const arrowId = `attack-graph-arrow-${useId().replace(/:/g, '')}`

  useEffect(() => {
    const el = svgRef.current
    if (!el) return

    const svg = d3.select(el)
    svg.selectAll('*').remove()

    const width = el.clientWidth || 600

    const nodeData = nodes.map((n) => ({ ...n }))
    const linkData = edges.map((e) => ({
      source: e.from,
      target: e.to,
      reason: e.reason,
    }))

    const simulation = d3
      .forceSimulation(nodeData)
      .force(
        'link',
        d3
          .forceLink(linkData)
          .id((d) => d.id)
          .distance(90),
      )
      .force('charge', d3.forceManyBody().strength(-220))
      .force('center', d3.forceCenter(width / 2, HEIGHT / 2))
      .force('collision', d3.forceCollide().radius(NODE_RADIUS + 10))
      .stop()

    for (let i = 0; i < 300; i += 1) {
      simulation.tick()
    }

    svg
      .append('defs')
      .append('marker')
      .attr('id', arrowId)
      .attr('viewBox', '0 -4 8 8')
      .attr('refX', NODE_RADIUS + 6)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-4L8,0L0,4')
      .attr('fill', '#94a3b8')

    const root = svg.append('g')

    root
      .append('g')
      .selectAll('line')
      .data(linkData)
      .join('line')
      .attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y)
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 1.5)
      .attr('marker-end', `url(#${arrowId})`)

    root
      .append('g')
      .selectAll('text')
      .data(linkData)
      .join('text')
      .attr('x', (d) => (d.source.x + d.target.x) / 2)
      .attr('y', (d) => (d.source.y + d.target.y) / 2)
      .attr('text-anchor', 'middle')
      .attr('dy', -4)
      .attr('fill', '#9ca3af')
      .attr('font-size', 10)
      .text((d) => d.reason ?? '')

    const nodeG = root
      .append('g')
      .selectAll('g')
      .data(nodeData)
      .join('g')
      .attr('transform', (d) => `translate(${d.x},${d.y})`)
      .style('cursor', onNodeClick ? 'pointer' : 'default')
      .on('click', (_, d) => onNodeClick?.(d.id))

    nodeG
      .append('circle')
      .attr('r', NODE_RADIUS)
      .attr('fill', (d) => severityFill(d.severity))

    nodeG
      .append('text')
      .attr('y', NODE_RADIUS + 14)
      .attr('text-anchor', 'middle')
      .attr('fill', '#d1d5db')
      .attr('font-family', 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace')
      .attr('font-size', 10)
      .text((d) => basename(d.file))

    return () => {
      simulation.stop()
    }
  }, [nodes, edges, onNodeClick, arrowId])

  return (
    <svg
      ref={svgRef}
      width="100%"
      height={HEIGHT}
      style={{ display: 'block' }}
    />
  )
}
