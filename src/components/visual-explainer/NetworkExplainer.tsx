import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
}

interface Route {
  name: string;
  path: string[];
  hops: number;
  fee: string;
  time: string;
}

const NetworkExplainer: React.FC = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeRoute, setActiveRoute] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // Update dimensions on mount and window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);
  
  // Define node positions based on container percentages rather than hardcoded pixels
  const nodes: Node[] = [
    { id: 'you', label: 'You', x: 15, y: 15, color: 'bg-blue-800' },
    { id: 'nodeA', label: 'Node A', x: 60, y: 15, color: 'bg-gray-400' },
    { id: 'nodeB', label: 'Node B', x: 35, y: 80, color: 'bg-gray-400' },
    { id: 'nodeC', label: 'Node C', x: 80, y: 35, color: 'bg-gray-400' },
    { id: 'shop', label: 'Shop', x: 80, y: 80, color: 'bg-green-600' }
  ];
  
  // Define routes and their paths through the nodes
  const routes: Route[] = [
    { 
      name: 'Direct Route', 
      path: ['you', 'shop'], 
      hops: 1, 
      fee: '1 sat', 
      time: '<1 sec' 
    },
    { 
      name: 'Two-Hop Route', 
      path: ['you', 'nodeB', 'shop'], 
      hops: 2, 
      fee: '2 sats', 
      time: '<1 sec' 
    },
    { 
      name: 'Multi-Hop Route', 
      path: ['you', 'nodeA', 'nodeC', 'shop'], 
      hops: 3, 
      fee: '3 sats', 
      time: '<1 sec' 
    },
  ];
  
  // Convert node percentages to actual pixel coordinates
  const getNodeCoordinates = (node: Node) => {
    return {
      x: (node.x / 100) * dimensions.width,
      y: (node.y / 100) * dimensions.height
    };
  };
  
  // Generate SVG path for animation
  const generateAnimationPath = (routeIndex: number) => {
    if (!routes[routeIndex]) return [];
    
    const path = routes[routeIndex].path;
    const coords = path.map(nodeId => {
      const node = nodes.find(n => n.id === nodeId);
      if (!node) return { x: 0, y: 0 };
      return getNodeCoordinates(node);
    });
    
    return coords.map(coord => [coord.x, coord.y]);
  };
  
  const startAnimation = (routeIndex: number) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setActiveRoute(routeIndex);
    
    // Reset after animation completes
    setTimeout(() => {
      setIsAnimating(false);
      setActiveRoute(null);
    }, 3000);
  };
  
  // Calculate node position as style
  const nodePosition = (node: Node) => {
    return {
      left: `${node.x}%`,
      top: `${node.y}%`,
      transform: 'translate(-50%, -50%)' // Center the node on its coordinates
    };
  };
  
  // Generate connections between nodes
  const generateConnections = () => {
    const connections = [
      { from: 'you', to: 'nodeA' },
      { from: 'you', to: 'nodeB' },
      { from: 'you', to: 'shop' }, // Direct connection for direct route
      { from: 'nodeA', to: 'nodeC' },
      { from: 'nodeB', to: 'shop' },
      { from: 'nodeC', to: 'shop' }
    ];
    
    return connections.map((conn, index) => {
      const fromNode = nodes.find(n => n.id === conn.from);
      const toNode = nodes.find(n => n.id === conn.to);
      
      if (!fromNode || !toNode) return null;
      
      const fromCoords = getNodeCoordinates(fromNode);
      const toCoords = getNodeCoordinates(toNode);
      
      return (
        <line
          key={`conn-${index}`}
          x1={fromCoords.x}
          y1={fromCoords.y}
          x2={toCoords.x}
          y2={toCoords.y}
          // stroke="#CBD5E0"
          // strokeWidth="3"
        />
      );
    });
  };

  return (
    <div className="bg-white shadow overflow-hidden rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Lightning Network Routing</h2>
        
        <div className="mb-6">
          <p className="text-gray-600">
            Lightning Network uses a mesh of payment channels to route transactions between users who don't have direct channels.
            This is how the network creates global connectivity with minimal trust.
          </p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div ref={containerRef} className="relative h-64">
            {/* Network Nodes */}
            {nodes.map(node => (
              <div 
                key={node.id}
                className="absolute"
                style={nodePosition(node)}
              >
                <div className={`w-16 h-16 ${node.color} rounded-full flex items-center justify-center`}>
                  <span className="text-white font-bold">{node.label}</span>
                </div>
              </div>
            ))}
            
            {/* Connection Lines and Animation */}
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
              {/* Connection Lines */}
              {dimensions.width > 0 && generateConnections()}
              
              {/* Animation Circle */}
              {activeRoute !== null && dimensions.width > 0 && (
                <motion.circle 
                  cx={0}
                  cy={0}
                  r="6"
                  fill="#10B981"
                  filter="drop-shadow(0 0 3px rgba(16, 185, 129, 0.7))"
                  initial={{ 
                    cx: generateAnimationPath(activeRoute)[0][0],
                    cy: generateAnimationPath(activeRoute)[0][1]
                  }}
                  animate={{
                    cx: generateAnimationPath(activeRoute).map(coord => coord[0]),
                    cy: generateAnimationPath(activeRoute).map(coord => coord[1])
                  }}
                  transition={{ 
                    duration: 2,
                    times: Array.from({ length: generateAnimationPath(activeRoute).length }).map(
                      (_, i) => i / (generateAnimationPath(activeRoute).length - 1)
                    )
                  }}
                  style={{ zIndex: 10 }}
                />
              )}
            </svg>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {routes.map((route, index) => (
            <button
              key={route.name}
              onClick={() => startAnimation(index)}
              disabled={isAnimating}
              className={`p-4 rounded-lg border-2 ${
                activeRoute === index 
                  ? 'border-blue-800 bg-blue-800/10' 
                  : 'border-gray-200 hover:border-gray-300'
              } ${isAnimating && activeRoute !== index ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <h3 className="font-medium">{route.name}</h3>
              <div className="mt-2 text-sm text-gray-600">
                <div>Hops: {route.hops}</div>
                <div>Fee: {route.fee}</div>
                <div>Time: {route.time}</div>
              </div>
            </button>
          ))}
        </div>
        
        <div className="mt-6">
          <h3 className="font-semibold text-gray-700 mb-2">Key Routing Concepts:</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>Payments can route through multiple channels to reach destinations</li>
            <li>Each "hop" adds a small fee to incentivize node operators</li>
            <li>Routes are discovered automatically by your Lightning wallet</li>
            <li>Multiple possible routes create resilience and payment reliability</li>
            <li>Even with multiple hops, payments complete in less than a second</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NetworkExplainer;