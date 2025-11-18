export type NotificationPermissionState = 'default' | 'granted' | 'denied' | 'unsupported'

export const getNotificationPermission = (): NotificationPermissionState => {
  if (typeof Notification === 'undefined') return 'unsupported'
  return Notification.permission
}

export const requestNotificationPermission = async (): Promise<NotificationPermissionState> => {
  const current = getNotificationPermission()
  if (current === 'granted' || current === 'denied' || current === 'unsupported') return current
  try {
    const result = await Notification.requestPermission()
    return result
  } catch {
    return 'denied'
  }
}

export const sendNotification = (title: string, options?: NotificationOptions) => {
  if (getNotificationPermission() !== 'granted') return
  try {
    new Notification(title, options)
  } catch {
    // ignore failures (e.g., blocked)
  }
}
