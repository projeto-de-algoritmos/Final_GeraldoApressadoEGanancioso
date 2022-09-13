import Node from './Node';
import Graph, { WILD_FACTOR } from './Graph';
import mapData from '../assets/mapData';

// eslint-disable-next-line
export const calculateDistance = (coordA, coordB) => Math.sqrt((coordA.x - coordB.x) ** 2 + (coordA.y - coordB.y) ** 2);

export const loadMapData = (fastTravel = true) => {
  const graph = new Graph();
  const roads = [];
  const pois = [];
  const edges = [];
  const nodes = {};

  mapData.points_of_interest.forEach((poi) => {
    const node = new Node(poi.id, poi.coordinates, poi.properties);

    graph.addNode(node);

    pois.push(node);

    nodes[poi.id] = node;
  });

  mapData.roads.forEach((road) => {
    const node = new Node(road.id, road.coordinates, road.properties);

    graph.addNode(node);

    roads.push(node);
    nodes[road.id] = node;
  });

  mapData.edges.forEach((edge) => {
    const nodeA = graph.getNode(edge[0]).node;
    const nodeB = graph.getNode(edge[1]).node;
    const wildEdge = Graph.isWieldEdge(nodeA, nodeB);
    const cost = calculateDistance(
      nodeA.coordinates,
      nodeB.coordinates,
    ) * (wildEdge ? WILD_FACTOR : 1);

    graph.addEdge(edge[0], edge[1], cost);
    edges.push({ from: edge[0], to: edge[1], cost });
  });

  if (fastTravel) {
    const signpostsCombinations = mapData.signposts.flatMap(
      (v, i) => mapData.signposts.slice(i + 1).map((w) => [v, w]),
    );

    signpostsCombinations.forEach((edge) => {
      graph.addEdge(edge[0], edge[1], 1);
    });
  }

  return {
    graph, roads, pois, edges, nodes,
  };
};
