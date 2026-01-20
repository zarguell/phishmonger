import type { ArrowPath } from '../../hooks/useArrowCalculations'

interface ArrowOverlayProps {
  paths: ArrowPath[]
}

export function ArrowOverlay({ paths }: ArrowOverlayProps) {
  return (
    <svg
      className="arrow-overlay"
      width="1600"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="10"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#FF4500" />
        </marker>
      </defs>
      {paths.map((path) => (
        <path
          key={path.lureId}
          d={`M ${path.start.x} ${path.start.y} L ${path.mid1.x} ${path.mid1.y} L ${path.mid2.x} ${path.mid2.y} L ${path.end.x} ${path.end.y}`}
          stroke="#FF4500"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrowhead)"
        />
      ))}
    </svg>
  )
}