class HBCEContractError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'HBCEContractError';
    this.code = code;
    this.details = Object.freeze({ ...details });
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      details: this.details
    };
  }
}

class HBCEValidationError extends HBCEContractError {
  constructor(code, message, details = {}) {
    super(code, message, details);
    this.name = 'HBCEValidationError';
  }
}

function failClosed(code, message, details = {}) {
  throw new HBCEValidationError(code, message, details);
}

module.exports = {
  HBCEContractError,
  HBCEValidationError,
  failClosed
};
