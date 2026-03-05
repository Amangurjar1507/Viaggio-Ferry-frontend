import { apiFetch, API_BASE_URL } from "./apiClient"

export { API_BASE_URL }

const BASE_URL = "/api/partners"

export const partnersApi = {
  /**
   * Fetch all partners with pagination and search
   */
  getPartners: async (page = 1, limit = 100, search = "") => {
    try {
      const params = new URLSearchParams()
      if (page) params.append("page", page)
      if (limit) params.append("limit", limit)
      if (search) params.append("search", search)

      const response = await apiFetch(`${BASE_URL}?${params.toString()}`, {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch partners")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Get Partners Error:", error.message)
      throw error
    }
  },

  /**
   * Fetch a single partner by ID
   */
  getPartnerById: async (id) => {
    try {
      if (!id || id === "undefined") {
        throw new Error("Invalid partner ID")
      }

      const response = await apiFetch(`${BASE_URL}/${id}`, {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch partner")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Get Partner Error:", error.message)
      throw error
    }
  },
}
