# HBCE Network Architecture v1

This document describes the conceptual architecture of the HBCE network.

The HBCE network is an experimental technological infrastructure designed to support verifiable operational environments.

The architecture connects identity, events, nodes, and coordination layers.

---

# Architecture Overview

The network is composed of four primary layers:

- Identity layer
- Event layer
- Infrastructure nodes
- Coordination engine

Together these layers form the operational structure of the system.

---

# Identity Layer

The identity layer is provided by the Identity Primary Record (IPR).

IPR associates actions with identifiable entities.

Entities may include:

- human operators
- artificial intelligence systems
- machines
- infrastructure nodes

The identity layer enables attribution of actions within the system.

---

# Event Layer

Operational activity is represented through events.

Events follow the IPR event protocol defined in:

`protocol/ipr-event-v1.md`

Each event links:

ENTITY  
↓  
ACTION  
↓  
TIMESTAMP  
↓  
CONTEXT

Events form the historical record of the infrastructure.

---

# Infrastructure Nodes

The infrastructure layer is composed of HBCE nodes.

Node specification is defined in:

`protocol/hbce-node-spec-v1.md`

Nodes host:

- event structures
- infrastructure services
- registry integration

Each node represents an operational point within the network.

---

# Registry Layer

The registry exposes the observable state of the infrastructure.

Registry specification is defined in:

`protocol/hbce-registry-spec-v1.md`

The registry publishes:

- infrastructure nodes
- recorded events

Registry files:

`registry/nodes.json`  
`registry/events.json`

---

# Coordination Layer

The coordination layer is represented by the Joker-C2 engine.

Joker-C2 orchestrates operational activity across the network.

The coordination layer interacts with:

- nodes
- identities
- events

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
REGISTRY RECORD  
↓  
NETWORK HISTORY

---

# Architecture Position

Within the Reality Engineering framework, the HBCE network operates as the infrastructure layer.

REALITY ENGINEERING  
↓  
HBCE NETWORK  
↓  
NODES / EVENTS / REGISTRY  
↓  
TECHNOLOGICAL CIVILIZATION MODEL

---

# Version

Architecture specification version: v1
