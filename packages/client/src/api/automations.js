import { notificationStore } from "../store/notification"
import API from "./api"
/**
 * Executes an automation. Must have "App Action" trigger.
 */
export const triggerAutomation = async (automationId, fields) => {
  const res = await API.post({
    url: `/api/automations/${automationId}/trigger`,
    body: { fields },
  })
  res.error
    ? notificationStore.danger("An error has occurred")
    : notificationStore.success("Automation triggered")
  return res
}
