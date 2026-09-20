'use strict';

const assert = require('node:assert/strict');
const {
  STATE,
  validatePolicyEvaluation
} = require('../../runtime/policy/validate-policy-evaluation');

let passed = 0;

const vectors = [
  [undefined, 'POLICY_EVALUATION_MISSING'],
  [null, 'POLICY_EVALUATION_MISSING'],
  ['INVALID', 'POLICY_EVALUATION_INVALID'],
  [{}, 'POLICY_EVALUATION_PROTO_INVALID'],
  [{ proto: 'WRONG' }, 'POLICY_EVALUATION_PROTO_INVALID'],
  [{
    proto: 'HBCE-POLICY-EVALUATION-v1',
    kind: 'WRONG',
    version: 'v1'
  }, 'POLICY_EVALUATION_KIND_INVALID'],
  [{
    proto: 'HBCE-POLICY-EVALUATION-v1',
    kind: 'HBCE_CORE_POLICY_EVALUATION',
    version: 'WRONG'
  }, 'POLICY_EVALUATION_VERSION_INVALID']
];

for (const [policyEvaluation, reason] of vectors) {
  const actual = validatePolicyEvaluation(policyEvaluation);

  assert.deepEqual(actual, {
    state: STATE.INVALID,
    reason
  });

  console.log(`PASS ${reason}`);
  passed += 1;
}

const authorityBindingVectors = [
  [{
    proto: "HBCE-POLICY-EVALUATION-v1",
    kind: "HBCE_CORE_POLICY_EVALUATION",
    version: "v1",
    policy_evaluation_id: "PEV-001",
    policy_evaluation_version: 1,
    authority_ref: "INVALID"
  }, "POLICY_EVALUATION_AUTHORITY_REF_INVALID"],
  [{
    proto: "HBCE-POLICY-EVALUATION-v1",
    kind: "HBCE_CORE_POLICY_EVALUATION",
    version: "v1",
    policy_evaluation_id: "PEV-001",
    policy_evaluation_version: 1,
    authority_ref: "AUT-001",
    authority_version: 0
  }, "POLICY_EVALUATION_AUTHORITY_VERSION_INVALID"],
  [{
    proto: "HBCE-POLICY-EVALUATION-v1",
    kind: "HBCE_CORE_POLICY_EVALUATION",
    version: "v1",
    policy_evaluation_id: "PEV-001",
    policy_evaluation_version: 1,
    authority_ref: "AUT-001",
    authority_version: 1,
    authority_sha256: "INVALID"
  }, "POLICY_EVALUATION_AUTHORITY_SHA256_INVALID"]
];

for (const [policyEvaluation, reason] of authorityBindingVectors) {
  const actual = validatePolicyEvaluation(policyEvaluation);
  assert.deepEqual(actual, { state: STATE.INVALID, reason });
  console.log(`PASS ${reason}`);
  passed += 1;
}

const policyBindingBase = {
  proto: "HBCE-POLICY-EVALUATION-v1",
  kind: "HBCE_CORE_POLICY_EVALUATION",
  version: "v1",
  policy_evaluation_id: "PEV-001",
  policy_evaluation_version: 1,
  authority_ref: "AUT-001",
  authority_version: 1,
  authority_sha256: "a".repeat(64)
};

const policyBindingVectors = [
  [{
    ...policyBindingBase,
    policy_ref: "X"
  }, "POLICY_EVALUATION_POLICY_REF_INVALID"],
  [{
    ...policyBindingBase,
    policy_ref: "POLICY-001",
    policy_version: 0
  }, "POLICY_EVALUATION_POLICY_VERSION_INVALID"],
  [{
    ...policyBindingBase,
    policy_ref: "POLICY-001",
    policy_version: 1,
    policy_sha256: "INVALID"
  }, "POLICY_EVALUATION_POLICY_SHA256_INVALID"]
];

for (const [policyEvaluation, reason] of policyBindingVectors) {
  const actual = validatePolicyEvaluation(policyEvaluation);
  assert.deepEqual(actual, { state: STATE.INVALID, reason });
  console.log(`PASS ${reason}`);
  passed += 1;
}

const actionBindingBase = {
  proto: "HBCE-POLICY-EVALUATION-v1",
  kind: "HBCE_CORE_POLICY_EVALUATION",
  version: "v1",
  policy_evaluation_id: "PEV-001",
  policy_evaluation_version: 1,
  authority_ref: "AUT-001",
  authority_version: 1,
  authority_sha256: "a".repeat(64),
  policy_ref: "POLICY-001",
  policy_version: 1,
  policy_sha256: "b".repeat(64)
};

const actionBindingVectors = [
  [{ ...actionBindingBase }, "POLICY_EVALUATION_ACTION_BINDING_INVALID"],
  [{
    ...actionBindingBase,
    action_binding: {
      action_class: "x",
      target_ref: "TARGET-001",
      action_sha256: "c".repeat(64),
      request_sha256: "d".repeat(64)
    }
  }, "POLICY_EVALUATION_ACTION_CLASS_INVALID"],
  [{
    ...actionBindingBase,
    action_binding: {
      action_class: "READ",
      target_ref: "x",
      action_sha256: "c".repeat(64),
      request_sha256: "d".repeat(64)
    }
  }, "POLICY_EVALUATION_TARGET_REF_INVALID"],
  [{
    ...actionBindingBase,
    action_binding: {
      action_class: "READ",
      target_ref: "TARGET-001",
      action_sha256: "INVALID",
      request_sha256: "d".repeat(64)
    }
  }, "POLICY_EVALUATION_ACTION_SHA256_INVALID"],
  [{
    ...actionBindingBase,
    action_binding: {
      action_class: "READ",
      target_ref: "TARGET-001",
      action_sha256: "c".repeat(64),
      request_sha256: "INVALID"
    }
  }, "POLICY_EVALUATION_REQUEST_SHA256_INVALID"]
];

for (const [policyEvaluation, reason] of actionBindingVectors) {
  const actual = validatePolicyEvaluation(policyEvaluation);
  assert.deepEqual(actual, { state: STATE.INVALID, reason });
  console.log(`PASS ${reason}`);
  passed += 1;
}

const actionBindingAdditionalProperty = {
  ...actionBindingBase,
  action_binding: {
    action_class: "READ",
    target_ref: "TARGET-001",
    action_sha256: "c".repeat(64),
    request_sha256: "d".repeat(64),
    rogue_field: "NOT_ALLOWED"
  }
};

assert.deepEqual(
  validatePolicyEvaluation(actionBindingAdditionalProperty),
  {
    state: STATE.INVALID,
    reason: "POLICY_EVALUATION_ACTION_BINDING_ADDITIONAL_PROPERTY"
  }
);

console.log("PASS POLICY_EVALUATION_ACTION_BINDING_ADDITIONAL_PROPERTY");
passed += 1;

const canonicalIdentityBase = {
  ...actionBindingBase,
  action_binding: {
    action_class: "READ",
    target_ref: "TARGET-001",
    action_sha256: "c".repeat(64),
    request_sha256: "d".repeat(64)
  }
};

const canonicalIdentityVectors = [
  [
    {
      ...canonicalIdentityBase,
      policy_evaluation_id: "BAD"
    },
    "POLICY_EVALUATION_ID_INVALID"
  ],
  [
    {
      ...canonicalIdentityBase,
      policy_evaluation_id: "PEV-001",
      policy_evaluation_version: 0
    },
    "POLICY_EVALUATION_VERSION_NUMBER_INVALID"
  ]
];

for (const [policyEvaluation, reason] of canonicalIdentityVectors) {
  const actual = validatePolicyEvaluation(policyEvaluation);
  assert.deepEqual(actual, { state: STATE.INVALID, reason });
  console.log(`PASS ${reason}`);
  passed += 1;
}

const canonicalStateBase = {
  ...canonicalIdentityBase,
  policy_evaluation_id: "PEV-001",
  policy_evaluation_version: 1
};

const canonicalStateVectors = [
  [
    { ...canonicalStateBase, state: "SATISFIED" },
    "POLICY_EVALUATION_STATE_INVALID"
  ],
  [
    { ...canonicalStateBase, state: "UNKNOWN" },
    "POLICY_EVALUATION_STATE_INVALID"
  ]
];

for (const [policyEvaluation, reason] of canonicalStateVectors) {
  const actual = validatePolicyEvaluation(policyEvaluation);
  assert.deepEqual(actual, { state: STATE.INVALID, reason });
  console.log(`PASS ${reason}`);
  passed += 1;
}

const evaluatedAtVectors = [
  [
    { ...canonicalStateBase, state: "FAIL" },
    "POLICY_EVALUATION_EVALUATED_AT_INVALID"
  ],
  [
    { ...canonicalStateBase, state: "FAIL", evaluated_at: "not-a-date" },
    "POLICY_EVALUATION_EVALUATED_AT_INVALID"
  ]
];

for (const [policyEvaluation, reason] of evaluatedAtVectors) {
  const actual = validatePolicyEvaluation(policyEvaluation);
  assert.deepEqual(actual, { state: STATE.INVALID, reason });
  console.log(`PASS ${reason}`);
  passed += 1;
}

const evidenceStateBase = {
  ...canonicalStateBase,
  state: "FAIL",
  evaluated_at: "2026-09-19T09:45:00+02:00"
};

const evidenceStateVectors = [
  [
    { ...evidenceStateBase },
    "POLICY_EVALUATION_EVIDENCE_STATE_INVALID"
  ],
  [
    { ...evidenceStateBase, evidence_state: "SATISFIED" },
    "POLICY_EVALUATION_EVIDENCE_STATE_INVALID"
  ]
];

for (const [policyEvaluation, reason] of evidenceStateVectors) {
  const actual = validatePolicyEvaluation(policyEvaluation);
  assert.deepEqual(actual, { state: STATE.INVALID, reason });
  console.log(`PASS ${reason}`);
  passed += 1;
}

const evidenceReferenceBase = {
  ...evidenceStateBase,
  evidence_state: "MISSING"
};

const evidenceReferenceVectors = [
  [
    { ...evidenceReferenceBase, evidence_reference: "" },
    "POLICY_EVALUATION_EVIDENCE_REFERENCE_INVALID"
  ],
  [
    { ...evidenceReferenceBase, evidence_reference: "bad ref" },
    "POLICY_EVALUATION_EVIDENCE_REFERENCE_INVALID"
  ]
];

for (const [policyEvaluation, reason] of evidenceReferenceVectors) {
  const actual = validatePolicyEvaluation(policyEvaluation);
  assert.deepEqual(actual, { state: STATE.INVALID, reason });
  console.log(`PASS ${reason}`);
  passed += 1;
}

const passEvidenceVectors = [
  [
    {
      ...evidenceReferenceBase,
      state: "PASS",
      evidence_reference: null
    },
    "POLICY_EVALUATION_PASS_EVIDENCE_REQUIRED"
  ],
  [
    {
      ...evidenceReferenceBase,
      state: "PASS",
      evidence_state: "PRESENT",
      evidence_reference: null
    },
    "POLICY_EVALUATION_PASS_EVIDENCE_REQUIRED"
  ]
];

for (const [policyEvaluation, reason] of passEvidenceVectors) {
  const actual = validatePolicyEvaluation(policyEvaluation);
  assert.deepEqual(actual, { state: STATE.INVALID, reason });
  console.log(`PASS ${reason}`);
  passed += 1;
}

const payloadSha256Vectors = [
  [
    {
      ...evidenceReferenceBase,
      evidence_reference: null
    },
    "POLICY_EVALUATION_PAYLOAD_SHA256_INVALID"
  ],
  [
    {
      ...evidenceReferenceBase,
      evidence_reference: null,
      payload_sha256: "NOT_A_SHA256"
    },
    "POLICY_EVALUATION_PAYLOAD_SHA256_INVALID"
  ]
];

for (const [policyEvaluation, reason] of payloadSha256Vectors) {
  const actual = validatePolicyEvaluation(policyEvaluation);
  assert.deepEqual(actual, { state: STATE.INVALID, reason });
  console.log(`PASS ${reason}`);
  passed += 1;
}

const appendOnlyBase = {
  ...evidenceReferenceBase,
  evidence_reference: null,
  payload_sha256: "a".repeat(64)
};

const appendOnlyVectors = [
  [
    { ...appendOnlyBase },
    "POLICY_EVALUATION_APPEND_ONLY_INVALID"
  ],
  [
    { ...appendOnlyBase, append_only: false },
    "POLICY_EVALUATION_APPEND_ONLY_INVALID"
  ]
];

for (const [policyEvaluation, reason] of appendOnlyVectors) {
  const actual = validatePolicyEvaluation(policyEvaluation);
  assert.deepEqual(actual, { state: STATE.INVALID, reason });
  console.log(`PASS ${reason}`);
  passed += 1;
}

const genealogyBase = {
  ...appendOnlyBase,
  append_only: true
};

const genealogyRequiredVectors = [
  [
    { ...genealogyBase, genealogy: {} },
    "POLICY_EVALUATION_GENEALOGY_REQUIRED_FIELDS_MISSING"
  ]
];

for (const [policyEvaluation, reason] of genealogyRequiredVectors) {
  const actual = validatePolicyEvaluation(policyEvaluation);
  assert.deepEqual(actual, { state: STATE.INVALID, reason });
  console.log(`PASS ${reason}`);
  passed += 1;
}

const genealogyAdditionalPropertyVectors = [
  [
    {
      ...genealogyBase,
      genealogy: {
        derived_from: null,
        previous_state: null,
        new_state: "FAIL",
        cause: "INITIAL_EVALUATION",
        evidence_reference: null,
        timestamp: "2026-09-19T10:00:00+02:00",
        hash: "a".repeat(64),
        unexpected_field: true
      }
    },
    "POLICY_EVALUATION_GENEALOGY_ADDITIONAL_PROPERTY"
  ]
];

for (const [policyEvaluation, reason] of genealogyAdditionalPropertyVectors) {
  const actual = validatePolicyEvaluation(policyEvaluation);
  assert.deepEqual(actual, { state: STATE.INVALID, reason });
  console.log(`PASS ${reason}`);
  passed += 1;
}

const genealogyDerivedFromVectors = [
  [
    {
      ...genealogyBase,
      genealogy: {
        derived_from: 42,
        previous_state: null,
        new_state: "FAIL",
        cause: "INITIAL_EVALUATION",
        evidence_reference: null,
        timestamp: "2026-09-19T10:00:00+02:00",
        hash: "a".repeat(64)
      }
    },
    "POLICY_EVALUATION_GENEALOGY_DERIVED_FROM_INVALID"
  ]
];

for (const [policyEvaluation, reason] of genealogyDerivedFromVectors) {
  const actual = validatePolicyEvaluation(policyEvaluation);
  assert.deepEqual(actual, { state: STATE.INVALID, reason });
  console.log(`PASS ${reason}`);
  passed += 1;
}

const genealogyPreviousStateVectors = [
  [
    {
      ...genealogyBase,
      genealogy: {
        derived_from: null,
        previous_state: "UNKNOWN",
        new_state: "FAIL",
        cause: "INITIAL_EVALUATION",
        evidence_reference: null,
        timestamp: "2026-09-19T10:00:00+02:00",
        hash: "a".repeat(64)
      }
    },
    "POLICY_EVALUATION_GENEALOGY_PREVIOUS_STATE_INVALID"
  ]
];

for (const [policyEvaluation, reason] of genealogyPreviousStateVectors) {
  const actual = validatePolicyEvaluation(policyEvaluation);
  assert.deepEqual(actual, { state: STATE.INVALID, reason });
  console.log(`PASS ${reason}`);
  passed += 1;
}

const genealogyNewStateVectors = [
  [
    {
      ...genealogyBase,
      genealogy: {
        derived_from: null,
        previous_state: null,
        new_state: "UNKNOWN",
        cause: "INITIAL_EVALUATION",
        evidence_reference: null,
        timestamp: "2026-09-19T10:00:00+02:00",
        hash: "a".repeat(64)
      }
    },
    "POLICY_EVALUATION_GENEALOGY_NEW_STATE_INVALID"
  ]
];

for (const [policyEvaluation, reason] of genealogyNewStateVectors) {
  const actual = validatePolicyEvaluation(policyEvaluation);
  assert.deepEqual(actual, { state: STATE.INVALID, reason });
  console.log(`PASS ${reason}`);
  passed += 1;
}

const genealogyCauseVectors = [
  [
    {
      ...genealogyBase,
      genealogy: {
        derived_from: null,
        previous_state: null,
        new_state: "FAIL",
        cause: 42,
        evidence_reference: null,
        timestamp: "2026-09-19T10:00:00+02:00",
        hash: "a".repeat(64)
      }
    },
    "POLICY_EVALUATION_GENEALOGY_CAUSE_INVALID"
  ]
];

for (const [policyEvaluation, reason] of genealogyCauseVectors) {
  const actual = validatePolicyEvaluation(policyEvaluation);
  assert.deepEqual(actual, { state: STATE.INVALID, reason });
  console.log(`PASS ${reason}`);
  passed += 1;
}

const genealogyEvidenceReferenceVectors = [
  [
    {
      ...genealogyBase,
      genealogy: {
        derived_from: null,
        previous_state: null,
        new_state: "FAIL",
        cause: "INITIAL_EVALUATION",
        evidence_reference: 42,
        timestamp: "2026-09-19T10:00:00+02:00",
        hash: "a".repeat(64)
      }
    },
    "POLICY_EVALUATION_GENEALOGY_EVIDENCE_REFERENCE_INVALID"
  ]
];

for (const [policyEvaluation, reason] of genealogyEvidenceReferenceVectors) {
  const actual = validatePolicyEvaluation(policyEvaluation);
  assert.deepEqual(actual, { state: STATE.INVALID, reason });
  console.log(`PASS ${reason}`);
  passed += 1;
}

const genealogyTimestampVectors = [
  [
    {
      ...genealogyBase,
      genealogy: {
        derived_from: null,
        previous_state: null,
        new_state: "FAIL",
        cause: "INITIAL_EVALUATION",
        evidence_reference: null,
        timestamp: "not-a-date",
        hash: "a".repeat(64)
      }
    },
    "POLICY_EVALUATION_GENEALOGY_TIMESTAMP_INVALID"
  ]
];

for (const [policyEvaluation, reason] of genealogyTimestampVectors) {
  const actual = validatePolicyEvaluation(policyEvaluation);
  assert.deepEqual(actual, { state: STATE.INVALID, reason });
  console.log(`PASS ${reason}`);
  passed += 1;
}

const genealogyHashVectors = [
  [
    {
      ...genealogyBase,
      genealogy: {
        derived_from: null,
        previous_state: null,
        new_state: "FAIL",
        cause: "INITIAL_EVALUATION",
        evidence_reference: null,
        timestamp: "2026-09-19T10:00:00+02:00",
        hash: "invalid-hash"
      }
    },
    "POLICY_EVALUATION_GENEALOGY_HASH_INVALID"
  ]
];

for (const [policyEvaluation, reason] of genealogyHashVectors) {
  const actual = validatePolicyEvaluation(policyEvaluation);
  assert.deepEqual(actual, { state: STATE.INVALID, reason });
  console.log(`PASS ${reason}`);
  passed += 1;
}

const genealogyStateConsistencyVectors = [
  [
    {
      ...genealogyBase,
      state: "FAIL",
      genealogy: {
        derived_from: null,
        previous_state: null,
        new_state: "REVIEW_REQUIRED",
        cause: "INITIAL_EVALUATION",
        evidence_reference: null,
        timestamp: "2026-09-19T10:00:00+02:00",
        hash: "a".repeat(64)
      }
    },
    "POLICY_EVALUATION_GENEALOGY_STATE_MISMATCH"
  ]
];

for (const [policyEvaluation, reason] of genealogyStateConsistencyVectors) {
  const actual = validatePolicyEvaluation(policyEvaluation);
  assert.deepEqual(actual, { state: STATE.INVALID, reason });
  console.log(`PASS ${reason}`);
  passed += 1;
}

const genealogyGenesisDerivedFromVectors = [
  [
    {
      ...genealogyBase,
      state: "FAIL",
      policy_evaluation_version: 1,
      genealogy: {
        derived_from: "PEV-000",
        previous_state: null,
        new_state: "FAIL",
        cause: "INITIAL_EVALUATION",
        evidence_reference: null,
        timestamp: "2026-09-19T10:00:00+02:00",
        hash: "a".repeat(64)
      }
    },
    "POLICY_EVALUATION_GENESIS_DERIVED_FROM_INVALID"
  ]
];

for (const [policyEvaluation, reason] of genealogyGenesisDerivedFromVectors) {
  const actual = validatePolicyEvaluation(policyEvaluation);
  assert.deepEqual(actual, { state: STATE.INVALID, reason });
  console.log(`PASS ${reason}`);
  passed += 1;
}

const genealogyGenesisPreviousStateVectors = [
  [
    {
      ...genealogyBase,
      state: "FAIL",
      policy_evaluation_version: 1,
      genealogy: {
        derived_from: null,
        previous_state: "FAIL",
        new_state: "FAIL",
        cause: "INITIAL_EVALUATION",
        evidence_reference: null,
        timestamp: "2026-09-19T10:00:00+02:00",
        hash: "a".repeat(64)
      }
    },
    "POLICY_EVALUATION_GENESIS_PREVIOUS_STATE_INVALID"
  ]
];

for (const [policyEvaluation, reason] of genealogyGenesisPreviousStateVectors) {
  const actual = validatePolicyEvaluation(policyEvaluation);
  assert.deepEqual(actual, { state: STATE.INVALID, reason });
  console.log(`PASS ${reason}`);
  passed += 1;
}

const genealogyRevisionDerivedFromVectors = [
  [
    {
      ...genealogyBase,
      state: "FAIL",
      policy_evaluation_version: 2,
      genealogy: {
        derived_from: null,
        previous_state: "FAIL",
        new_state: "FAIL",
        cause: "REVISION_EVALUATION",
        evidence_reference: null,
        timestamp: "2026-09-19T10:00:00+02:00",
        hash: "a".repeat(64)
      }
    },
    "POLICY_EVALUATION_REVISION_DERIVED_FROM_REQUIRED"
  ]
];

for (const [policyEvaluation, reason] of genealogyRevisionDerivedFromVectors) {
  const actual = validatePolicyEvaluation(policyEvaluation);
  assert.deepEqual(actual, { state: STATE.INVALID, reason });
  console.log(`PASS ${reason}`);
  passed += 1;
}

const genealogyRevisionPreviousStateVectors = [
  [
    {
      ...genealogyBase,
      state: "FAIL",
      policy_evaluation_version: 2,
      genealogy: {
        derived_from: "PEV-000",
        previous_state: null,
        new_state: "FAIL",
        cause: "REVISION_EVALUATION",
        evidence_reference: null,
        timestamp: "2026-09-19T10:00:00+02:00",
        hash: "a".repeat(64)
      }
    },
    "POLICY_EVALUATION_REVISION_PREVIOUS_STATE_REQUIRED"
  ]
];

for (const [policyEvaluation, reason] of genealogyRevisionPreviousStateVectors) {
  const actual = validatePolicyEvaluation(policyEvaluation);
  assert.deepEqual(actual, { state: STATE.INVALID, reason });
  console.log(`PASS ${reason}`);
  passed += 1;
}

const genealogySelfReferenceVectors = [
  [
    {
      ...genealogyBase,
      policy_evaluation_id: "PEV-SELF",
      policy_evaluation_version: 2,
      state: "FAIL",
      genealogy: {
        derived_from: "PEV-SELF",
        previous_state: "FAIL",
        new_state: "FAIL",
        cause: "REVISION_EVALUATION",
        evidence_reference: null,
        timestamp: "2026-09-19T10:00:00+02:00",
        hash: "a".repeat(64)
      }
    },
    "POLICY_EVALUATION_GENEALOGY_SELF_REFERENCE"
  ]
];

for (const [policyEvaluation, reason] of genealogySelfReferenceVectors) {
  const actual = validatePolicyEvaluation(policyEvaluation);
  assert.deepEqual(actual, { state: STATE.INVALID, reason });
  console.log(`PASS ${reason}`);
  passed += 1;
}

const genealogyVectors = [
  [
    { ...genealogyBase },
    "POLICY_EVALUATION_GENEALOGY_INVALID"
  ],
  [
    { ...genealogyBase, genealogy: [] },
    "POLICY_EVALUATION_GENEALOGY_INVALID"
  ]
];

for (const [policyEvaluation, reason] of genealogyVectors) {
  const actual = validatePolicyEvaluation(policyEvaluation);
  assert.deepEqual(actual, { state: STATE.INVALID, reason });
  console.log(`PASS ${reason}`);
  passed += 1;
}

const sf071CompleteGenesis = {
  ...genealogyBase,
  genealogy: {
    derived_from: null,
    previous_state: null,
    new_state: "FAIL",
    cause: "INITIAL_EVALUATION",
    evidence_reference: null,
    timestamp: "2026-09-19T10:00:00+02:00",
    hash: "a".repeat(64)
  }
};

assert.deepEqual(
  validatePolicyEvaluation(sf071CompleteGenesis),
  {
    state: STATE.VALID,
    reason: "POLICY_EVALUATION_CANONICAL_STRUCTURE_VALID"
  }
);

console.log("PASS SF_071_COMPLETE_GENESIS_REACHES_FINAL_GATE");

console.log(`POLICY_EVALUATION_VALIDATOR=${passed}/${vectors.length + authorityBindingVectors.length + policyBindingVectors.length + actionBindingVectors.length + 1 + canonicalIdentityVectors.length + canonicalStateVectors.length + evaluatedAtVectors.length + evidenceStateVectors.length + evidenceReferenceVectors.length + passEvidenceVectors.length + payloadSha256Vectors.length + appendOnlyVectors.length + genealogyRequiredVectors.length + genealogyAdditionalPropertyVectors.length + genealogyDerivedFromVectors.length + genealogyPreviousStateVectors.length + genealogyNewStateVectors.length + genealogyCauseVectors.length + genealogyEvidenceReferenceVectors.length + genealogyTimestampVectors.length + genealogyHashVectors.length + genealogyStateConsistencyVectors.length + genealogyGenesisDerivedFromVectors.length + genealogyGenesisPreviousStateVectors.length + genealogyRevisionDerivedFromVectors.length + genealogyRevisionPreviousStateVectors.length + genealogySelfReferenceVectors.length + genealogyVectors.length} PASS`);
