# HBCE Network

The HBCE network represents the distributed infrastructure layer of the Reality Engineering framework.

The network connects nodes, identities, events, and coordination mechanisms in a structured technological environment.

---

# Network Concept

The HBCE network is composed of infrastructure nodes that generate and record operational events.

These events are associated with identifiable entities and become part of the observable infrastructure history.

---

# Network Components

The network is composed of several interacting components.

## Nodes

Infrastructure nodes host operational environments and services.

Node specification:

protocol/hbce-node-spec-v1.md

Nodes represent operational points within the network.

---

## Identity Layer

The identity layer associates actions with identifiable entities.

Identity specification:

protocol/ipr-event-v1.md

This layer enables attribution of actions across the network.

---

## Event Layer

Events represent actions performed by entities within the infrastructure.

Events form the historical record of the network.

Event records are exposed through the registry layer.

---

## Registry

The registry provides the observable state of the network.

Registry files:

registry/nodes.json  
registry/events.json

These files publish the nodes and recorded events of the infrastructure.

---

## Coordination Engine

Operational coordination across the network is performed by the Joker-C2 engine.

Documentation:

docs/joker-c2/coordination-engine.md

---

# Network Flow

The operational flow of the network can be represented as:

ENTITY  
↓  
ACTION  
↓  
IPR EVENT  
↓  
HBCE NODE  
↓  
REGISTRY  
↓  
NETWORK HISTORY

---

# Network Role

Within the Reality Engineering framework, the HBCE network provides the infrastructure layer supporting technological environments and operational traceability.

REALITY ENGINEERING  
↓  
HBCE NETWORK  
↓  
NODES / EVENTS / REGISTRY
