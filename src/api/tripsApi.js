import { apiFetch, API_BASE_URL } from "./apiClient"

export { API_BASE_URL }

const BASE_URL = "/api/trips"

export const tripsApi = {
  /**
   * Fetch all trips with pagination and search
   */
  getTrips: async (page = 1, limit = 10, search = "") => {
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
        throw new Error(errorData.message || "Failed to fetch trips")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Get Trips Error:", error.message)
      throw error
    }
  },

  /**
   * Fetch a single trip by ID
   */
  getTripById: async (id) => {
    try {
      if (!id || id === "undefined") {
        throw new Error("Invalid trip ID")
      }

      const response = await apiFetch(`${BASE_URL}/${id}`, {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch trip")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Get Trip By ID Error:", error.message)
      throw error
    }
  },

  /**
   * Create a new trip
   * @param {Object} payload - Trip data
   * @param {string} payload.tripName - Name of the trip
   * @param {string} payload.tripCode - Trip code
   * @param {string} payload.ship - Ship ID
   * @param {string} payload.departurePort - Departure port ID
   * @param {string} payload.arrivalPort - Arrival port ID
   * @param {string} payload.departureDateTime - Departure date and time (ISO format)
   * @param {string} payload.arrivalDateTime - Arrival date and time (ISO format)
   * @param {string} payload.status - Trip status (e.g., "SCHEDULED")
   * @param {string} payload.bookingOpeningDate - Booking opening date (ISO format)
   * @param {string} payload.bookingClosingDate - Booking closing date (ISO format)
   * @param {string} payload.checkInOpeningDate - Check-in opening date (ISO format)
   * @param {string} payload.checkInClosingDate - Check-in closing date (ISO format)
   * @param {string} payload.boardingClosingDate - Boarding closing date (ISO format)
   */
  createTrip: async (payload) => {
    try {
      console.log("[v0] Creating trip with payload:", payload)

      const response = await apiFetch(BASE_URL, {
        method: "POST",
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create trip")
      }

      const data = await response.json()
      console.log("[v0] Trip created successfully:", data)
      return data
    } catch (error) {
      console.error("[v0] Create Trip Error:", error.message)
      throw error
    }
  },

  /**
   * Update an existing trip
   */
  updateTrip: async (id, payload) => {
    try {
      if (!id || id === "undefined") {
        throw new Error("Invalid trip ID")
      }

      console.log("[v0] Updating trip with ID:", id, "Payload:", payload)

      const response = await apiFetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update trip")
      }

      const data = await response.json()
      console.log("[v0] Trip updated successfully:", data)
      return data
    } catch (error) {
      console.error("[v0] Update Trip Error:", error.message)
      throw error
    }
  },

  /**
   * Delete a trip
   */
  deleteTrip: async (id) => {
    try {
      if (!id || id === "undefined") {
        throw new Error("Invalid trip ID")
      }

      const response = await apiFetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete trip")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Delete Trip Error:", error.message)
      throw error
    }
  },
}
