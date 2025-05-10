"use client"

import type React from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TeacherDifficultyProps {
  difficultySeeing: string
  setDifficultySeeing: (value: string) => void
  difficultyHearing: string
  setDifficultyHearing: (value: string) => void
  difficultyTalking: string
  setDifficultyTalking: (value: string) => void
  difficultySelfCare: string
  setDifficultySelfCare: (value: string) => void
  difficultyWalking: string
  setDifficultyWalking: (value: string) => void
  difficultyRecalling: string
  setDifficultyRecalling: (value: string) => void
}

const TeacherDifficulty: React.FC<TeacherDifficultyProps> = ({
  difficultySeeing,
  setDifficultySeeing,
  difficultyHearing,
  setDifficultyHearing,
  difficultyTalking,
  setDifficultyTalking,
  difficultySelfCare,
  setDifficultySelfCare,
  difficultyWalking,
  setDifficultyWalking,
  difficultyRecalling,
  setDifficultyRecalling,
}) => {
  return (
    <div className="grid gap-4">
      <div className="grid lg:grid-cols-3 sm:grid-cols-1 gap-2">
        <div className="space-y-2">
          <Label htmlFor="difficulty-seeing">Difficulty Seeing</Label>
          <Select value={difficultySeeing} onValueChange={setDifficultySeeing}>
            <SelectTrigger id="difficulty-seeing">
              <SelectValue placeholder="Select difficulty level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">No difficulty (1)</SelectItem>
              <SelectItem value="2">Some difficulty (2)</SelectItem>
              <SelectItem value="3">A lot of difficulty (3)</SelectItem>
              <SelectItem value="4">Cannot see at all (4)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="difficulty-hearing">Difficulty Hearing</Label>
          <Select value={difficultyHearing} onValueChange={setDifficultyHearing}>
            <SelectTrigger id="difficulty-hearing">
              <SelectValue placeholder="Select difficulty level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">No difficulty (1)</SelectItem>
              <SelectItem value="2">Some difficulty (2)</SelectItem>
              <SelectItem value="3">A lot of difficulty (3)</SelectItem>
              <SelectItem value="4">Cannot hear at all (4)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="difficulty-talking">Difficulty Talking</Label>
          <Select value={difficultyTalking} onValueChange={setDifficultyTalking}>
            <SelectTrigger id="difficulty-talking">
              <SelectValue placeholder="Select difficulty level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">No difficulty (1)</SelectItem>
              <SelectItem value="2">Some difficulty (2)</SelectItem>
              <SelectItem value="3">A lot of difficulty (3)</SelectItem>
              <SelectItem value="4">Cannot talk at all (4)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 sm:grid-cols-1 gap-2">
        <div className="space-y-2">
          <Label htmlFor="difficulty-self-care">Difficulty Self-Care</Label>
          <Select value={difficultySelfCare} onValueChange={setDifficultySelfCare}>
            <SelectTrigger id="difficulty-self-care">
              <SelectValue placeholder="Select difficulty level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">No difficulty (1)</SelectItem>
              <SelectItem value="2">Some difficulty (2)</SelectItem>
              <SelectItem value="3">A lot of difficulty (3)</SelectItem>
              <SelectItem value="4">Cannot do self-care at all (4)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="difficulty-walking">Difficulty Walking</Label>
          <Select value={difficultyWalking} onValueChange={setDifficultyWalking}>
            <SelectTrigger id="difficulty-walking">
              <SelectValue placeholder="Select difficulty level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">No difficulty (1)</SelectItem>
              <SelectItem value="2">Some difficulty (2)</SelectItem>
              <SelectItem value="3">A lot of difficulty (3)</SelectItem>
              <SelectItem value="4">Cannot walk at all (4)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="difficulty-recalling">Difficulty Recalling</Label>
          <Select value={difficultyRecalling} onValueChange={setDifficultyRecalling}>
            <SelectTrigger id="difficulty-recalling">
              <SelectValue placeholder="Select difficulty level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">No difficulty (1)</SelectItem>
              <SelectItem value="2">Some difficulty (2)</SelectItem>
              <SelectItem value="3">A lot of difficulty (3)</SelectItem>
              <SelectItem value="4">Cannot recall at all (4)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

export default TeacherDifficulty
