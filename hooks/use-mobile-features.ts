"use client"

import { useEffect, useState } from "react"
import { Capacitor } from "@capacitor/core"
import { App } from "@capacitor/app"
import { StatusBar, Style } from "@capacitor/status-bar"
import { Keyboard } from "@capacitor/keyboard"
import { Haptics, ImpactStyle } from "@capacitor/haptics"
import { Device } from "@capacitor/device"
import { Network } from "@capacitor/network"
import { LocalNotifications } from "@capacitor/local-notifications"
import { Clipboard } from "@capacitor/clipboard"

export function useMobileFeatures() {
  const [isNative, setIsNative] = useState(false)
  const [deviceInfo, setDeviceInfo] = useState<any>(null)
  const [networkStatus, setNetworkStatus] = useState<any>(null)

  useEffect(() => {
    const initMobileFeatures = async () => {
      if (Capacitor.isNativePlatform()) {
        setIsNative(true)

        // Get device info
        const info = await Device.getInfo()
        setDeviceInfo(info)

        // Get network status
        const status = await Network.getStatus()
        setNetworkStatus(status)

        // Set status bar style
        if (Capacitor.getPlatform() === "ios") {
          await StatusBar.setStyle({ style: Style.Light })
        }

        // Listen for app state changes
        App.addListener("appStateChange", ({ isActive }) => {
          console.log("App state changed. Is active?", isActive)
        })

        // Listen for network changes
        Network.addListener("networkStatusChange", (status) => {
          setNetworkStatus(status)
        })

        // Listen for keyboard events
        Keyboard.addListener("keyboardWillShow", (info) => {
          document.body.style.transform = `translateY(-${info.keyboardHeight / 4}px)`
        })

        Keyboard.addListener("keyboardWillHide", () => {
          document.body.style.transform = "translateY(0)"
        })
      }
    }

    initMobileFeatures()

    return () => {
      if (isNative) {
        App.removeAllListeners()
        Network.removeAllListeners()
        Keyboard.removeAllListeners()
      }
    }
  }, [isNative])

  const hapticFeedback = async (style: ImpactStyle = ImpactStyle.Medium) => {
    if (isNative) {
      await Haptics.impact({ style })
    }
  }

  const scheduleNotification = async (title: string, body: string, scheduleAt?: Date) => {
    if (isNative) {
      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body,
            id: Date.now(),
            schedule: scheduleAt ? { at: scheduleAt } : undefined,
          },
        ],
      })
    }
  }

  const copyToClipboard = async (text: string) => {
    if (isNative) {
      await Clipboard.write({ string: text })
    } else {
      await navigator.clipboard.writeText(text)
    }
  }

  const readFromClipboard = async (): Promise<string> => {
    if (isNative) {
      const result = await Clipboard.read()
      return result.value
    } else {
      return await navigator.clipboard.readText()
    }
  }

  return {
    isNative,
    deviceInfo,
    networkStatus,
    hapticFeedback,
    scheduleNotification,
    copyToClipboard,
    readFromClipboard,
  }
}
