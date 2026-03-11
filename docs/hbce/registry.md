# HBCE Registry

This document describes the registry layer of the HBCE infrastructure.

The registry provides a public, structured view of nodes and events recorded within the system.

---

## Purpose

The registry exists to expose the observable state of the infrastructure.

It allows the system to publish:

- registered nodes
- recorded events
- infrastructure activity over time

This makes the infrastructure readable as a public operational environment.

---

## Registry Components

The current registry layer is composed of two main files:

- `registry/nodes.json`
- `registry/events.json`

### nodes.json

The node registry lists the infrastructure nodes currently defined in the system.

Each node entry describes:

- node identifier
- environment
- identity layer
- coordination engine
- status
- description

### events.json

The event registry lists recorded infrastructure events.

Each event entry describes:

- event identifier
- entity
- action
- timestamp
- context
- status
- description

---

## Conceptual Structure

NODE REGISTRY  
↓  
INFRASTRUCTURE NODES  

EVENT REGISTRY  
↓  
RECORDED ACTIONS  

Together, these files expose the observable structure of the HBCE system.

---

## Framework Position

Within the Reality Engineering framework, the registry layer operates inside the HBCE infrastructure.

REALITY ENGINEERING  
↓  
HBCE INFRASTRUCTURE  
↓  
REGISTRY LAYER  
↓  
NODES / EVENTS

---

## Repository Context

In this repository, the registry layer provides the first public operational representation of the HBCE infrastructure.

It supports documentation, traceability, and structured observation of the system over time.
