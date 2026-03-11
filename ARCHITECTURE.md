# HBCE System Architecture

This document provides a high-level overview of the HBCE infrastructure architecture.

HBCE is an experimental infrastructure designed to support verifiable technological environments within the Reality Engineering framework.

---

# Architectural Layers

The system is organized into several interacting layers.

1. Identity layer (IPR)
2. Event protocol layer
3. Infrastructure nodes
4. Registry layer
5. Coordination engine (Joker-C2)

These layers together form the operational architecture of the system.

---

# Identity Layer

The identity layer is implemented through the Identity Primary Record (IPR).

The purpose of IPR is to associate actions with identifiable entities.

Entities may include:

- human operators
- artificial intelligence systems
- machines
- infrastructure nodes

---

# Event Protocol

Operational activity is represented through events.

Event specification:

`protocol/ipr-event-v1.md`

Events capture actions performed by entities and allow reconstruction of operational history.

---

# Infrastructure Nodes

The infrastructure layer consists of HBCE nodes.

Node specification:

`protocol/hbce-node-spec-v1.md`

Nodes host infrastructure services and integrate with the event and identity layers.

---

# Registry Layer

The registry exposes the observable state of the infrastructure.

Registry specification:

`protocol/hbce-registry-spec-v1.md`

Registry files:

- `registry/nodes.json`
- `registry/events.json`

These files provide a structured representation of nodes and recorded events.

---

# Coordination Engine

Operational coordination across the infrastructure is managed by the Joker-C2 engine.

Coordination documentation:

`docs/joker-c2/coordination-engine.md`

---

# Network Architecture

The architecture of the HBCE network is described in:

`protocol/hbce-network-architecture-v1.md`

This document defines the interaction between identities, events, nodes, and the registry layer.

---

# Conceptual Flow

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
INFRASTRUCTURE HISTORY

---

# Framework Context

HBCE operates as the infrastructure layer of the Reality Engineering framework.

REALITY ENGINEERING  
↓  
HBCE INFRASTRUCTURE  
↓  
NODES / EVENTS / REGISTRY
