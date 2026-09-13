/**
 * riskService.js
 * Risk flag utilities for merchant contract evaluation.
 * Currently a stub — expand with real API calls when the risk engine is available.
 */

/**
 * Returns an array of risk flag objects for a given contract.
 * @param {string} _contractId
 * @returns {Promise<Array>}
 */
export async function getRiskFlags(_contractId) {
  // TODO: Replace with real API call, e.g.:
  // return apiClient.get(`/risk/flags/${_contractId}`);
  return [];
}

export default { getRiskFlags };
