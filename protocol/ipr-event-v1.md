# IPR Event Protocol v1

This document defines the first protocol specification for Identity Primary Record (IPR) events.

The protocol describes how operational events are structured and recorded within infrastructures implementing the Reality Engineering framework.

---

# Protocol Purpose

The IPR event protocol provides a standardized format for recording actions performed by identifiable entities.

The protocol enables:

- persistent identity attribution
- structured event recording
- reconstruction of operational history

---

# Event Model

Each event represents a single recorded action.

Minimal event structure:

ENTITY  
ACTION  
TIMESTAMP  
CONTEXT  

---

# Event Fields

## entity

Identifier representing the actor performing the action.

Possible entity types:

- human operator
- artificial intelligence system
- autonomous machine
- infrastructure node

---

## action

Description of the operation performed by the entity.

Examples:

- node_initialized
- event_recorded
- infrastructure_updated

---

## timestamp

Time at which the action occurred.

Recommended format:

ISO-8601

Example:

2026-03-11T12:00:00Z

---

## context

Infrastructure environment in which the event occurred.

Example:

hbce-platform

---

# Example Event

```json
{
  "entity": "hbce-node-001",
  "action": "node_initialized",
  "timestamp": "2026-03-11T12:00:00Z",
  "context": "hbce-platform"
}

Protocol Position
Within the Reality Engineering framework, the event protocol operates between identity and infrastructure layers.
IDENTITY (IPR)
↓
EVENT PROTOCOL
↓
HBCE INFRASTRUCTURE
Version
Protocol version: v1
