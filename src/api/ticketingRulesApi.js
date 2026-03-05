import { apiFetch, API_BASE_URL } from "./apiClient"

export { API_BASE_URL }

const BASE_URL = "/api/ticketing-rules"

export const ticketingRulesApi = {
  /**
   * Fetch ticketing rules with pagination, search, and rule type filter
   */
  getRules: async (page = 1, limit = 10, search = "", ruleType = "") => {
    try {
      const params = new URLSearchParams()
      if (page) params.append("page", page)
      if (limit) params.append("limit", limit)
      if (search) params.append("search", search)
      if (ruleType) params.append("ruleType", ruleType)

      console.log("[v0] Fetching ticketing rules with params:", {
        page,
        limit,
        search,
        ruleType
      })

      const response = await apiFetch(`${BASE_URL}?${params.toString()}`, {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch ticketing rules")
      }

      const data = await response.json()
      console.log("[v0] Ticketing rules fetched successfully:", data)
      return data
    } catch (error) {
      console.error("[v0] Get Ticketing Rules Error:", error.message)
      throw error
    }
  },

  /**
   * Fetch a single ticketing rule by ID
   */
  getRuleById: async (id) => {
    try {
      if (!id || id === "undefined") {
        throw new Error("Invalid rule ID")
      }

      const response = await apiFetch(`${BASE_URL}/${id}`, {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch rule")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Get Rule By ID Error:", error.message)
      throw error
    }
  },

  /**
   * Create a new ticketing rule
   */
  createRule: async (payload) => {
    try {
      const response = await apiFetch(BASE_URL, {
        method: "POST",
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create rule")
      }

      const data = await response.json()
      console.log("[v0] Ticketing rule created successfully:", data)
      return data
    } catch (error) {
      console.error("[v0] Create Rule Error:", error.message)
      throw error
    }
  },

  /**
   * Update a ticketing rule
   */
  updateRule: async (id, payload) => {
    try {
      if (!id || id === "undefined") {
        throw new Error("Invalid rule ID")
      }

      const response = await apiFetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update rule")
      }

      const data = await response.json()
      console.log("[v0] Ticketing rule updated successfully:", data)
      return data
    } catch (error) {
      console.error("[v0] Update Rule Error:", error.message)
      throw error
    }
  },

  /**
   * Delete a ticketing rule
   */
  deleteRule: async (id) => {
    try {
      if (!id || id === "undefined") {
        throw new Error("Invalid rule ID")
      }

      const response = await apiFetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete rule")
      }

      const data = await response.json()
      console.log("[v0] Ticketing rule deleted successfully:", data)
      return data
    } catch (error) {
      console.error("[v0] Delete Rule Error:", error.message)
      throw error
    }
  },
}
