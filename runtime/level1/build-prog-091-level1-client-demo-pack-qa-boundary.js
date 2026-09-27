'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_CLIENT_DEMO_PACK_QA_BOUNDARY_DEFINED_NOT_CLIENT_READY';
const SOURCE_REF = 'docs/launch/level1/prog-090-level1-client-demo-pack-script.json';

const ALLOWED_QUESTION_CLASSES = Object.freeze([
  'decision_proof_problem',
  'synthetic_demo_scope',
  'evidence_index_navigation',
  'authority_boundary',
  'policy_evaluation_record',
  'action_request_receipt_audit_flow',
  'evidence_export_and_replay',
  'human_acceptance',
  'demo_readiness_snapshot',
  'non_claims_boundary',
  'future_pilot_requirements'
]);

const DEFERRED_QUESTION_CLASSES = Object.freeze([
  'customer_data_validation',
  'live_system_control',
  'production_integration',
  'legal_validity',
  'public_accreditation',
  'procurement_eligibility',
  'pricing_commitment',
  'sla_commitment',
  'security_certification',
  'ai_authority',
  'external_effect_proof',
  'banking_pack_readiness'
]);

const APPROVED_QA = Object.freeze([
  {
    question_class: 'decision_proof_problem',
    allowed_answer: 'The demo shows how a digital decision can be bounded, recorded, replayed and accepted under explicit human authority.',
    evidence_phase: 'OPENING_PROBLEM_FRAME'
  },
  {
    question_class: 'synthetic_demo_scope',
    allowed_answer: 'The demo is synthetic-only. It uses no customer data, controls no live system and does not prove production operation.',
    evidence_phase: 'SYNTHETIC_DEMO_CONTEXT'
  },
  {
    question_class: 'evidence_index_navigation',
    allowed_answer: 'The evidence index lists the controlled Level 1 Decision Proof evidence chain and validates the indexed artifact hashes.',
    evidence_phase: 'EVIDENCE_INDEX_WALKTHROUGH'
  },
  {
    question_class: 'authority_boundary',
    allowed_answer: 'JOKER-C2 is not a public authority, legal authority or autonomous execution authority. Authority remains bounded by human and governance records.',
    evidence_phase: 'AUTHORITY_BOUNDARY_WALKTHROUGH'
  },
  {
    question_class: 'policy_evaluation_record',
    allowed_answer: 'The policy evaluation is an evidence-bound record. It does not create autonomous authorization or live execution authority.',
    evidence_phase: 'POLICY_EVALUATION_WALKTHROUGH'
  },
  {
    question_class: 'action_request_receipt_audit_flow',
    allowed_answer: 'Request, receipt and audit event are separate records. A receipt confirms evidence capture, not external effect in a live system.',
    evidence_phase: 'ACTION_REQUEST_RECEIPT_AUDIT_WALKTHROUGH'
  },
  {
    question_class: 'evidence_export_and_replay',
    allowed_answer: 'The evidence export and verifier replay show replayable synthetic consistency inside the demo boundary.',
    evidence_phase: 'EVIDENCE_EXPORT_AND_VERIFIER_REPLAY_WALKTHROUGH'
  },
  {
    question_class: 'human_acceptance',
    allowed_answer: 'Human acceptance is explicitly recorded and attested. AI does not accept or sign on behalf of the human authority.',
    evidence_phase: 'HUMAN_ACCEPTANCE_WALKTHROUGH'
  },
  {
    question_class: 'demo_readiness_snapshot',
    allowed_answer: 'The demo readiness snapshot confirms synthetic Decision Proof demo readiness only. It does not imply client-pack, launch or production readiness.',
    evidence_phase: 'DEMO_READINESS_SNAPSHOT_WALKTHROUGH'
  },
  {
    question_class: 'non_claims_boundary',
    allowed_answer: 'No legal validity, public accreditation, procurement eligibility, pricing, SLA or security certification is claimed in this demo pack.',
    evidence_phase: 'NON_CLAIMS_AND_BOUNDARY_RECAP'
  },
  {
    question_class: 'future_pilot_requirements',
    allowed_answer: 'Future pilot requirements must be captured as separate controlled artifacts and must not be presented as already satisfied by this synthetic demo.',
    evidence_phase: 'CLIENT_QUESTIONS_BOUNDARY'
  }
]);

const DEFERRED_ANSWERS = Object.freeze([
  {
    question_class: 'customer_data_validation',
    required_response: 'This demo uses no customer data. Customer-data validation requires a future controlled pilot artifact.'
  },
  {
    question_class: 'live_system_control',
    required_response: 'This demo controls no live system. Live system control is outside this boundary.'
  },
  {
    question_class: 'production_integration',
    required_response: 'This demo is not a production integration and must not be presented as production readiness.'
  },
  {
    question_class: 'legal_validity',
    required_response: 'This demo does not create legal validity. Legal validation requires separate legal review and artifact scope.'
  },
  {
    question_class: 'public_accreditation',
    required_response: 'This demo does not create public accreditation.'
  },
  {
    question_class: 'procurement_eligibility',
    required_response: 'This demo does not create procurement eligibility.'
  },
  {
    question_class: 'pricing_commitment',
    required_response: 'This demo does not create pricing commitment.'
  },
  {
    question_class: 'sla_commitment',
    required_response: 'This demo does not create SLA commitment.'
  },
  {
    question_class: 'security_certification',
    required_response: 'This demo does not create security certification.'
  },
  {
    question_class: 'ai_authority',
    required_response: 'This demo does not authorize AI authority or autonomous execution authority.'
  },
  {
    question_class: 'external_effect_proof',
    required_response: 'This demo does not prove external operational effect.'
  },
  {
    question_class: 'banking_pack_readiness',
    required_response: 'This demo does not make the banking pack ready.'
  }
]);

function readJson(rootDir, rel) {
  return JSON.parse(fs.readFileSync(path.join(rootDir, rel), 'utf8'));
}

function gitHead(rootDir) {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: rootDir, encoding: 'utf8' }).trim();
  } catch (_err) {
    return 'UNKNOWN';
  }
}

function validHash(doc) {
  if (!doc || !doc.revision_hash) return false;
  const body = { ...doc };
  delete body.revision_hash;
  return doc.revision_hash === sha256Digest(body);
}

function scriptEvidenceByPhase(source) {
  const out = {};
  for (const section of source.client_demo_pack_script.script_sections) {
    out[section.phase] = {
      source_script_section_number: section.section_number,
      presenter_line: section.presenter_line,
      evidence_issues: section.evidence_issues,
      evidence_refs: section.evidence_refs,
      all_evidence_refs_bound: section.all_evidence_refs_bound
    };
  }
  return out;
}

function buildApprovedAnswers(source) {
  const byPhase = scriptEvidenceByPhase(source);
  return APPROVED_QA.map((entry, index) => ({
    qa_number: index + 1,
    question_class: entry.question_class,
    allowed_answer: entry.allowed_answer,
    evidence_phase: entry.evidence_phase,
    evidence_binding: byPhase[entry.evidence_phase] || null,
    evidence_bound: Boolean(byPhase[entry.evidence_phase] && byPhase[entry.evidence_phase].all_evidence_refs_bound === true),
    may_expand_answer: false,
    must_preserve_boundary_language: true
  }));
}

function buildDeferredAnswers() {
  return DEFERRED_ANSWERS.map((entry, index) => ({
    defer_number: index + 1,
    question_class: entry.question_class,
    required_response: entry.required_response,
    answer_policy: 'DEFER_TO_FUTURE_CONTROLLED_ARTIFACT',
    may_improvise: false,
    must_not_convert_to_readiness_claim: true
  }));
}

function buildQaBoundaryPayload(source) {
  const approvedAnswers = buildApprovedAnswers(source);
  const deferredAnswers = buildDeferredAnswers();

  return {
    qa_boundary_id: 'CLIENT-DEMO-PACK-QA-BOUNDARY::HBCE-L1-DECISION-PROOF-0001',
    source_script_ref: SOURCE_REF,
    source_script_digest: source.client_demo_pack_script.script_payload_digest,
    pack_scope: source.client_demo_pack_script.pack_scope,
    pack_status: 'QA_BOUNDARY_DEFINED_NOT_CLIENT_READY',
    qa_scope: 'LEVEL1_DECISION_PROOF_CLIENT_DEMO_PACK_SYNTHETIC_ONLY',
    qa_mode: 'CONTROLLED_CLIENT_DEMO_QA_BOUNDARY',
    defined_at: '2027-01-19T16:15:00Z',
    target_audience: source.client_demo_pack_script.target_audience,
    allowed_question_classes: ALLOWED_QUESTION_CLASSES,
    deferred_question_classes: DEFERRED_QUESTION_CLASSES,
    approved_answers: approvedAnswers,
    approved_answer_count: approvedAnswers.length,
    deferred_answers: deferredAnswers,
    deferred_answer_count: deferredAnswers.length,
    all_allowed_question_classes_have_answers: ALLOWED_QUESTION_CLASSES.every((cls) => approvedAnswers.some((answer) => answer.question_class === cls)),
    all_deferred_question_classes_have_responses: DEFERRED_QUESTION_CLASSES.every((cls) => deferredAnswers.some((answer) => answer.question_class === cls)),
    all_approved_answers_evidence_bound: approvedAnswers.every((answer) => answer.evidence_bound === true),
    qa_controls: [
      'answer_only_allowed_question_classes',
      'use_approved_answer_language',
      'show_evidence_binding_when_answering',
      'defer_out_of_boundary_questions',
      'do_not_claim_client_pack_readiness',
      'do_not_claim_launch_readiness',
      'do_not_claim_production_readiness',
      'do_not_claim_legal_validity',
      'do_not_claim_security_certification',
      'do_not_authorize_ai_authority'
    ],
    qa_boundary: {
      synthetic_demo_only: true,
      script_required: true,
      runbook_required: true,
      evidence_index_required: true,
      no_customer_data: true,
      no_live_system_control: true,
      no_production_integration: true,
      no_legal_validity_claim: true,
      no_public_accreditation_claim: true,
      no_procurement_eligibility_claim: true,
      no_external_effect_claim: true,
      no_business_success_claim: true,
      no_ai_authority_claim: true,
      no_pricing_commitment: true,
      no_sla_commitment: true,
      no_security_certification_claim: true
    },
    client_demo_pack_runbook_ready: true,
    client_demo_pack_script_ready: true,
    client_demo_pack_q_and_a_boundary_ready: true,
    client_demo_pack_readiness_gate_passed: false,
    public_surface_ready: false,
    external_customer_ready: false,
    banking_pack_ready: false,
    level1_client_pack_ready: false,
    level1_launch_ready: false,
    production_ready: false,
    qa_boundary_comment: 'The client demo pack Q&A boundary is defined for controlled answering inside the synthetic Level 1 Decision Proof demo. It makes client questions boundary-safe, but does not make the client demo pack ready, public-surface-ready, launch-ready, banking-ready or production-ready.',
    ai_qa_authority_allowed: false
  };
}

function buildLevel1ClientDemoPackQaBoundary(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);
  const qaPayload = buildQaBoundaryPayload(source);

  const qaChecklist = {
    source_script_hash_valid: validHash(source),
    script_ready: source.readiness_state.client_demo_pack_script_ready === true,
    runbook_ready: source.readiness_state.client_demo_pack_runbook_ready === true,
    evidence_index_ready: source.readiness_state.client_demo_pack_evidence_index_ready === true,
    scope_locked: source.readiness_state.client_demo_pack_scope_locked === true,
    decision_proof_demo_ready_confirmed: source.readiness_state.decision_proof_demo_ready === true,
    all_allowed_question_classes_have_answers: qaPayload.all_allowed_question_classes_have_answers,
    all_deferred_question_classes_have_responses: qaPayload.all_deferred_question_classes_have_responses,
    all_approved_answers_evidence_bound: qaPayload.all_approved_answers_evidence_bound,
    launch_readiness_excluded: source.readiness_state.level1_launch_ready === false,
    client_pack_readiness_excluded: source.readiness_state.level1_client_pack_ready === false,
    production_readiness_excluded: source.readiness_state.production_ready === false,
    ai_authority_absence_confirmed: source.non_claims.ai_authority === false
  };

  const doc = {
    proto: 'HBCE-L1-PROG-091-CLIENT-DEMO-PACK-QA-BOUNDARY-v1',
    kind: 'HBCE_LEVEL1_CLIENT_DEMO_PACK_QA_BOUNDARY',
    document_code: 'HBCE-L1-CLIENT-DEMO-PACK-QA-BOUNDARY-2027-PROG-091',
    issue_id: 'PROG-091',
    priority: 'LEVEL1-CLIENT-DEMO-PACK-QA-BOUNDARY',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_client_demo_pack_script_ref: SOURCE_REF,
    source_client_demo_pack_script_revision_hash: source.revision_hash,
    source_client_demo_pack_script_revision_hash_valid: validHash(source),

    level1_client_demo_pack_qa_boundary_status: STATUS,

    inherited_client_demo_script_boundary: {
      script_status: source.level1_client_demo_pack_script_status,
      pack_scope: source.client_demo_pack_script.pack_scope,
      pack_status: source.client_demo_pack_script.pack_status,
      script_scope: source.client_demo_pack_script.script_scope,
      script_mode: source.client_demo_pack_script.script_mode,
      script_ready: source.readiness_state.client_demo_pack_script_ready,
      all_script_phases_defined: source.readiness_state.all_script_phases_defined,
      all_script_sections_evidence_bound: source.readiness_state.all_script_sections_evidence_bound,
      prior_q_and_a_boundary_ready: source.readiness_state.client_demo_pack_q_and_a_boundary_ready,
      prior_readiness_gate_passed: source.readiness_state.client_demo_pack_readiness_gate_passed,
      prior_public_surface_ready: source.readiness_state.public_surface_ready,
      prior_external_customer_ready: source.readiness_state.external_customer_ready,
      prior_banking_pack_ready: source.readiness_state.banking_pack_ready,
      prior_level1_client_pack_ready: source.readiness_state.level1_client_pack_ready,
      prior_level1_launch_ready: source.readiness_state.level1_launch_ready,
      prior_production_ready: source.readiness_state.production_ready
    },

    client_demo_pack_qa_boundary: {
      ...qaPayload,
      qa_boundary_payload_digest: sha256Digest(qaPayload),
      qa_checklist: qaChecklist,
      qa_boundary_defined: true,
      qa_boundary_is_not_client_pack_readiness: true,
      qa_boundary_is_not_launch_readiness: true,
      qa_boundary_is_not_public_surface_readiness: true,
      qa_boundary_is_not_external_customer_readiness: true,
      qa_boundary_is_not_banking_pack_readiness: true,
      qa_boundary_is_not_production_readiness: true,
      qa_boundary_is_not_legal_validity: true,
      qa_boundary_is_not_security_certification: true
    },

    fail_closed_codes: [
      'CLIENT_DEMO_PACK_QA_BOUNDARY_MISSING',
      'SOURCE_CLIENT_DEMO_PACK_SCRIPT_HASH_INVALID',
      'CLIENT_DEMO_PACK_SCRIPT_NOT_READY',
      'ALLOWED_QUESTION_CLASS_WITHOUT_APPROVED_ANSWER',
      'DEFERRED_QUESTION_CLASS_WITHOUT_RESPONSE',
      'APPROVED_ANSWER_EVIDENCE_REF_MISSING',
      'CUSTOMER_DATA_CLAIM_BLOCKED',
      'LIVE_SYSTEM_CONTROL_CLAIM_BLOCKED',
      'UNSUPPORTED_READINESS_CLAIM',
      'AI_QA_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      client_demo_pack_q_and_a_boundary_defined: true,
      client_demo_pack_q_and_a_boundary_ready: true,
      source_client_demo_pack_script_bound: true,
      client_demo_pack_script_ready: true,
      client_demo_pack_runbook_ready: true,
      client_demo_pack_evidence_index_ready: true,
      client_demo_pack_scope_locked: true,
      decision_proof_demo_ready: true,
      all_allowed_question_classes_have_answers: qaPayload.all_allowed_question_classes_have_answers,
      all_deferred_question_classes_have_responses: qaPayload.all_deferred_question_classes_have_responses,
      all_approved_answers_evidence_bound: qaPayload.all_approved_answers_evidence_bound,
      qa_controls_defined: true,
      client_demo_pack_readiness_gate_passed: false,
      public_surface_required: true,
      public_surface_ready: false,
      external_customer_ready: false,
      banking_pack_ready: false,
      level1_client_pack_ready: false,
      level1_launch_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-092-HBCE-LEVEL1-CLIENT-DEMO-PACK-READINESS-GATE',

    non_claims: {
      legal_validity: false,
      public_accreditation: false,
      procurement_eligibility: false,
      external_effect_proven: false,
      business_success: false,
      ai_authority: false,
      autonomous_authority: false,
      client_pack_ready: false,
      public_surface_ready: false,
      external_customer_ready: false,
      banking_pack_ready: false,
      level1_launch_ready: false,
      production_ready: false
    }
  };

  doc.revision_hash = sha256Digest(doc);
  return doc;
}

function writeLevel1ClientDemoPackQaBoundary(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildLevel1ClientDemoPackQaBoundary({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-091-level1-client-demo-pack-qa-boundary.json';
  const doc = writeLevel1ClientDemoPackQaBoundary(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_091_LEVEL1_CLIENT_DEMO_PACK_QA_BOUNDARY_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  ALLOWED_QUESTION_CLASSES,
  DEFERRED_QUESTION_CLASSES,
  APPROVED_QA,
  DEFERRED_ANSWERS,
  buildApprovedAnswers,
  buildDeferredAnswers,
  buildQaBoundaryPayload,
  buildLevel1ClientDemoPackQaBoundary,
  writeLevel1ClientDemoPackQaBoundary
};
