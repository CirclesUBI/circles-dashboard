import CirclesAnalysis from '@circles/analysis';

CirclesAnalysis.setConfiguration({
  endpoint: `${process.env.GRAPH_NODE_EXTERNAL}/subgraphs/name/${process.env.SUBGRAPH_NAME}`,
  safeAddress: process.env.SAFE_ADDRESS,
});

export default CirclesAnalysis;
