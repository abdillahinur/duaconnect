"use client"

import React, { useState, useEffect } from 'react'
import { ArrowRightIcon, BookOpenIcon, StarIcon } from "lucide-react"

import DailyInspiration from '../components/DailyInspiration'

export default function DailyInspirationPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <DailyInspiration />
    </main>
  )
}