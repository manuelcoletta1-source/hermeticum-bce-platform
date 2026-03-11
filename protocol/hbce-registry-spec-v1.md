# HBCE Registry Specification v1

This document defines the structure and purpose of the HBCE registry layer.

The registry exposes the observable state of the infrastructure by publishing nodes and events in structured formats.

---

# Registry Purpose

The registry enables public visibility of infrastructure activity.

It allows the system to expose:

- registered infrastructure nodes
- recorded operational events
- infrastructure state over time

The registry operates as a public data layer within the HBCE infrastructure.

---

# Registry Components

The registry is composed of two main structures:

- node registry
- event registry

These are represented by two files in the repository.

---

# Node Registry

Node registry file:

`registry/nodes.json`

The node registry lists the nodes currently defined in the infrastructure.

Minimal node structure:

- node_id
- environment
- identity_layer
- coordination_engine
- status
- description

Example:

```json
{
  "node_id": "hbce-node-001",
  "environment": "hbce-platform",
  "identity_layer": "ipr",
  "coordination_engine": "joker-c2",
  "status": "active",
  "description": "HBCE primary infrastructure node"
}


---

Event Registry

Event registry file:

registry/events.json

The event registry lists operational events recorded within the infrastructure.

Minimal event structure:

event_id

entity

action

timestamp

context

status

description


Example:

{
  "event_id": "hbce-event-0001",
  "entity": "hbce-node-001",
  "action": "node_initialized",
  "timestamp": "2026-03-11T12:00:00Z",
  "context": "hbce-platform",
  "status": "recorded",
  "description": "Initial registration of the primary HBCE infrastructure node"
}


---

Registry Position in the Framework

Within the Reality Engineering framework, the registry layer operates inside the infrastructure.

REALITY ENGINEERING
↓
HBCE INFRASTRUCTURE
↓
REGISTRY LAYER
↓
NODES / EVENTS


---

Repository Location

Registry files are located in:

registry/

registry/nodes.json

registry/events.json


These files represent the observable state of the HBCE infrastructure.


---

Version

Specification version: v1

---



