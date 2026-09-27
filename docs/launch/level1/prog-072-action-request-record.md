# HBCE PROG-072 - Level 1 Action Request Record

Status: LEVEL1_ACTION_REQUEST_RECORD_DEFINED_NOT_READY

## Purpose

This artifact defines the action request record required after authority boundary and policy evaluation, before an action receipt can be recorded.

It does not execute an action.

It does not record a receipt.

It does not prove an effect.

It does not allow AI model authority.

## Request Rule

An action request requires an authority boundary reference and a policy evaluation reference.

The policy evaluation must allow the action before the request can proceed.

BLOCK blocks the action request.

UNKNOWN blocks the action request.

The action request is not execution.

The action request is not a receipt.

The action request is not effect proof.

## Required Bindings

An action request record requires target reference, target digest, request payload digest, requester reference, idempotency key, expected receipt reference and evidence chain reference.

Missing authority boundary fails closed.

Missing policy evaluation fails closed.

Missing digest fails closed.

Missing idempotency key fails closed.

AI action authority claims fail closed.

## Next Required Program

PROG-073-HBCE-LEVEL1-ACTION-RECEIPT-RECORD.
