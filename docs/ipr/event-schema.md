# IPR Event Schema

This document defines the minimal event structure used by the Identity Primary Record (IPR) layer.

An IPR event represents a recorded action performed by an identifiable entity within the infrastructure.

The purpose of the schema is to ensure that actions can be attributed, recorded, and reconstructed over time.

---

## Event Concept

Every operational event links three elements:

- an identifiable entity
- an action performed by that entity
- a timestamp indicating when the action occurred

These elements allow the reconstruction of operational history within the infrastructure.

---

## Minimal Event Structure

The minimal structure of an IPR event contains the following fields:

- entity  
- action  
- timestamp  
- context

### Field description

**entity**

Identifier representing the actor performing the action.  
Entities may include human operators, artificial intelligence systems, machines, or digital services.

**action**

Description of the operation performed.

**timestamp**

Time at which the event occurred.  
The recommended format is ISO-8601.

**context**

Optional field describing the operational environment in which the action took place.

---

## Conceptual Event Flow

ENTITY  
↓  
ACTION  
↓  
IPR EVENT  
↓  
INFRASTRUCTURE RECORD

---

## Example JSON Representation

```json
{
  "entity": "entity-id",
  "action": "action-type",
  "timestamp": "2026-03-11T12:00:00Z",
  "context": "hbce-platform"
}


---

Infrastructure Position

Within the Reality Engineering framework, IPR events operate between identity and infrastructure layers.

IDENTITY
↓
IPR EVENT
↓
HBCE INFRASTRUCTURE

The event schema allows infrastructure systems to maintain traceable operational history.

---




Quello è interessante perché definisce come nasce un nodo della rete HBCE. È lì che il sistema inizia a sembrare una vera architettura infrastrutturale.
